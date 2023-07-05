// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddBasisCostEstimate = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.basis_comparison.create({
            data: {
                date_of_basis_report: new Date(),
                country: req.body.country,
                contract_december_2023: parseInt(req.body.contractOneBasis),
                contract_december_2024: parseInt(req.body.contractTwoBasis)
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddBasisCostEstimate;
