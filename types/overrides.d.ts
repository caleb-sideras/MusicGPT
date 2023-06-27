// import * as ai from 'ai/react';

declare module 'ai/react' {
    /**
* Shared types between the API and UI packages.
*/
    export interface Message {
        id: string;
        createdAt?: Date;
        content: string;
        role: 'system' | 'user' | 'assistant' | "text" | "data" | "midi" | "audi" | "wave" | "hpcp" | "mels" | "code" | "exec";
    }
    declare type CreateMessage = {
        id?: string;
        createdAt?: Date;
        content: string;
        role: 'system' | 'user' | 'assistant';
    };
    declare type RequestOptions = {
        headers?: Record<string, string> | Headers;
        body?: object;
    };
    declare type UseChatOptions = {
        /**
         * The API endpoint that accepts a `{ messages: Message[] }` object and returns
         * a stream of tokens of the AI chat response. Defaults to `/api/chat`.
         */
        api?: string;
        /**
         * An unique identifier for the chat. If not provided, a random one will be
         * generated. When provided, the `useChat` hook with the same `id` will
         * have shared states across components.
         */
        id?: string;
        /**
         * Initial messages of the chat. Useful to load an existing chat history.
         */
        initialMessages?: Message[];
        /**
         * Initial input of the chat.
         */
        initialInput?: string;
        /**
         * Callback function to be called when the API response is received.
         */
        onResponse?: (response: Response) => void | Promise<void>;
        /**
         * Callback function to be called when the chat is finished streaming.
         */
        onFinish?: (message: Message) => void;
        /**
         * Callback function to be called when an error is encountered.
         */
        onError?: (error: Error) => void;
        /**
         * HTTP headers to be sent with the API request.
         */
        headers?: Record<string, string> | Headers;
        /**
         * Extra body object to be sent with the API request.
         * @example
         * Send a `sessionId` to the API along with the messages.
         * ```js
         * useChat({
         *   body: {
         *     sessionId: '123',
         *   }
         * })
         * ```
         */
        body?: object;
        /**
         * Whether to send extra message fields such as `message.id` and `message.createdAt` to the API.
         * Defaults to `false`. When set to `true`, the API endpoint might need to
         * handle the extra fields before forwarding the request to the AI service.
         */
        sendExtraMessageFields?: boolean;
    };
    declare type UseCompletionOptions = {
        /**
         * The API endpoint that accepts a `{ prompt: string }` object and returns
         * a stream of tokens of the AI completion response. Defaults to `/api/completion`.
         */
        api?: string;
        /**
         * An unique identifier for the chat. If not provided, a random one will be
         * generated. When provided, the `useChat` hook with the same `id` will
         * have shared states across components.
         */
        id?: string;
        /**
         * Initial prompt input of the completion.
         */
        initialInput?: string;
        /**
         * Initial completion result. Useful to load an existing history.
         */
        initialCompletion?: string;
        /**
         * Callback function to be called when the API response is received.
         */
        onResponse?: (response: Response) => void | Promise<void>;
        /**
         * Callback function to be called when the completion is finished streaming.
         */
        onFinish?: (prompt: string, completion: string) => void;
        /**
         * Callback function to be called when an error is encountered.
         */
        onError?: (error: Error) => void;
        /**
         * HTTP headers to be sent with the API request.
         */
        headers?: Record<string, string> | Headers;
        /**
         * Extra body object to be sent with the API request.
         * @example
         * Send a `sessionId` to the API along with the prompt.
         * ```js
         * useChat({
         *   body: {
         *     sessionId: '123',
         *   }
         * })
         * ```
         */
        body?: object;
    };

    declare type UseChatHelpers = {
        /** Current messages in the chat */
        messages: Message[];
        /** The error object of the API request */
        error: undefined | Error;
        /**
         * Append a user message to the chat list. This triggers the API call to fetch
         * the assistant's response.
         * @param message The message to append
         * @param options Additional options to pass to the API call
         */
        append: (message: Message | CreateMessage, options?: RequestOptions) => Promise<string | null | undefined>;
        /**
         * Reload the last AI chat response for the given chat history. If the last
         * message isn't from the assistant, it will request the API to generate a
         * new response.
         */
        reload: (options?: RequestOptions) => Promise<string | null | undefined>;
        /**
         * Abort the current request immediately, keep the generated tokens if any.
         */
        stop: () => void;
        /**
         * Update the `messages` state locally. This is useful when you want to
         * edit the messages on the client, and then trigger the `reload` method
         * manually to regenerate the AI response.
         */
        setMessages: (messages: Message[]) => void;
        /** The current value of the input */
        input: string;
        /** setState-powered method to update the input value */
        setInput: React.Dispatch<React.SetStateAction<string>>;
        /** An input/textarea-ready onChange handler to control the value of the input */
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
        /** Form submission handler to automattically reset input and append a user message  */
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        /** Whether the API request is in progress */
        isLoading: boolean;
    };
    declare function useChat({ api, id, initialMessages, initialInput, sendExtraMessageFields, onResponse, onFinish, onError, headers, body }?: UseChatOptions): UseChatHelpers;

    declare type UseCompletionHelpers = {
        /** The current completion result */
        completion: string;
        /**
         * Send a new prompt to the API endpoint and update the completion state.
         */
        complete: (prompt: string, options?: RequestOptions) => Promise<string | null | undefined>;
        /** The error object of the API request */
        error: undefined | Error;
        /**
         * Abort the current API request but keep the generated tokens.
         */
        stop: () => void;
        /**
         * Update the `completion` state locally.
         */
        setCompletion: (completion: string) => void;
        /** The current value of the input */
        input: string;
        /** setState-powered method to update the input value */
        setInput: React.Dispatch<React.SetStateAction<string>>;
        /**
         * An input/textarea-ready onChange handler to control the value of the input
         * @example
         * ```jsx
         * <input onChange={handleInputChange} value={input} />
         * ```
         */
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
        /**
         * Form submission handler to automattically reset input and append a user message
         * @example
         * ```jsx
         * <form onSubmit={handleSubmit}>
         *  <input onChange={handleInputChange} value={input} />
         * </form>
         * ```
         */
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        /** Whether the API request is in progress */
        isLoading: boolean;
    };
    declare function useCompletion({ api, id, initialCompletion, initialInput, headers, body, onResponse, onFinish, onError }?: UseCompletionOptions): UseCompletionHelpers;

    export { CreateMessage, Message, UseChatHelpers, UseChatOptions, UseCompletionHelpers, useChat, useCompletion };

}