import Prism from 'prismjs';
import 'prismjs/components/prism-javascript'; // Import language definition
import 'prismjs/components/prism-python'; // Import another language definition
import React from 'react';
import 'prismjs/themes/prism-tomorrow.css'; // Replace with the theme you want to use

type HighlightCodeProps = {
  text: string;
};

const HighlightCode: React.FC<HighlightCodeProps> = ({ text }) => {
  const [formattedText, setFormattedText] = React.useState(text);

  React.useEffect(() => {
    // Regex pattern to match code blocks
    const codeBlockPattern = /```(\w+)?\s([\s\S]+?)```/g;

    // Replace code blocks with highlighted versions
    const formatted = text.replace(codeBlockPattern, (match, lang, code) => {
      const language = Prism.languages[lang];
      console.log(language, lang)
      if (!language) {
        console.warn(`Unknown language: ${lang}`);
        return match; // return the original text if the language is not known
      }

      const highlighted = Prism.highlight(code, language, lang);
      return `<pre class="language-${lang}"><code>${highlighted}</code></pre>`;
    });

    setFormattedText(formatted);
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

export default HighlightCode;
