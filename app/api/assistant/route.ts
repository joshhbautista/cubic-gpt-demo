import { createClient, sql } from '@vercel/postgres';
import { experimental_AssistantResponse } from 'ai';
import OpenAI from 'openai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

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
    data: { assistantId: string };
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

                  switch (toolCall.function.name) {
                    case 'get_pending_cases': {
                      const { rows } = await sql`
                      SELECT * FROM cases
                      LEFT JOIN patients ON cases.patient_id = patients.patient_id
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

                    // case 'get_patient_history': {

                    //   return {
                    //     tool_call_id: toolCall.id,
                    //     output: 'patient history',
                    //   };
                    // }

                    // case 'get_case_details': {

                    //   return {
                    //     tool_call_id: toolCall.id,
                    //     output: 'case details',
                    //   };
                    // }

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
