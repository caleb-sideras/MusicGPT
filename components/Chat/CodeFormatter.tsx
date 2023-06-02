import React, { useState, useEffect } from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


interface CodeFormatterProps {
    text: string;
    language: string;
}

const CodeFormatter: React.FC<CodeFormatterProps> = ({ text, language }) => {
    const [code, setCode] = useState<string>('');

    useEffect(() => {
        if (text.endsWith('```')) {
            setCode(text.slice(0, -3));
        } else {
            setCode(text);
        }
    }, [text]);

    return (
        <SyntaxHighlighter language={language} style={a11yDark}>
            {code}
        </SyntaxHighlighter>
    );
};

export default CodeFormatter;
