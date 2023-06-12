import React, { useEffect, useState } from 'react';

interface ErrorComponentProps {
    message: string;
    setParentState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, setParentState }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setParentState(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 bg-error text-on-error rounded-lg p-4 z-50">
            {message}
        </div>
    );
};

export default ErrorComponent;
