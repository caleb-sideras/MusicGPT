import React, { useEffect, useRef } from 'react'

type codeExecProps = {
    parameters: any;
    code: string;
}

const CodeExec = (props: codeExecProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!containerRef.current) return;

        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        let modifiedFuncString = `return ${props.code}`;
        let visualize = new Function('', modifiedFuncString)();

        visualize(props.parameters, containerRef.current);
    }, [props]);

    return (
        <div className='w-full mx-2 md:mx-4 lg:mx-8 my-4 rounded-lg bg-surface'>
            <div className="flex justify-between items-center px-4 py-2 bg-surface rounded-t-lg">
                <h2 className="text-sm text-on-surface">Custom Visualization</h2>
            </div>
            <div ref={containerRef} className='w-full h-48 overflow-y-auto'></div>
        </div>
    )
}

export default CodeExec