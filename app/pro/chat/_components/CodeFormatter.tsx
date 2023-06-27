import React, { CSSProperties, useEffect, useState } from 'react';
import { CopyIcon } from '@radix-ui/react-icons'
import dynamic from 'next/dynamic';

const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter'), { ssr: false });

interface CodeFormatterProps {
    text: string;
    language: string;
}

const CodeFormatter: React.FC<CodeFormatterProps> = ({ text, language }) => {
    const [dynamicStyle, setDynamicStyle] = useState<{ [key: string]: CSSProperties } | undefined>();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
    };

    useEffect(() => {
        const loadStyle = async () => {
            const { a11yDark } = await import('react-syntax-highlighter/dist/esm/styles/hljs');
            setDynamicStyle(a11yDark);
        };

        loadStyle();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className='w-full'>
            <div className="flex justify-between items-center px-4 py-2 bg-[#2a2a2a] rounded-t-lg">
                <h2 className="text-sm text-on-surface">{language}</h2>
                <button onClick={copyToClipboard} className="px-2 py-2 text-on-surface rounded-full hover:bg-tertiary hover:text-on-tertiary">
                    <CopyIcon className='w-4 h-4' />
                </button>
            </div>
            <SyntaxHighlighter language={language} style={dynamicStyle} className="py-4 rounded-b-lg" customStyle={{ background: '#37393b', padding: '16px' }}>
                {text}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeFormatter;