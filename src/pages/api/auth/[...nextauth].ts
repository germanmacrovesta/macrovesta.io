// import NextAuth from "next-auth";
// import { authOptions } from "~/server/auth";

// export default NextAuth(authOptions);

import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { createTransport } from "nodemailer";

import { env } from "../../../env.mjs";
import { prisma } from "../../../server/db";
import { text, html, } from "../../../components/nextAuthCustom/verificationEmail"

type ExtendedSession<T> = T & {
    role: string | null;
    type: string | null;
    access_to_marketplace: boolean | null;
    tier: string | null;
    company: string | null;
    company_id: string | null;
    selected_company: string | null;
    selected_company_id: string | null;
    submittedSurvey: boolean | null;
}

const generateAuthtoken = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://')
const useSecureCookies = !!process.env.NEXTAUTH_URL
// console.log(useSecureCookies)
// const cookiePrefix = useSecureCookies ? '__Secure-' : ''
// console.log(cookiePrefix)
// let dummyHostName;

// if (process.env.NEXTAUTH_URL?.startsWith('https://')) {
//     // dummyHostName = new URL(process.env?.NEXTAUTH_URL)?.hostname
//     dummyHostName = process.env.NEXTAUTH_URL?.split('https://')[1]
// } else {
//     dummyHostName = 'localhost'
// }
// console.log(dummyHostName)

export const authOptions: NextAuthOptions = {
    // Include user.id on session
    // site: "https://macrovesta.ai",
    callbacks: {
        // session({ session, user }) {
        //   if (session.user) {
        //     session.user.id = user.id;
        //   }
        //   return session;
        // },

        // @ts-expect-error
        async session({ session, token, user }) {
            if (!session) return;
            if (!session.user) return;
            const userData = await prisma.user.findUnique({
                where: {
                    email: session.user.email ?? undefined
                },
                include: {
                    company: true,
                    selected_company: true
                }
            });
            let extendedSession: ExtendedSession<typeof session> = {
                ...session,
                role: null,
                type: null,
                access_to_marketplace: null,
                tier: null,
                company: null,
                company_id: null,
                selected_company: null,
                selected_company_id: null,
                submittedSurvey: null
            }
            extendedSession.role = userData?.role ?? null;
            extendedSession.submittedSurvey = userData?.submittedSurvey ?? null;
            extendedSession.type = userData?.company?.type ?? null;
            extendedSession.tier = userData?.company?.tier ?? null;
            extendedSession.access_to_marketplace = userData?.company?.access_to_marketplace ?? null;
            extendedSession.company = userData?.company?.name ?? null;
            extendedSession.company_id = userData?.company_id ?? null;
            extendedSession.selected_company = userData?.selected_company?.name ?? null;
            extendedSession.selected_company_id = userData?.selected_company_id ?? null;

            return extendedSession
            // return {
            //   session: {
            //     user: {
            //       id: userData?.id,
            //       venue: userData?.venue,
            //       email: userData?.email
            //     }
            //   }
            // };
            // async session({ session, token, user }) {
            //   // Send properties to the client, like an access_token and user id from a provider.
            //   session.accessToken = token.accessToken
            //   session.user.id = token.id

            //   return session
            // }



        },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
            generateVerificationToken: async () => {
                const token = await generateAuthtoken();
                return token;
            },
            sendVerificationRequest: async ({ identifier: email, url, token, provider, theme }) => {
                const { host } = new URL(url)
                // NOTE: You are not required to use `nodemailer`, use whatever you want.
                // const transport = createTransport(provider.server)
                const transport = createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: process.env.NODEMAILER_EMAIL,
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN,
                    },
                })
                const result = await transport.sendMail({
                    to: email,
                    from: provider.from,
                    subject: `Sign in to ${host}`,
                    text: text({ url, host, token }),
                    html: html({ url, host, token }),
                })
                const failed = result.rejected.concat(result.pending).filter(Boolean)
                if (failed.length) {
                    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
                }
            }

        }),
        // GoogleProvider({
        //   clientId: process.env.GOOGLE_CLIENT_ID,
        //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // })
        // DiscordProvider({
        //   clientId: env.DISCORD_CLIENT_ID,
        //   clientSecret: env.DISCORD_CLIENT_SECRET,
        // }),
        // ...add more providers here
    ],
    pages: {
        signIn: '/auth/signin',
        // signOut: '/auth/signout',
        // // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    // cookies: {
    //     sessionToken: {
    //         name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //             domain: '.macrovesta.ai',
    //             secure: useSecureCookies,
    //             // secure: useSecureCookies,
    //             // domain: dummyHostName == 'localhost' ? dummyHostName : '.' + dummyHostName // add a . in front so that subdomains are included
    //         },
    //     },
    //     // sessionToken: {
    //     //     name: `${cookiePrefix}next-auth.session-token`,
    //     //     options: {
    //     //         httpOnly: true,
    //     //         sameSite: 'lax', // this should be set to 'None' for cross-domain cookies
    //     //         path: '/',
    //     //         // secure: true, // this should be true for production websites
    //     //         // domain: '.macrovesta.ai', // specify your domain, this is crucial
    //     //         secure: useSecureCookies,
    //     //         domain: dummyHostName == 'localhost' ? dummyHostName : '.' + dummyHostName // add a . in front so that subdomains are included
    //     //     },
    //     // },
    // },
    // debug: true,
    // cors: {
    //     origin: '*',
    //     methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    //     allowedHeaders: ['Content-Type', 'Authorization'],
    //     credentials: true,
    // },
};

export default NextAuth(authOptions);

