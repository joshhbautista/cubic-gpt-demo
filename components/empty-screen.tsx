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
      heading: 'Cases with Requested Drug',
      message: `Show me all the cases that are requesting drug Tramadol.`
    },
    {
      heading: 'Case Overview by Status',
      message: `Show me all the cases that are Awaiting CA Reply.`
    }
  ],
  [ASSISTANT_NAMES.Pharmacist]: [
    {
      heading: 'Overview of Today’s Tasks',
      message: `What are my main tasks for today?`
    },
    {
      heading: 'Make Decisions on Cases',
      message: `Log case ID 43459 as Approved.`
    },
    {
      heading: 'Medication Dosage Confirmation',
      message: `What is the recommended dosage for medication X for a patient in case ID 00001?`
    },
    {
      heading: 'Patient Medication History',
      message: `Provide the medication history for case ID 00001.`
    }
  ],
  [ASSISTANT_NAMES.ClinicalCoordinator]: [
    {
      heading: 'Prepare Draft Communication',
      message: `Can you prepare a draft communication for case ID #00001?`
    },
    {
      heading: 'Query by Decision',
      message: `Can you list all the case ID's with decision 'Approved'?`
    }
  ],
  [ASSISTANT_NAMES.MedicalAccessCoordinator]: [
    {
      heading: 'Retrieve Final Decision',
      message: `What's the final decision for case ID #91933?`
    },
    {
      heading: 'Query by Decision',
      message: `Can you list all the case ID's with decision 'Approved'?`
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
          {assistantToMessagesMap[ASSISTANT_ID_TO_NAME[assistantId]]?.map(
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
