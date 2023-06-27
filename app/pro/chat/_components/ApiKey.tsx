import React, { useEffect, useRef, useState } from 'react'
import * as Form from '@radix-ui/react-form';
import { ProState } from '@/types';

type ApiKeyProps = {
    setCurrentState: React.Dispatch<React.SetStateAction<ProState>>;
    apiKey: string | null;
    setApiKey: (value: string | null) => void;
}

function ApiKey({ setCurrentState, apiKey, setApiKey }: ApiKeyProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [previewTokenInput, setPreviewTokenInput] = useState(apiKey ?? '')

    useEffect(() => {
        if (apiKey && inputRef.current) {
            inputRef.current.value = previewTokenInput
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Form.Root className="w-[500px]"
            onSubmit={(event) => {
                event.preventDefault();

                if (previewTokenInput) {
                    setApiKey(previewTokenInput)
                    setCurrentState(ProState.upload)
                }
            }}

            onChange={(event) => {
                const data = Object.fromEntries(new FormData(event.currentTarget));
                setPreviewTokenInput(data.key as string)
            }}>
            <Form.Field className="grid mb-[10px]" name="key">
                <div className="flex items-baseline justify-between">
                    <Form.FormLabel className="text-sm font-light text-grey pb-4">
                        If you have not obtained your OpenAI API key, you can do so by{' '}
                        <a
                            href="https://platform.openai.com/signup/"
                            className="underline"
                        >
                            signing up
                        </a>{' '}
                        on the OpenAI website. This is only necessary as Pro is in Beta, allowing the open source community to test the app.
                        The token will be saved to your browser&apos;s local storage under
                        the name <code className="font-mono">OpenAI-APIKey</code>.
                    </Form.FormLabel>
                    {/* <Form.Label className="text-[15px] font-medium leading-[35px] text-on-surface">Key</Form.Label> */}
                    <Form.Message className="text-[13px] text-on-surface opacity-[0.8]" match="valueMissing">
                        Please enter your OpenAI API key
                    </Form.Message>
                    <Form.Message className="text-[13px] text-on-surface opacity-[0.8]" match="typeMismatch">
                        Please enter your OpenAI API key
                    </Form.Message>

                </div>
                <Form.Control asChild>
                    <input
                        className="box-border w-full border border-outline bg-surface inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-on-surface outline-none selection:color-white selection:bg-outline"
                        type="password"
                        required
                        ref={inputRef}
                        value={previewTokenInput}
                        placeholder="OpenAI API Key"
                    />
                </Form.Control>
            </Form.Field>
            <Form.Submit asChild>
                <button className="box-border w-full text-surface inline-flex h-[35px] items-center justify-center rounded-md bg-on-surface px-[15px] font-medium leading-non focus:outline-none mt-[10px]">
                    Submit
                </button>
            </Form.Submit>
        </Form.Root>
    )
}

export default ApiKey