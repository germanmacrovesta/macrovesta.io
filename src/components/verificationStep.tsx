import React, { KeyboardEvent, useCallback, useState } from 'react';

interface VerificationStepProps {
    email: string;
    callbackUrl?: string;
    inputStyle?: string;
    parentStyle?: string;
    hideCheckEmail?: boolean;
}

/**
 * User has inserted the email and now he can put the verification code
 */
export const VerificationStep: React.FC<VerificationStepProps> = ({
    email,
    callbackUrl,
    inputStyle = "w-[200px] placeholder-secondarygrey px-12 py-1 text-lg rounded-2xl bg-[#f6f6f650] text-center text-white",
    parentStyle = "flex flex-col items-center gap-4 -mt-8",
    hideCheckEmail = false
}) => {
    const [code, setCode] = useState('');

    const onReady = useCallback(() => {
        window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
            email
        )}&token=${code}${callbackUrl ? `&callbackUrl=${callbackUrl}` : ''}`;
    }, [callbackUrl, code, email]);

    const onKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                onReady();
            }
        },
        [onReady]
    );

    return (
        <div className={parentStyle}>
            <h2 className={`text-center ${hideCheckEmail ? 'hidden' : ''}`}>We have just sent you a verification email</h2>
            <p className='text-center'>Please enter the magic code you received in the email</p>
            <div className='flex items-center gap-4'>
                <label htmlFor='code' className='flex items-center'>
                    <div className=''>
                        Magic code:
                    </div>
                </label>
                <input
                    id='code'
                    className={inputStyle}
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={onKeyPress}
                    placeholder='Enter code'
                />

                <button className='text-black bg-white rounded-full py-1 text-lg px-4 w-fit' onClick={onReady}>Go</button>
            </div>
        </div>
    );
};

export default VerificationStep