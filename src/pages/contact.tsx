import Header from '../components/header'
import Footer from '../components/footer'
import React from 'react'
import CookieConsent from '../components/cookieConsent'
import Head from "next/head";

export default function ContactPage() {
    const [error_Message, setError_Message] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [warning_Message, setWarning_Message] = React.useState("");
    const [warningSubmit, setWarningSubmit] = React.useState(false);

    const handleSubmit = async (event: any) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault();
        setSubmitting(true);

        let name = event.target['name'].value;
        let company = event.target['company'].value;
        let email = event.target['email'].value;
        let message = event.target['message'].value;

        let errorMessage = "";
        let warningMessage = "";

        if (name === undefined || name === null || name === "") {
            errorMessage += "Please enter your name. "
        }
        if (company === undefined || company === null || company === "") {
            errorMessage += "Please enter your company. "
        }
        if (email === undefined || email === null || email === "") {
            errorMessage += "Please enter an email. "
        }
        if (message === undefined || message === null || message === "") {
            errorMessage += "Please add a message. "
        }

        if (warningMessage !== "") {
            setWarning_Message(warningMessage);
            // throw new Error(errorMessage)
        } else {
            if (warning_Message != "") {
                setWarning_Message("")
            }
        }

        if (errorMessage != "") {
            setError_Message(errorMessage);
            setWarningSubmit(false);
            setSubmitting(false);
            // throw new Error(errorMessage);
        } else {
            if (error_Message != "") {
                setError_Message("")
            }

            if (warningSubmit == false && warningMessage != "") {
                setWarningSubmit(true);
                setSubmitting(false);
            } else {

                // Get data from the form.
                const data = {
                    name,
                    company,
                    email,
                    message
                }

                console.log(data);

                // Send the data to the server in JSON format.
                const JSONdata = JSON.stringify(data)

                // API endpoint where we send form data.
                const endpoint = '/api/add-general-inquiry'

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

    }

    return (
        <>
            <Head>
                <title>Macrovesta</title>
                <meta name="description" content="Generated by Macrovesta" />
                <link rel="icon" href="/favicon.ico" />
                {/* <script src="/static/datafeeds/udf/dist/bundle.js" async /> */}
                <link rel="alternate" hrefLang="en" href="https://www.macrovesta.ai" />
                <link rel="alternate" hrefLang="pt-br" href="https://pt-br.macrovesta.ai" />
                <link rel="alternate" hrefLang="es" href="https://es.macrovesta.ai" />
                <link rel="alternate" hrefLang="tr" href="https://tr.macrovesta.ai" />
                <link rel="alternate" hrefLang="th" href="https://th.macrovesta.ai" />
                {/* <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
        <script>
          {Weglot.initialize({
            api_key: 'wg_60b49229f516dee77edb3109e6a46c379'
          })}
        </script> */}
            </Head>
            <Header />
            <CookieConsent />
            <section className="mb-32">
                <div className="-z-10 animate-slidedown relative isolate overflow-hidden bg-gradient-to-tr from-navy to-deep_blue pt-32 sm:pt-44  pb-24 sm:pb-32">

                    <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
                        <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-navy to-deep_blue opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
                        <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr  from-navy to-deep_blue opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="absolute bottom-0  left-0 right-0">
                        <div className="overflow-hidden h-1/2">
                            {/* Replace this inline SVG */}
                            {/* <svg ...> ... </svg> */}

                            {/* With an <img> tag pointing to the SVG file */}
                            {/* <img src="Rubbish_Border_Standard.svg" alt="Complex Shape Divider" /> */}
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <h2 className="text-4xl font-bold tracking-tight text-white  sm:text-6xl">Contact Us</h2>
                            <p className="mt-6 pb-20 text-lg leading-8 text-white opacity-70">We work with and connect stakeholders involved at each stage of the cotton supply chain, enabling clearer insights to be achieved. </p>
                        </div>
                    </div>
                </div>

                <div className="container px-6 md:px-12 mx-auto">
                    <div className="block rounded-lg bg-white px-6 py-12 shadow-md md:py-16 md:px-12 -mt-[120px] backdrop-filter backdrop-blur-md">
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-5/12 sm:pr-10">
                                <form onSubmit={handleSubmit}>
                                    <div className="relative mb-6">
                                        <input
                                            type="text"
                                            className="peer block w-full rounded border border-gray-300 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none focus:border-deep_blue focus:ring-0"
                                            id="name"
                                            placeholder="Name"
                                        />
                                    </div>
                                    <div className="relative mb-6">
                                        <input
                                            type="text"
                                            className="peer block w-full rounded border border-gray-300 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none focus:border-deep_blue focus:ring-0"
                                            id="company"
                                            placeholder="Company"
                                        />
                                    </div>
                                    <div className="relative mb-6">
                                        <input
                                            type="email"
                                            className="peer block w-full rounded border border-gray-300 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none focus:border-deep_blue focus:ring-0"
                                            id="email"
                                            placeholder="Email address"
                                        />
                                    </div>
                                    <div className="relative mb-6">
                                        <textarea
                                            className="peer block w-full rounded border border-gray-300 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none focus:border-deep_blue focus:ring-0"
                                            id="message"
                                            rows={3}
                                            placeholder="Your message"
                                        ></textarea>
                                    </div>
                                    {!submitting && !submitted && (
                                        <button
                                            type="submit"
                                            className="mb-6 w-full rounded bg-deep_blue px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-deep_blue-600 focus:bg-deep_blue-600 focus:outline-none focus:ring-0 active:bg-deep_blue-700"
                                        >
                                            Send
                                        </button>
                                    )}
                                    {submitting && !submitted && (
                                        <div>
                                            Sending
                                        </div>
                                    )}
                                    {submitted && (
                                        <div>
                                            Sent! We will get back to you ASAP
                                        </div>
                                    )}
                                    {error_Message && (
                                        <div>
                                            {error_Message}
                                        </div>
                                    )}
                                </form>
                            </div>




                            <div className="w-full md:w-7/12">
                                <div className="flex flex-wrap">
                                    <div className="basis-full xl:basis-1/2 mb-12 w-full md:w-6/12 md:px-3">
                                        <div className="flex items-start">
                                            <div className="shrink-0">
                                                {/* <div className="inline-block rounded-md bg-deep_blue-100 p-4 text-deep_blue">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                            />
                          </svg>
                        </div> */}
                                            </div>
                                            <div className="ml-6 grow">
                                                <p className="mb-2 font-bold">Send us an email</p>
                                                <p className="text-neutral-500">
                                                    Directly reach out to a member of our team by sending us an email. We aim to respond within 48 hours.
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="basis-full xl:basis-1/2 mb-12 w-full md:w-6/12 md:px-3">
                                        <div className="flex items-start">
                                            <div className="shrink-0">
                                                <div className="inline-block rounded-md bg-deep_blue p-4 text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                        stroke="currentColor" className="h-6 w-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-6 grow text-xs sm:text-base">
                                                <p className="mb-2 font-bold">Sales questions</p>
                                                <p className="text-neutral-500">
                                                    sales@macrovesta.ai
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basis-full xl:basis-1/2 mb-12 w-full md:w-6/12 md:px-3">
                                        <div className="align-start flex">
                                            <div className="shrink-0">
                                                <div className="inline-block rounded-md bg-deep_blue p-4 text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                        stroke="currentColor" className="h-6 w-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-6 grow text-xs sm:text-base">
                                                <p className="mb-2 font-bold">General Inquiries</p>
                                                <p className="text-neutral-500">
                                                    contact@macrovesta.ai
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basis-full xl:basis-1/2 mb-12 w-full md:w-6/12 md:px-3">
                                        <div className="align-start flex">
                                            <div className="shrink-0">
                                                <div className="inline-block rounded-md bg-deep_blue p-4 text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                        stroke="currentColor" className="h-6 w-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-6 grow text-xs sm:text-base">
                                                <p className="mb-2 font-bold">Technical support</p>
                                                <p className="text-neutral-500">
                                                    support@macrovesta.ai
                                                </p>
                                                {/* <p className="text-neutral-500 text-xs italic pt-2">
                                                    If you are a member, you can open a ticket within the portal.
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
