// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddSnapshot = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.in_country_news.create({
            data: {
                title_of_in_country_news: req.body.title,
                text_of_in_country_news: req.body.text,
                image_of_in_country_news: req.body.image,
                date_of_in_country_news: new Date(),
                added_by: req.body.user
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddSnapshot;
