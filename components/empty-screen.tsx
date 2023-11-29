import { Bold, Flex, Subtitle } from '@tremor/react';
import { ASSISTANT_ID_TO_NAME } from '@/lib/config';
import { ASSISTANT_NAMES } from '@/lib/types';

const assistantToMessagesMap: Record<
  ASSISTANT_NAMES,
  { heading: string; message: string }[]
> = {
  [ASSISTANT_NAMES.Administrator]: [
    {
      heading: 'Overview of Today’s Tasks',
      message: `What are my main tasks for today?`
    },
    {
      heading: 'System Performance Report',
      message: `Generate a report on the system's performance for this week.`
    },
    {
      heading: 'User Activity Overview',
      message: `Show me an overview of user activity for the past month.`
    }
  ],
  [ASSISTANT_NAMES.Pharmacist]: [
    {
      heading: 'Drug Interaction Query',
      message: `Check for interactions between drug A and drug B.`
    },
    {
      heading: 'Medication Dosage Confirmation',
      message: `What is the recommended dosage for medication X for a patient with condition Y?`
    },
    {
      heading: 'Patient Medication History',
      message: `Provide the medication history for patient ID 12345.`
    }
  ],
  [ASSISTANT_NAMES.ClinicalCoordinator]: [
    {
      heading: 'Case Prioritization',
      message: `Which cases should I prioritize today?`
    },
    {
      heading: 'Clinical Trial Eligibility',
      message: `Is patient ID 67890 eligible for the upcoming clinical trial?`
    },
    {
      heading: 'Patient Follow-Up Schedule',
      message: `Create a follow-up schedule for patients discharged last week.`
    }
  ],
  [ASSISTANT_NAMES.MedicalAccessCoordinator]: [
    {
      heading: 'Patient Assistance Program Eligibility',
      message: `Check if patient ID 54321 is eligible for any patient assistance programs.`
    },
    {
      heading: 'Insurance Claim Status',
      message: `What is the status of the insurance claim for patient ID 98765?`
    },
    {
      heading: 'Medication Access Barriers',
      message: `Identify potential barriers to medication access for patient ID 11223.`
    }
  ]
};

interface EmptyScreenProps {
  assistantId: string;
}

export function EmptyScreen({ assistantId }: EmptyScreenProps) {
  return (
    <div
      style={{ height: '40rem !important', overflowY: 'auto' }}
      className="mx-auto max-w-2xl px-4"
    >
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to the Cubic AI Assistant!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is demo showcasing how we can integrate OpenAI API&apos;s into
          the FACET program.
        </p>
        <p className="mb-2 leading-normal text-muted-foreground">
          Select an AI Assistant from the dropdown above to get started.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {assistantToMessagesMap[ASSISTANT_ID_TO_NAME[assistantId]].map(
            (message, index) => (
              <Flex key={index} flexDirection="col" alignItems="start">
                <Bold className="h-auto p-0 text-base">{message.heading}</Bold>
                <Subtitle>{message.message}</Subtitle>
              </Flex>
            )
          )}
        </div>
      </div>
    </div>
  );
}
