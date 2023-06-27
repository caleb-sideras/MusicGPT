import { ChatMessage, innerDivVariants } from "@/components/Chat/ChatMessage";
import { PromptForm } from "./prompt-form";
import { Button } from "@/components/button";
import { IconRefresh, IconStop } from '@/components/icons'
import { type UseChatHelpers } from 'ai/react'
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { EmptyScreen } from "@/components/empty-screen";
import ChatMessageContent from "./ChatMessageContent";
import { ChatFooter } from "@/components/Chat/ChatFooter";
import { VariantProps } from "class-variance-authority";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

interface ChatBoxLiteProps extends ChatPanelProps {
  filename?: string
  fullTitle?: string
}


export default function ChatBoxLite({ messages, filename, fullTitle, id, isLoading, stop, append, reload, input, setInput }: ChatBoxLiteProps) {
  return (
    <>
      <div className="flex flex-initial flex-co sm:calc-l calc-l-m">
        <div className="rounded-2xl flex-grow p-2 sm:p-4 overflow-y-auto relative overflow-hidden bg-secondary">
          {
            messages.length > 1 ? messages.map((message, index) => (
              <div
                key={index}
                className="my-1 sm:my-1.5"
              >
                <ChatMessage role={message.role as VariantProps<typeof innerDivVariants>["role"]} chat="lite">
                  <ChatMessageContent message={message.content} />
                </ChatMessage>
                <ChatScrollAnchor trackVisibility={isLoading} />
              </div>
            )) : (
              <ChatMessage role="assistant" chat="lite" >
                <EmptyScreen
                  setInput={setInput}
                  introMessage={`Hello! I'm MusicGPT, your AI music assistant. I can help you explore the musical structure, lyrics, and cultural relevance of songs. Let's talk about ${fullTitle}. What would you like to know?`}
                  exampleMessages={[
                    {
                      heading: 'Explain the lyrics',
                      message: `What is the meaning behind the lyrics?`
                    },
                    {
                      heading: 'Summarize the song',
                      message: 'How do the musical features work in tandem with the lyrics to enchance the overall experience?'
                    },
                    {
                      heading: 'Discover the Artist',
                      message: `Tell me about the history of Artist and the album`
                    }
                  ]} variant={'lite'} />
              </ChatMessage>
            )
          }
        </div>
        <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
          <ButtonScrollToBottom />
          <div className="mx-auto sm:max-w-[1200px] sm:px-10">
            <div className="flex h-10 items-center justify-center">
              {isLoading ? (
                <Button
                  variant="outline"
                  onClick={() => stop()}
                  className="bg-background"
                >
                  <IconStop className="mr-2" />
                  Stop generating
                </Button>
              ) : (
                messages && messages.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => reload()}
                    className="bg-background"
                  >
                    <IconRefresh className="mr-2" />
                    Regenerate response
                  </Button>
                )
              )}
            </div>
            <div className="sm:space-y-4 border-t sm:border-t-0 my-2 md:my-4 bg-background">
              <PromptForm
                onSubmit={async value => {
                  await append({
                    id,
                    content: value,
                    role: 'user'
                  })
                }}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
              />
              <ChatFooter className="block" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
