// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddSuggestion = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        const record = await prisma?.suggestions.create({
            data: {
                text: req.body.text,
                type: req.body.suggestion_type ?? "",
                added_by: req.body.user
            }
        })

        await prisma?.things_to_review.create({
            data: {
                table: "Suggestions",
                type: "Supervision",
                thing_id: record.record_id,
                information: `Type: ${req.body.suggestion_type},\nText: ${req.body.text} `,
                added_by: req.body.user
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddSuggestion;
