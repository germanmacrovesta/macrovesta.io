// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddProducerCommercialisationPosition = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.producer_commercialisation_estimates.create({
            data: {
                company_id: req.body.company_id,
                season: "22/23",
                percentage_sold: req.body.percentage1,
                added_by: req.body.user
            }
        })

        await prisma?.producer_commercialisation_estimates.create({
            data: {
                company_id: req.body.company_id,
                season: "23/24",
                percentage_sold: req.body.percentage2,
                added_by: req.body.user
            }
        })

        await prisma?.producer_commercialisation_estimates.create({
            data: {
                company_id: req.body.company_id,
                season: "24/25",
                percentage_sold: req.body.percentage3,
                added_by: req.body.user
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddProducerCommercialisationPosition;
