import React, { useEffect, useRef } from 'react'

type codeExecProps = {
    parameters: any;
    code: string;
}

const CodeExec = (props: codeExecProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const init = async () => {
            if (!props || !containerRef.current) return;

            const plotly = (await import('plotly.js')).default;
            const d3 = await import("d3");

            while (containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
            }

            let modifiedFuncString = `return ${props.code}`;

            try {
                let visualize = new Function('', modifiedFuncString)();
                visualize(props.parameters, containerRef.current, plotly, d3);
            } catch (error) {
                let element = document.createElement('div');
                element.innerText = 'An error occured while trying to run this code...';
                element.style.cssText = 'color: var(--md-sys-color-on-error); font-size: 16px; text-align: center; height: 100%; align-items: center; justify-content: center; display: flex; padding:16px; background:var(--md-sys-color-error)';
                containerRef.current.appendChild(element)
            }

        }

        init()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='w-full rounded-lg bg-surface'>
            {/* <div className="flex justify-between items-center px-4 py-2 bg-surface rounded-t-lg">
                <h2 className="text-sm text-on-surface">Custom Visualization</h2>
            </div> */}
            <div ref={containerRef} className='w-full h-96 overflow-y-hidden rounded-lg'></div>
        </div>
    )
}

export default CodeExec
