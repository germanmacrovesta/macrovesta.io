import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db";

const test = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        console.log(req.body);

        // console.log("user", req.body.user)
        // console.log("company", req.body.company)

        const preferredTime = new Date();
        preferredTime.setHours(req.body.preferredTime.split(":")[0]);
        preferredTime.setMinutes(req.body.preferredTime.split(":")[1]);
        preferredTime.setSeconds(0);
        preferredTime.setMilliseconds(0);

        await prisma?.demo_Requests.create({
            data: {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                company_name: req.body.companyName,
                company_type: req.body.companyType,
                preferred_date: new Date(req.body.preferredDate),
                preferred_time: preferredTime,
            }
        })

        await fetch(`https://${req.headers.host}/api/send-email`, {
            method: 'POST',
            body: JSON.stringify({
                to: 'developer@macrovesta.ai',
                subject: `${req.body.firstName} ${req.body.lastName} from ${req.body.companyName} requested a demo`,
                htmlText: `<p>${`Their preferred date and time is ${req.body.preferredDate} ${req.body.preferredTime}`}</p>`,
                text: `Their preferred date and time is ${req.body.preferredDate} ${req.body.preferredTime}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });



        res.status(200).json(JSON.stringify({ venue: req.body.companyName }));


    }
};

export default test;
