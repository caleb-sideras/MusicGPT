import React from 'react';
import * as Switch from '@radix-ui/react-switch';

type SwitchDemoProps = {
    setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
    defaultChecked: boolean;
    disabled: boolean;
    onClick?: ()=>any
};

const SwitchDemo: React.FC<SwitchDemoProps> = ({ setIsChecked, defaultChecked, disabled, onClick }) => (
    <form>
        <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
            <Switch.Root
                defaultChecked={defaultChecked}
                disabled={disabled}
                onCheckedChange={setIsChecked}
                className="w-[42px] h-[25px] bg-idle rounded-full relative data-[state=checked]:bg-success data-[state=checked]:border-none outline-none border-on-idle border-2 cursor-default"
                id="airplane-mode"
                onClick={onClick}
            >
                <Switch.Thumb className="block w-[14px] h-[14px] ml-1 bg-on-idle rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px] data-[state=checked]:bg-on-success data-[state=checked]:w-[18px] data-[state=checked]:h-[18px] data-[state=checked]:ml-0" />
            </Switch.Root>
        </div>
    </form>
);

export default SwitchDemo;
