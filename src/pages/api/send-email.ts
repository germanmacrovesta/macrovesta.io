import { type NextApiRequest, type NextApiResponse } from "next";
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        console.log("Sending Email to:", to, subject, text)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.NODEMAILER_EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
        })

        let mailOptions = {
            from: process.env.NODEMAILER_ALIAS,
            to: to,
            subject: subject,
            html: `
                    <img width="150px" src="https://macrovesta.ai/macrovestalogo.png" alt="Macrovesta Logo">
                    <h1>Welcome to Our Service</h1><p>${text}</p>`,
            text: `${text}\n\nBest regards,\nVictor Fernandes\nMacrovesta`
        };

        try {
            let info = await transporter.sendMail(mailOptions);
            res.status(200).json({ messageId: info.messageId });
        } catch (error) {
            res.status(500).json({ error: JSON.stringify(error) });
        }
    } else {
        res.status(404).json({ error: 'Send a POST request instead.' });
    }
}
