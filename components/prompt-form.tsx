import { useRef, useEffect } from 'react';
import Textarea from 'react-textarea-autosize';
import { UseAssistantHelpers } from 'ai/react';
import { useRouter } from 'next/navigation';
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

export interface PromptProps
  extends Pick<
    UseAssistantHelpers,
    'input' | 'handleInputChange' | 'submitMessage'
  > {
  isLoading: boolean;
  assistantId: string;
  caseId?: string;
}

export function PromptForm({
  submitMessage,
  handleInputChange,
  input,
  isLoading,
  assistantId,
  caseId
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={(e) =>
        submitMessage(e, { data: { assistantId, caseId: caseId ?? '' } })
      }
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.refresh();
                router.push('/');
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 h-8 w-8 rounded-full bg-background p-0 sm:left-4 top-2'
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={2}
          minRows={2}
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[80px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 sm:right-4 top-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
