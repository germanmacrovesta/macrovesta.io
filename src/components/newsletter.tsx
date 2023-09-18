import React, { useEffect, useState } from 'react';

export default function Newsletter() {

    const [error_Message, setError_Message] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [warning_Message, setWarning_Message] = React.useState("");
    const [warningSubmit, setWarningSubmit] = React.useState(false);

    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        setSubmitting(true)

        let email = event.target['email'].value;


        let errorMessage = "";
        let warningMessage = "";

        if (email == "" || email == undefined) {
            errorMessage += "Please enter your email. "
        }

        if (errorMessage !== "") {
            setError_Message(errorMessage);
            setSubmitting(false);
            // throw new Error(errorMessage)
        } else {
            if (error_Message != "") { setError_Message("") }

            // Get data from the form.
            const data = {
                email,
                newsletter: true
            }

            console.log(data);

            // Send the data to the server in JSON format.
            const JSONdata = JSON.stringify(data)

            // API endpoint where we send form data.
            const endpoint = '/api/add-mailing-list'

            // Form the request for sending data to the server.
            const options = {
                // The method is POST because we are sending data.
                method: 'POST',
                // Tell the server we're sending JSON.
                headers: {
                    'Content-Type': 'application/json',
                },
                // Body of the request is the JSON data we created above.
                body: JSONdata,
            }

            // Send the form data to our forms API on Vercel and get a response.
            const response = await fetch(endpoint, options)

            // Get the response data from server as JSON.
            // If server returns the name submitted, that means the form works.
            const result = await response.json().then(() => { setSubmitted(true); setSubmitting(false) });
            // setSubmitted(true); setSubmitting(false)

        }


    }

    return (
        <section className=''>
            <div id="subscribe" className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pb-12 md:pb-20">
                    {/* CTA box */}
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-r from-deep_blue to-navy rounded-[80px] sm:rounded-[160px] lg:rounded-full py-10 px-8 md:py-16 md:px-12 shadow-2xl overflow-hidden hover:scale-105 animation duration-1000"
                        data-aos="zoom-y-out"
                    >
                        {/* CTA content */}
                        <div className="text-center lg:text-left lg:pl-10">
                            <h3 className="h3 text-white text-xl mb-2">Want to stay in the loop?</h3>
                            <p className="text-gray-200 text-lg mb-6">
                                Sign up to our newsletter for offers and updates on feature releases and more
                            </p>

                            {/* CTA form */}
                            <form className="w-full lg:w-auto" onSubmit={handleSubmit}>
                                <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                                    <input
                                        type="email"
                                        id='email'
                                        className="form-input w-full appearance-none bg-gray-800 border border-gray-700 focus:border-gray-600 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-gray-200"
                                        placeholder="Your email…"
                                        aria-label="Your email…"
                                    />
                                    {!submitting && !submitted && (
                                        <button type='submit' className="btn text-black bg-white hover:scale-105 transition duration-300 rounded-lg shadow p-4">
                                            Subscribe
                                        </button>
                                    )}
                                    {submitting && (
                                        <div className="text-center text-gray-200">  Your form is submitting...</div>
                                    )}

                                    {submitted && (
                                        <div className="text-center text-gray-200"> Added successfully! Thanks for joining</div>
                                    )}

                                </div>
                                {error_Message != "" && (
                                    <div className='text-gray-200'>{error_Message}</div>
                                )}
                                <p className="text-sm text-gray-200 mt-3">No spam. You can unsubscribe at any time.</p>
                            </form>
                        </div>

                        {/* Logo image */}
                        <div className="hidden sm:flex justify-center items-center ">
                            <img
                                src="/Full_Logo.svg"
                                className="w-20 lg:w-60"
                                alt="Logo"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
        .rotate-360 {
          transform: rotate(360deg);
        }
      `}</style>
        </section>
    );
}
