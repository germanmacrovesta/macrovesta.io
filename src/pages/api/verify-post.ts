// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const VerifyPost = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        let log = "";
        if (req.body.table == "Snapshot Strategy") {
            log += "Snapshot Strategy"
            await prisma?.snapshot_strategy.update({
                where: {
                    record_id: req.body.record_id
                },
                data: {
                    verified: true
                }
            })
        } else if (req.body.table == "In Country News") {
            log += "In Country News"
            await prisma?.in_country_news.update({
                where: {
                    record_id: req.body.record_id
                },
                data: {
                    verified: true
                }
            })
        }

        res.status(200).json({ message: `${log} Success` });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default VerifyPost;
