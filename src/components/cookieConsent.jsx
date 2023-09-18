import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const CookieConsent = () => {
    const [cookies, setCookies] = useCookies(['cookieConsent']);
    const [shouldShow, setShouldShow] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (cookies.cookieConsent === 'accepted') {
            setShouldShow(false);
        }
        setIsLoading(false); // Loading is complete
    }, [cookies]);

    const handleAccept = () => {
        setCookies('cookieConsent', 'accepted', { path: '/' });
        setShouldShow(false);
    };

    if (isLoading) {
        return null; // Return null while loading
    }

    if (!shouldShow) {
        return null; // Consent already accepted, don't show the component
    }

    return (
        <div
            className="fixed bottom-0 right-0 p-4 z-[1000] animate-fade-in"
        >
            <div className="w-72 bg-white rounded-lg shadow-xl p-6 border-gray-100 border-2" style={{ cursor: 'auto' }}>
                <div className="w-16 mx-auto relative -mt-10 mb-3">
                    <img className="-mt-1" src="https://www.svgrepo.com/show/30963/cookie.svg" alt="Cookie Icon SVG" />
                </div>
                <span className="w-full sm:w-48 block leading-normal text-gray-800 text-md mb-3">
                    Hey! We use cookies to provide a better user experience.
                </span>
                <div className="flex items-center justify-between">
                    <a className="text-xs text-gray-400 mr-1 hover:text-gray-800" href="/Privacy_Policy.pdf">
                        Privacy Policy
                    </a>
                    <div className="w-1/2">
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="py-2 px-4 bg-primary hover:bg-navy focus:ring-navy focus:ring-offset-navy text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
