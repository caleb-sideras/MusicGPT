import React from 'react'
import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function ChatFooter({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn(
                'px-2 text-center text-xs leading-normal text-on-surface',
                className
            )}
            {...props}
        >
            Open source AI chatbot built by{' '}
            <ExternalLink href="https://calebsideras.com">Caleb Sideras</ExternalLink> with{' '}
            <ExternalLink href="https://nextjs.org">
                Next.js
            </ExternalLink>
        </p>
    )
}
