import Head from "next/head";
import React from "react";
import ContactForm from '../components/contactForm'



export default function TestPage() {
    return (
        <>
            <Head>
                <title>Test Page</title>
            </Head>
            <main>
                <ContactForm />
            </main>
        </>
    );
}

