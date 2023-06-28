import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { Button } from '@/components/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/tooltip'
import { IconArrowUp } from '@tabler/icons-react'

export interface PromptProps
    extends Pick<UseChatHelpers, 'input' | 'setInput'> {
    onSubmit: (value: string) => Promise<void>
    isLoading: boolean
}

export function PromptForm({
    onSubmit,
    input,
    setInput,
    isLoading
}: PromptProps) {
    const { formRef, onKeyDown } = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <form
            onSubmit={async e => {
                if (!isLoading) {
                    e.preventDefault()
                    if (!input?.trim()) {
                        return
                    }
                    setInput('')
                    await onSubmit(input)
                }
            }}
            ref={formRef}
        >
            <div className="relative flex max-h-60 w-full sm:pl-8 grow flex-col overflow-hidden bg-background pr-8 sm:rounded-full sm:border sm:pr-12">
                {/* <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/"
                            className={cn(
                                buttonVariants({ size: 'sm', variant: 'outline' }),
                                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
                            )}
                        >
                            <IconPlus />
                            <span className="sr-only">New Chat</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>New Chat</TooltipContent>
                </Tooltip> */}
                <Textarea
                    ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Send a message."
                    spellCheck={false}
                    className="min-h-[60px] w-full resize-none bg-transparent text-on-surface px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                />
                <div className="absolute right-1 top-4 sm:right-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || input === ''}
                                className='bg-secondary'
                            >
                                <IconArrowUp className='bg-secondary text-on-secondary' />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send message</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </form>
    )
}
