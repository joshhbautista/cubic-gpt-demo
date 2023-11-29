import { createClient, sql } from '@vercel/postgres';
import { experimental_AssistantResponse } from 'ai';
import OpenAI from 'openai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';
import { CaseDetailsModel } from '@/lib/types';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
    data: { caseId: string; assistantId: string };
  } = await req.json();

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: input.message
  });

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ threadId, sendMessage }) => {
      // Run the assistant on the thread
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id:
          input.data.assistantId ??
          (() => {
            throw new Error('ASSISTANT_ID is not set');
          })()
      });

      async function waitForRun(run: OpenAI.Beta.Threads.Runs.Run) {
        // Poll for status change
        while (run.status === 'queued' || run.status === 'in_progress') {
          // delay for 500ms:
          await new Promise((resolve) => setTimeout(resolve, 500));

          run = await openai.beta.threads.runs.retrieve(threadId!, run.id);
        }

        // Check the run status
        if (
          run.status === 'cancelled' ||
          run.status === 'cancelling' ||
          run.status === 'failed' ||
          run.status === 'expired'
        ) {
          throw new Error(run.status);
        }

        if (run.status === 'requires_action') {
          if (run.required_action?.type === 'submit_tool_outputs') {
            const tool_outputs = await Promise.all(
              run.required_action.submit_tool_outputs.tool_calls.map(
                async (toolCall) => {
                  const parameters = JSON.parse(toolCall.function.arguments);
                  const client = createClient();
                  await client.connect();

                  const caseId = input.data.caseId;

                  switch (toolCall.function.name) {
                    case 'get_pending_cases': {
                      const { rows } = await sql`
                      SELECT * FROM cases
                      LEFT JOIN patients ON cases.patient_id = patients.patient_id
                      LEFT JOIN status ON cases.status_id = status.status_id
                      WHERE status_id = 1
                     `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'search_patient': {
                      const { rows } = await sql`
                      SELECT * FROM patients
                      LEFT JOIN cases ON patients.patient_id = cases.patient_id
                      LEFT JOIN status ON cases.status_id = status.status_id
                      WHERE name ILIKE ${'%' + parameters.search_term + '%'} OR
                      disease ILIKE ${'%' + parameters.search_term + '%'};
                     `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'list_cases_by_status': {
                      const { rows } = await sql`
                        SELECT * FROM cases
                        LEFT JOIN patients ON cases.patient_id = patients.patient_id
                        LEFT JOIN status ON cases.status_id = status.status_id
                        WHERE label ILIKE ${
                          '%' + parameters.status_label + '%'
                        };
                      `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'get_case_details': {
                      const { rows } = await sql`
                        SELECT * FROM cases
                        LEFT JOIN patients ON cases.patient_id = patients.patient_id
                        LEFT JOIN status ON cases.status_id = status.status_id
                        WHERE case_id = ${
                          !!caseId ? caseId : parameters.case_id
                        };
                      `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'list_cases_by_requested_drug': {
                      const { rows } = await sql`
                        SELECT * FROM cases
                        LEFT JOIN patients ON cases.patient_id = patients.patient_id
                        LEFT JOIN status ON cases.status_id = status.status_id
                        WHERE drug_requested ILIKE ${
                          '%' + parameters.requested_drug + '%'
                        };
                      `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'update_case_status': {
                      const { rows } = await sql`
                        UPDATE cases
                        SET status_id = ${parameters.status_id}
                        WHERE case_id = ${parameters.case_id}
                        RETURNING *;
                      `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'log_pharmacist_decision': {
                      const { rows } = await sql`
                        UPDATE cases
                        SET decision = ${parameters.decision}, status_id = 6
                        WHERE case_id = ${parameters.case_id}
                        RETURNING *;
                      `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows)
                      };
                    }

                    case 'prepare_draft_communication': {
                      const { rows } = await sql<CaseDetailsModel>`
                        SELECT * FROM cases
                        LEFT JOIN patients ON cases.patient_id = patients.patient_id
                        LEFT JOIN status ON cases.status_id = status.status_id
                        WHERE case_id = ${
                          !!caseId ? caseId : parameters.case_id
                        };
                      `;

                      const decision = rows[0].decision;
                      let draftCommunication: string = '';

                      switch (decision) {
                        case 'Approved': {
                          draftCommunication = `
                          Subject: Update on Your Case Status (Case ID: ${rows[0].case_id})

                          Dear ${rows[0].name},

                          I hope this message finds you well. I am writing to share some good news regarding your recent request (Case ID: ${rows[0].case_id}). I am pleased to inform you that your case has been reviewed and approved.
                          This means that the requested ${rows[0].drug_requested} will be provided as per your healthcare plan.

                          If you have any questions or need further assistance regarding this process, please feel free to reach out. Our team is here to support you every step of the way.

                          Warm regards,

                          [Your Name]

                          Clinical Coordinator
                          `;
                        }

                        case 'Denied': {
                          draftCommunication = `
                          Subject: Important Information About Your Case (Case ID: ${rows[0].case_id}})

                          Dear ${rows[0].name},

                          I am reaching out regarding the status of your recent request (Case ID: ${rows[0].case_id}). After a thorough review, we regret to inform you that your case has been denied.

                          Please know that we understand this may be disappointing news. Our team is available to discuss alternative options or to provide additional information on why this decision was made.
                          We are committed to supporting you and exploring other ways to meet your healthcare needs.

                          Sincerely,

                          [Your Name]

                          Clinical Coordinator
                          `;
                        }

                        case 'In Progress': {
                          draftCommunication = `
                          Subject: Update on Your Ongoing Case (Case ID: ${rows[0].case_id})

                          Dear ${rows[0].name},

                          I am writing to provide an update on the status of your case (Case ID: ${rows[0].case_id}). Your request is currently in progress and is being given the careful attention it deserves.
                          We understand the importance of this matter and are working diligently to reach a decision as soon as possible.

                          If there are any changes or additional information required, we will reach out to you directly. In the meantime, if you have any questions or concerns, please do not hesitate to
                          contact our team.

                          Best wishes,

                          [Your Name]

                          Clinical Coordinator
                          `;
                        }
                      }

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify({
                          phoneNumber: rows[0].phone_number,
                          draftCommunication
                        })
                      };
                    }

                    case 'get_final_decision': {
                      const { rows } = await sql`
                          SELECT * FROM cases
                          LEFT JOIN patients ON cases.patient_id = patients.patient_id
                          LEFT JOIN status ON cases.status_id = status.status_id
                          WHERE case_id = ${
                            !!caseId ? caseId : parameters.case_id
                          };
                        `;

                      return {
                        tool_call_id: toolCall.id,
                        output: JSON.stringify(rows[0].decision)
                      };
                    }

                    default:
                      throw new Error(
                        `Unknown tool call function: ${toolCall.function.name}`
                      );
                  }
                }
              )
            );

            run = await openai.beta.threads.runs.submitToolOutputs(
              threadId!,
              run.id,
              { tool_outputs }
            );

            await waitForRun(run);
          }
        }
      }

      await waitForRun(run);

      // Get new thread messages (after our message)
      const responseMessages = (
        await openai.beta.threads.messages.list(threadId, {
          after: createdMessage.id,
          order: 'asc'
        })
      ).data;

      // Send the messages
      for (const message of responseMessages) {
        sendMessage({
          id: message.id,
          role: 'assistant',
          content: message.content.filter(
            (content) => content.type === 'text'
          ) as Array<MessageContentText>
        });
      }
    }
  );
}
