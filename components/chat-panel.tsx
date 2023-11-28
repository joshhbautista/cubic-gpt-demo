import { type UseAssistantHelpers } from 'ai/react';
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';

export interface ChatPanelProps
  extends Pick<
    UseAssistantHelpers,
    'submitMessage' | 'input' | 'handleInputChange'
  > {
  isLoading: boolean;
  assistantId: string;
}

export function ChatPanel({
  isLoading,
  assistantId,
  submitMessage,
  input,
  handleInputChange
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            submitMessage={submitMessage}
            handleInputChange={handleInputChange}
            input={input}
            isLoading={isLoading}
            assistantId={assistantId}
          />
        </div>
      </div>
    </div>
  );
}
