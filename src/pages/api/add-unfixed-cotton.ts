// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddUnfixedCotton = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.unfixed_cotton.create({
            data: {
                company_id: req.body.company_id,
                contract_number: req.body.contract,
                futures_month: req.body.futures_month,
                basis: req.body.basis,
                fix_by: new Date(req.body.fix_by),
                total_amount: (req.body.percentage != undefined && parseFloat(req.body.percentage) != 0) ? (parseFloat(req.body.remaining) / (100 - parseFloat(req.body.percentage)) * 100) : parseFloat(req.body.remaining),
                // total_amount: parseFloat(req.body.percentage) != 0 ? 1 : 2,
                amount_remaining: req.body.remaining,
                added_by: req.body.user
            }
        })

        if (req.body.percentage != undefined) {
            await prisma?.fixed_cotton.create({
                data: {
                    company_id: req.body.company_id,
                    contract_number: req.body.contract,
                    futures_month: req.body.futures_month,
                    basis: req.body.basis,
                    fixed_price_without_basis: req.body.fixed_price,
                    amount_fixed: parseFloat(req.body.percentage) != 0 ? (parseFloat(req.body.remaining) / (100 - parseFloat(req.body.percentage)) * 100) - parseFloat(req.body.remaining) : null,
                    added_by: req.body.user
                }
            })
        }

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddUnfixedCotton;
