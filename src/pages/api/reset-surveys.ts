// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from "../../server/db";


// const AddBasisCostEstimate = async (req: NextApiRequest, res: NextApiResponse) => {
//     if (req.method === 'GET' && req.query?.access == "abc123") {

//         const users = await prisma?.user.findMany({
// // where: {
// //     OR: [
// //         {
// //             id: "cljzpccri0000zbdovqvictuk"
// //         },
// //         {
// //             id: "cljzx1vgn0000zbegn63qn1xg"
// //         }
// //     ]
// // }
//         })
//         try {
//             console.log("updating user false")
//             const updateUsers = await prisma?.user.updateMany({
//                 // where: {
//                 //     OR: [
//                 //         {
//                 //             id: "cljzpccri0000zbdovqvictuk"
//                 //         },
//                 //         {
//                 //             id: "cljzx1vgn0000zbegn63qn1xg"
//                 //         }
//                 //     ]
//                 // },
//                 data: {
//                     submittedSurvey: false
//                 }
//             })
//             console.log("sending emails")

//             const promises = users.map(async (user) => {
//                 console.log("sending email")

//                 const promise = await fetch(`https://${req.headers.host}/api/send-email`, {
//                     method: 'POST',
//                     body: JSON.stringify({
//                         to: user.email, subject: `Weekly Market Sentiment Survey Available Now`,
//                         htmlText: `<p>Dear ${user.name?.split(' ')[0]},<br/><br/>Our weekly Cotton Market Survey is now available for your input.<br/><br/>Your participation strengthens our community and helps us serve you better. Thank you for being a part of it.</p>`,
//                         text: `Dear ${user.name?.split(' ')[0]},\n\nOur weekly Cotton Market Survey is now available for your input.\n\nYour participation strengthens our community and helps us serve you better. Thank you for being a part of it.`
//                     }),
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 console.log("finished email")
//                 return promise
//             })
//             console.log("finished emails")

//             Promise.all(promises).then(() => { console.log("promises finished"); res.status(200).json({ message: JSON.stringify(updateUsers) }) }).catch(() => res.status(400).json({ message: 'Error Sending Emails' }))

//             // res.status(200).json({ message: JSON.stringify(updateUsers) });
//         } catch (error) {
//             console.log(error)
//             res.status(400).json({ message: 'Error Updating' });
//         }


//     } else {
//         res.status(405).json({ message: 'Method not allowed.' });
//     }
// };

// export default AddBasisCostEstimate;

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "../../server/db";

const ResetSurveys = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET' && req.query?.access == "abc123") {
        try {
            const users = await prisma?.user.findMany({
                where: {
                    OR: [
                        {
                            id: "cljzpccri0000zbdovqvictuk"
                        },
                        {
                            id: "cljzx1vgn0000zbegn63qn1xg"
                        }
                    ]
                }
            });
            const updateUsersResponse = await prisma?.user.updateMany({
                where: {
                    OR: [
                        {
                            id: "cljzpccri0000zbdovqvictuk"
                        },
                        {
                            id: "cljzx1vgn0000zbegn63qn1xg"
                        }
                    ]
                },
                data: {
                    submittedSurvey: false
                }
            });

            const emailPromises = users.map(async user => {
                // return await fetch(`https://${req.headers.host}/api/send-email`, {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         to: user.email,
                //         subject: `Weekly Market Sentiment Survey Available Now`,
                //         htmlText: `<p>Dear ${user.name?.split(' ')[0]},<br/><br/>Our weekly Cotton Market Survey is now available for your input.<br/><br/>Your participation strengthens our community and helps us serve you better. Thank you for being a part of it.</p>`,
                //         text: `Dear ${user.name?.split(' ')[0]},\n\nOur weekly Cotton Market Survey is now available for your input.\n\nYour participation strengthens our community and helps us serve you better. Thank you for being a part of it.`
                //     }),
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // });
                try {
                    const response = await fetch(`https://${req.headers.host}/api/send-email`, {
                        method: 'POST',
                        body: JSON.stringify({
                            to: user.email,
                            subject: `Weekly Market Sentiment Survey Available Now`,
                            htmlText: `<p>Dear ${user.name?.split(' ')[0]},<br/><br/>Our weekly Cotton Market Survey is now available for your input.<br/><br/>Your participation strengthens our community and helps us serve you better. Thank you for being a part of it.</p>`,
                            text: `Dear ${user.name?.split(' ')[0]},\n\nOur weekly Cotton Market Survey is now available for your input.\n\nYour participation strengthens our community and helps us serve you better. Thank you for being a part of it.`
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    return { status: 'fulfilled', value: response, user };
                } catch (error) {
                    return { status: 'rejected', reason: error, user };
                }
            });

            const emailResults = await Promise.allSettled(emailPromises);

            const failedEmails = emailResults.filter((result): result is PromiseRejectedResult & { user: any } => {
                if (result.status === 'rejected') {
                    return true;
                }
                return false;
            });

            if (failedEmails.length > 0) {
                const secondEmailPromises = failedEmails.map(async (failedEmail) => {
                    try {
                        const response = await fetch(`https://${req.headers.host}/api/send-email`, {
                            method: 'POST',
                            body: JSON.stringify({
                                to: failedEmail?.user?.email,
                                subject: `Weekly Market Sentiment Survey Available Now`,
                                htmlText: `<p>Dear ${failedEmail?.user?.name?.split(' ')[0]},<br/><br/>Our weekly Cotton Market Survey is now available for your input.<br/><br/>Your participation strengthens our community and helps us serve you better. Thank you for being a part of it.</p>`,
                                text: `Dear ${failedEmail?.user?.name?.split(' ')[0]},\n\nOur weekly Cotton Market Survey is now available for your input.\n\nYour participation strengthens our community and helps us serve you better. Thank you for being a part of it.`
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        return { status: 'fulfilled', value: response, user: failedEmail?.user };
                    } catch (error) {
                        return { status: 'rejected', reason: error, user: failedEmail?.user };
                    }
                });

                const secondEmailResults = await Promise.allSettled(secondEmailPromises);

                const secondFailedEmails = secondEmailResults.filter((result): result is PromiseRejectedResult & { user: any } => {
                    if (result.status === 'rejected') {
                        return true;
                    }
                    return false;
                });

                if (secondFailedEmails.length > 0) {
                    await prisma?.things_to_review.create({
                        data: {
                            added_by: "Automated",
                            table: "Emails",
                            type: "Urgent",
                            thing_id: "",
                            information: `users: ${secondFailedEmails.reduce((acc, obj) => { acc += `${obj?.user?.email}, `; return acc; }, "")}, reasons: ${secondFailedEmails.reduce((acc, obj) => { acc += `${obj?.reason?.message}, `; return acc; }, "")}`
                        }
                    })
                    return res.status(400).json({ message: 'Error Sending Some Emails', details: failedEmails });
                }
            }

            return res.status(200).json({ message: JSON.stringify(updateUsersResponse) });

        } catch (error) {
            return res.status(400).json({ message: 'An Error Occurred', details: error });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default ResetSurveys;
