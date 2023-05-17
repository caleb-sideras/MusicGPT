import React, { useEffect, useState } from 'react';

interface ErrorComponentProps {
    message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

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
