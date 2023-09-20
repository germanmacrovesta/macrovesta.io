// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const GetAIndexData = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        const data = await prisma?.us_export_sales.findMany({})

        res.status(200).json(data);

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default GetAIndexData;
