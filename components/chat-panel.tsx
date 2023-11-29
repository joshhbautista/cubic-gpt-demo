import { type UseAssistantHelpers } from 'ai/react';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { PromptForm } from '@/components/prompt-form';

export interface ChatPanelProps
  extends Pick<
    UseAssistantHelpers,
    'submitMessage' | 'input' | 'handleInputChange'
  > {
  isLoading: boolean;
  assistantId: string;
  caseId?: string;
}

export function ChatPanel({
  isLoading,
  assistantId,
  caseId,
  submitMessage,
  input,
  handleInputChange
}: ChatPanelProps) {
  return (
    <div className="bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            submitMessage={submitMessage}
            handleInputChange={handleInputChange}
            input={input}
            isLoading={isLoading}
            assistantId={assistantId}
            caseId={caseId}
          />
        </div>
      </div>
    </div>
  );
}
