import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import React from 'react'
import SwitchDemo from '../Tools/Switch';

export type FeatureSelectionProps = {
    title: string
    body: string
    defaultChecked: boolean
    disabled: boolean
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

function FeatureSelection({ title, body, defaultChecked, disabled, setIsChecked }: FeatureSelectionProps) {
    return (
        <div className='flex flex-row justify-between'>
            <div className='text-md text-on-surface flex flex-row'>
                <div>{title}</div>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            className="rounded-full w-[25px] h-[25px] inline-flex items-center justify-center bg-surface outline-none"
                            aria-label="Customise options"
                        >
                            <InfoCircledIcon
                                className={`relative transition-transform duration-[250] ease-in text-outline`}
                                aria-hidden
                            />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="w-40 bg-on-surface p-4 text-sm text-center text-surface rounded-md will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                            sideOffset={5}
                        >
                            {body}
                            <DropdownMenu.Arrow className="fill-white" />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
                {
                    disabled &&
                    <div className='text-sm text-on-surface'>
                        Coming soon...
                    </div>
                }
            </div>
            <SwitchDemo setIsChecked={setIsChecked} defaultChecked={defaultChecked} disabled={disabled} />
        </div>
    )
}

export default FeatureSelection