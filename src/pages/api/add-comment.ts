// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddSnapshot = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.comments.create({
            data: {
                comment: req.body.comment,
                section: req.body.section,
                date_of_comment: new Date(),
                added_by: req.body.user
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddSnapshot;
