// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddSnapshot = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.snapshot_strategy.create({
            data: {
                title_of_snapshot_strategy: req.body.title,
                text_of_snapshot_strategy: req.body.text,
                image_of_snapshot_strategy: req.body.image,
                date_of_snapshot_strategy: new Date(),
                news_type: req.body.news_type ?? "",
                added_by: req.body.user
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddSnapshot;
