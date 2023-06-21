import React from 'react'

type ShowcaseProps = {
    children: any
    title: string
    description: string
}

function Showcase({ children, title, description }: ShowcaseProps) {

    return (
        <div className='w-fill rounded-t-xl flex flex-col bg-tertiary-container justify-end rounded-b-lg'>
            <div className='text-start flex flex-col p-4 text-on-tertiary-container h-[15%]'>
                <div className='font-medium text-[18px]'>
                    {title}
                </div>
                <div className='text-[14px]'>
                    {description}
                </div>
            </div>
            <div className='rounded-lg h-[85%] mx-2 mb-2'>
                {children}
            </div>
        </div>
    )
}

export default Showcase