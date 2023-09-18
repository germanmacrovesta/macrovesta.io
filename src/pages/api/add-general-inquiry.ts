import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db";

const test = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        console.log(req.body);

        // console.log("user", req.body.user)
        // console.log("company", req.body.company)

        await prisma?.general_Inquiries.create({
            data: {
                name: req.body.name,
                company: req.body.company,
                email: req.body.email,
                message: req.body.message,
                date_created: new Date(),
            }
        })

        await fetch(`https://${req.headers.host}/api/send-email`, {
            method: 'POST',
            body: JSON.stringify({
                to: 'developer@macrovesta.ai',
                subject: `${req.body.name} from ${req.body.company} added a general inquiry`,
                htmlText: `<p>${req.body.message}</p>`,
                text: req.body.message
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });



        res.status(200).json(JSON.stringify({ venue: req.body.company }));


    }
};

export default test;
