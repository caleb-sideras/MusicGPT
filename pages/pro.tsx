import React from 'react'
import { Pro } from '@/components/Features/Features'
import AccordionDemo from '@/components/AudioUpload/Instructions'
import Link from 'next/link'
import HighlightCode from '@/components/Chat/HighlightCode';
import CodeFormatter from '@/components/Chat/CodeFormatter';

function ProHome() {
  const inlineStyles = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  const proStyles = {
    ...inlineStyles,
    backgroundImage: "url('/home_pro.png')"
  }
  return (
    <div className="flex flex-col gap-4 sm:px-10 pb-4 sm:pb-10 max-w-[800px] mx-auto sm:mt-4">
      <div style={proStyles} className="col-span-1 md:col-span-2 lg:col-span-6 rounded-lg p-4 w-full h-fill">
        <Pro />
      </div>
      <AccordionDemo />
      <Link href='/pro/chat'>
        <div className='w-full p-4 text-center text-on-surface hover:text-surface rounded-full bg-surface hover:bg-on-surface border-on-surface hover:border-surface border-2 transition cursor-pointer'>
          Let&apos;s go
        </div>
      </Link>
      <HighlightCode text={`Here is some code:
        \`\`\`javascript
        const x = 10;
        console.log(x);
        \`\`\`

        And here is some more code:

        \`\`\`python
        x = 10
        print(x)
        \`\`\`
        `}
      />
      <CodeFormatter text={`
        const x = 10;
        console.log(x);
        `} language={'javascript'} />

    </div>
  )
}

export default ProHome