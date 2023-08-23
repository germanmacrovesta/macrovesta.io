import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "../../server/db";


const AddBasisCostEstimate = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET' && req.query?.access == "abc123") {

        const users = await prisma?.user.findMany({
            where: {
                id: "cljzpccri0000zbdovqvictuk"
            }
        })
        try {
            console.log("updating user false")
            const updateUsers = await prisma?.user.updateMany({
                where: {
                    id: "cljzpccri0000zbdovqvictuk"
                },
                data: {
                    submittedSurvey: false
                }
            })
            console.log("sending email")

            users.forEach(async (user) => {
                await fetch(`https://${req.headers.host}/api/send-email`, {
                    method: 'POST',
                    body: JSON.stringify({
                        to: user.email, subject: `Weekly Market Sentiment Survey Available Now`,
                        htmlText: `<p>Dear ${user.name?.split(' ')[0]},<br/><br/>Our weekly Cotton Market Survey is now available for your input.<br/><br/>Your participation strengthens our community and helps us serve you better. Thank you for being a part of it.</p>`,
                        text: `Dear ${user.name?.split(' ')[0]},\n\nOur weekly Cotton Market Survey is now available for your input.\n\nYour participation strengthens our community and helps us serve you better. Thank you for being a part of it.`
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            })
            console.log("finished emails")

            res.status(200).json({ message: JSON.stringify(updateUsers) });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Error Updating' });
        }


    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddBasisCostEstimate;
