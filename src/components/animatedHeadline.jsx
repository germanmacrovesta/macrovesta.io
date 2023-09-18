import React, { useState, useEffect } from 'react';

const AnimatedHeadline = ({ dynamicText, staticText, }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) =>
                (prevIndex + 1) % (Array.isArray(dynamicText) ? dynamicText.length : 1)
            );
        }, 4000);

        return () => {
            clearInterval(interval);
        }
    }, [dynamicText]);



    // Use this function to create a safe HTML string for dangerouslySetInnerHTML
    const createMarkup = (text) => ({ __html: text });

    // Check if dynamicText is not an array, set an empty array as a fallback
    const textArray = Array.isArray(dynamicText) ? dynamicText : [];

    return (
        <>
            <div className={`flex flex-col sm:flex-row text-center text-black justify-center leading-tighter mb-6 text-5xl font-extrabold tracking-tighter md:text-6xl relative`}>
                <div>
                    {staticText}
                </div>
                <div className='relative pr-4'>
                    <div className='invisible'>&nbsp;{dynamicText[0]}</div>
                    <div className={`absolute inset-0 text-center sm:text-left bg-gradient-to-r from-deep_blue to-navy bg-clip-text text-transparent transition-opacity duration-[2000] delay-[2000] animate-dynamic`}

                    >
                        &nbsp;{dynamicText[activeIndex]}
                    </div>
                    {/* <div className='absolute inset-0 text-left'>&nbsp;{dynamicText[activeIndex]}</div> */}
                </div>
            </div>
        </>
    );
};

export default AnimatedHeadline;
