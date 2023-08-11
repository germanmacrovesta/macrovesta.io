import React, { KeyboardEvent, useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';

interface EmailInputProps {
    onSuccess: (email: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignin = useCallback(async () => {
        setLoading(true);
        const res = await signIn('email', {
            email: email,
            redirect: false,
        });
        setLoading(false);
        if (res?.error) {
            if (res?.url) {
                window.location.replace(res.url);
            }
        } else {
            onSuccess(email);
        }
    }, [email, onSuccess]);

    const onKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleSignin();
            }
        },
        [handleSignin]
    );

    return (
        <div className='flex flex-col items-center'>
            <input
                className='w-[400px] placeholder-secondarygrey px-12 py-3 text-lg rounded-2xl bg-[#f6f6f650] text-center text-white'
                type="email"
                name="email"
                placeholder="e.g. jane.doe@company.com"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                onKeyPress={onKeyPress}
            />
            <button className='text-black bg-white disabled:bg-gray-300 rounded-full py-2 px-6 mt-6 w-fit' disabled={loading} onClick={() => handleSignin()} >Next</button>
        </div>
    );
};

export default EmailInput