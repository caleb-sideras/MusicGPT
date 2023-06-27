import React from 'react'

type Props = {
    message: string
}

export default function ChatMessageContent({ message }: Props) {
    return (
        <div className="gap-4 pt-1 flex flex-col overflow-x-auto">
            {message}
        </div>
    )
}
