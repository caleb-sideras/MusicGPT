import React, { useEffect, useRef, useState } from 'react'
import * as Form from '@radix-ui/react-form';
import { ProState } from '@/types';

type ApiKeyProps = {
    setCurrentState: React.Dispatch<React.SetStateAction<ProState>>;
    setAPIKey: React.Dispatch<React.SetStateAction<string>>;
}

function ApiKey({ setCurrentState, setAPIKey }: ApiKeyProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const storedKey = localStorage.getItem('OpenAI-APIKey');
        if (storedKey && inputRef.current) {
            inputRef.current.value = storedKey
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const saveToLocalStorage = (key: string) => {
        localStorage.setItem('OpenAI-APIKey', key);
    };

    return (
        <Form.Root className="w-[260px]"
            onSubmit={(event) => {
                const data = Object.fromEntries(new FormData(event.currentTarget));
                if (data) {
                    saveToLocalStorage(data.key as string)

                    setAPIKey(data.key as string)
                    setCurrentState(ProState.upload)
                }
                event.preventDefault();
            }}>
            <Form.Field className="grid mb-[10px]" name="key">
                <div className="flex items-baseline justify-between">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-on-surface">Key</Form.Label>
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