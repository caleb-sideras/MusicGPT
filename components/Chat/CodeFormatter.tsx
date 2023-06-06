import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CopyIcon } from '@radix-ui/react-icons'

interface CodeFormatterProps {
    text: string;
    language: string;
}

const CodeFormatter: React.FC<CodeFormatterProps> = ({ text, language }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className='w-full mx-2 md:mx-4 lg:mx-8'>
            <div className="flex justify-between items-center px-4 py-2 bg-surface rounded-t-lg">
                <h2 className="text-sm text-on-surface">{language}</h2>
                <button onClick={copyToClipboard} className="px-2 py-2 text-on-surface rounded-full hover:bg-tertiary hover:text-on-tertiary">
                    <CopyIcon className='w-4 h-4' />
                </button>
            </div>
            <SyntaxHighlighter language={language} style={a11yDark} className="py-4 rounded-b-lg" customStyle={{ background: '#37393b', padding: '16px' }}>
                {text}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeFormatter;