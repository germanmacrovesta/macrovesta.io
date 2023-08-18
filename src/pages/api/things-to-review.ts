// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const ThingsToReview = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        let emailText = "";

        const things = await prisma?.things_to_review.findMany({})

        const thingsKeys = things.reduce((acc: string[], obj) => { if (acc.includes(obj.table) == false) { acc.push(obj.table) }; return acc }, [])

        thingsKeys.forEach((key) => {
            const tempThings = things.filter((thing) => thing.table == key)
            emailText += key
            tempThings.forEach((thing) => {
                emailText += "<p>"
                emailText += thing.information
                emailText += "</p>"
                if (thing.type == "Verification") {
                    emailText += `<a href='https://macrovesta.ai/api/verify-post?table=${thing.table}&record_id=${thing.thing_id}'>Verify</a><br/>`
                }
            })
        })
        emailText += "<br/><br/>"

        await fetch(`https://${req.headers.host}/api/send-email`, {
            method: 'POST',
            body: JSON.stringify({ to: 'developer@macrovesta.ai', subject: `Things to look at`, text: `${emailText}`, htmlText: emailText }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        await prisma?.things_to_review.deleteMany({})

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default ThingsToReview;
