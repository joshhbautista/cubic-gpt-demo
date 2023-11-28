'use client';

import { useEffect, useRef } from 'react';
import { Message, experimental_useAssistant as useAssistant } from 'ai/react';
import { ASSISTANT_NAMES } from '@/lib/types';
import { ASSISTANT_ID_TO_NAME } from '@/lib/config';

const roleToColorMap: Record<Message['role'], string> = {
  system: 'red',
  user: 'black',
  function: 'blue',
  assistant: 'green'
};

const assistantToPlaceholderMap: Record<ASSISTANT_NAMES, string> = {
  [ASSISTANT_NAMES.Administrator]:
    'Ask about case statuses or triage assistance',
  [ASSISTANT_NAMES.Pharmacist]: 'Inquire about a case or drug interactions',
  [ASSISTANT_NAMES.ClinicalCoordinator]:
    'Ask for case details or report guidance',
  [ASSISTANT_NAMES.MedicalAccessCoordinator]:
    'Query FACET decisions or communication guidance'
};

interface ChatProps {
  assistantId: string;
}

export default function Chat({ assistantId }: ChatProps) {
  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({
      api: '/api/assistant'
    });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
    }
  }, [status]);

  return (
    <div
      style={{ height: '35rem', maxHeight: '35rem' }}
      className="flex justify-end flex-col w-full max-w-md py-24 mx-auto stretch bg-gray-100 rounded-l-tremor-default overflow-x-auto"
    >
      {error != null && (
        <div className="relative bg-red-500 text-white px-6 py-4 rounded-md">
          <span className="block sm:inline">
            Error: {(error as any).toString()}
          </span>
        </div>
      )}

      {messages.map((m: Message) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
          style={{ color: roleToColorMap[m.role] }}
        >
          <strong>{`${m.role}: `}</strong>
          {m.content}
          <br />
          <br />
        </div>
      ))}

      {status === 'in_progress' && (
        <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
      )}

      <form
        onSubmit={(e) =>
          submitMessage(e, { data: { assistantId: assistantId } })
        }
      >
        <input
          ref={inputRef}
          disabled={status !== 'awaiting_message'}
          className="fixed bottom-0 w-full max-w-md p-2 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder={
            assistantToPlaceholderMap[ASSISTANT_ID_TO_NAME[assistantId]]
          }
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
