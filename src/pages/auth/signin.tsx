// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
// import { getCsrfToken } from "next-auth/react"
// import Head from "next/head";

// export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//     return (
//         <>
//             <Head>
//                 <title>Sign in</title>
//                 <meta name="description" content="Generated by create-t3-app" />
//                 <link rel="icon" href="/Logo_White.svg" />
//                 <script src="/static/datafeeds/udf/dist/bundle.js" async />
//             </Head>
//             <div className="grid place-content-center bg-gradient-to-br from-navy to-deep_blue h-[100vh]">
//                 <div className="flex flex-col items-center text-white">
//                     <div className="mb-10 -mr-16">
//                         <img width='300px' src="/Full_Logo.svg" />
//                     </div>
//                     <div className="-mt-8 mb-2 w-3/4 text-center font-bold">Please click the link you will receive from the browser you wish to be logged into.</div>
//                     <form className="w-full flex flex-col items-center" method="post" action="/api/auth/signin/email">
//                         <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
//                         <label>
//                             {/* <div className=" text-center">
//                         Email address
//                     </div> */}

//                             <input className="w-[400px] placeholder-secondarygrey px-12 py-3 text-lg rounded-2xl bg-[#f6f6f650] text-center" type="email" id="email" name="email" placeholder="Enter your email address here" />

//                         </label>
//                         <button className="text-black bg-white rounded-full py-2 px-6 mt-6" type="submit">Sign me in</button>
//                     </form>
//                     <div className="w-2/3 text-center mt-10">
//                         For your security, we don't store passwords. Instead, you can log in easily with your email address. Simply enter your email and click on the link we'll send you via email to access your account. No passwords to remember or reset! We will keep you logged in on this device for 30 days unless your cookies are cleared.
//                     </div>
//                     {/* <div className="mt-2 font-semibold">For help contact support@rubbishportal.com</div> */}
//                 </div>
//             </div>
//         </>
//     )
// }

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const csrfToken = await getCsrfToken(context)
//     return {
//         props: { csrfToken },
//     }
// }

// import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
// import { getCsrfToken } from "next-auth/react"

// export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//     return (
//         <div className="flex flex-col items-center bg-gradient-to-br from-primary to-tertiary h-[100vh] text-white">
//             <div className="mt-0 my-10">
//                 <img width='300px' src="/Portal_Logo_White-88.svg" />
//             </div>
//             <div className="-mt-8 mb-2 w-3/4 text-center font-bold">Please click the link you will receive from the browser you wish to be logged into.</div>
//             <form className="w-full flex flex-col items-center" method="post" action="/api/auth/signin/email">
//                 <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
//                 <label>
//                     {/* <div className=" text-center">
//                         Email address
//                     </div> */}

//                     <input className="w-[400px] placeholder-secondarygrey px-12 py-3 text-lg rounded-2xl bg-[#f6f6f650] text-center" type="email" id="email" name="email" placeholder="Enter your email address here" />

//                 </label>
//                 <button className="text-black bg-white rounded-full py-2 px-6 mt-6" type="submit">Sign me in</button>
//             </form>
//             <div className="w-2/3 text-center mt-10">
//                 For your security, we don't store passwords. Instead, you can log in easily with your email address. Simply enter your email and click on the link we'll send you via email to access your account. No passwords to remember or reset! We will keep you logged in on this device for 30 days unless your cookies are cleared.
//             </div>
//             <div className="mt-2 font-semibold">For help contact support@rubbishportal.com</div>
//         </div>
//     )
// }

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//     const csrfToken = await getCsrfToken(context)
//     return {
//         props: { csrfToken },
//     }
// }

import React, { useState } from 'react';
import { getSession, useSession } from "next-auth/react";
import { NextPage } from 'next';
import { useRouter } from 'next/router'
import EmailInput from '../../components/emailInput';
import VerificationStep from '../../components/verificationStep';
import { getCsrfToken } from "next-auth/react"
import Head from 'next/head';

interface Provider {
    id: string;
    name: string;
    type: string;
    [k: string]: string;
}

interface SigninPageProps {
    isLoggedIn: boolean;
    providers: Array<Provider>;
    csrfToken: string;
}

const SignIn: NextPage<SigninPageProps> = ({ csrfToken }) => {
    const { query } = useRouter();
    const { error } = query;
    const callbackUrl = 'https://macrovesta.ai';

    const [email, setEmail] = useState('');
    const [showVerificationStep, setShowVerificationStep] = useState(false);

    // if (showVerificationStep) {
    //     return (
    //         <div>
    //             <VerificationStep email={email} callbackUrl={callbackUrl} />
    //         </div>
    //     );
    // }

    return (
        <>
            <Head>
                <title>{`Sign in`}</title>
                <meta name="description" content="Generated by The Rubbish Portal" />
                <link rel="icon" href="/Portal_Icon.png" />
            </Head>
            <div className="flex flex-col items-center bg-gradient-to-br from-primary to-tertiary h-[100vh] text-white">
                <div className="mt-0 my-10">
                    <img width='300px' src="/Portal_Logo_White-88.svg" />
                </div>
                {showVerificationStep && (
                    <div>
                        <VerificationStep email={email} callbackUrl={callbackUrl} />
                    </div>
                )}
                {!showVerificationStep && (
                    <>
                        <div className="-mt-8 mb-2 w-3/4 text-center font-bold">Please click the link you will receive from the browser you wish to be logged into.</div>
                        <div className="w-full flex flex-col items-center">
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            {/* <label>
                    <div className=" text-center">
                         Email address
                     </div>

                    <input className="w-[400px] placeholder-secondarygrey px-12 py-3 text-lg rounded-2xl bg-[#f6f6f650] text-center" type="email" id="email" name="email" placeholder="Enter your email address here" />

                </label> */}
                            <EmailInput
                                key={"gmail"}
                                onSuccess={(email) => {
                                    setEmail(email);
                                    setShowVerificationStep(true);
                                }}
                            />
                            {/* <button className="text-black bg-white rounded-full py-2 px-6 mt-6" type="submit">Sign me in</button> */}
                        </div>
                        <div className="w-2/3 text-center mt-10">
                            For your security, we don't store passwords. Instead, you can log in easily with your email address. Simply enter your email and click on the link we'll send you via email to access your account. No passwords to remember or reset! We will keep you logged in on this device for 30 days unless your cookies are cleared.
                        </div>
                    </>
                )}
                <div className="mt-2 font-semibold">For help contact support@rubbishportal.com</div>
            </div>
        </>
    );
};

// SignIn.getInitialProps = async (context) => {
//     const { req } = context;
//     const session = await getSession({ req });
//     return {
//         isLoggedIn: session !== null,
//     } as unknown as SigninPageProps;
// };

export const getServerSideProps = async (context: any) => {
    const { req } = context;
    const session = await getSession({ req });
    const csrfToken = await getCsrfToken(context)
    if (session?.user?.id != undefined && session?.user?.id != null) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            }
        }
    } else {
        return {
            props: { csrfToken, isLoggedIn: session !== null }
        } as unknown as SigninPageProps;
    }

}

export default SignIn;