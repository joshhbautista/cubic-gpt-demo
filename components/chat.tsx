'use client';

import { experimental_useAssistant as useAssistant } from 'ai/react';
import { cn } from '@/lib/utils';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyScreen } from '@/components/empty-screen';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';

interface ChatProps extends React.ComponentProps<'div'> {
  assistantId: string;
}

export default function Chat({ assistantId, className }: ChatProps) {
  const { status, messages, input, submitMessage, handleInputChange, error } =
    useAssistant({
      api: '/api/assistant'
    });

  return (
    <>
      <div
        style={{ height: '40rem !important', overflowY: 'auto' }}
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
      >
        {error != null && (
          <div className="relative bg-red-500 text-white px-6 py-4 mb-4 rounded-md">
            <span className="block sm:inline">
              Error: {(error as any).toString()}
            </span>
          </div>
        )}

        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={status === 'in_progress'} />
          </>
        ) : (
          <EmptyScreen assistantId={assistantId} />
        )}
      </div>
      <ChatPanel
        isLoading={status === 'in_progress'}
        assistantId={assistantId}
        submitMessage={submitMessage}
        handleInputChange={handleInputChange}
        input={input}
      />
    </>
  );
}
