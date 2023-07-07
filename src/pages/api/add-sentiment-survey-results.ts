// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddSentimentSurveyResults = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        await prisma?.sentiment_survey.create({
            data: {
                bullish_or_bearish: req.body.bullish_or_bearish,
                high: parseInt(req.body.high),
                low: parseInt(req.body.low),
                intraday_average_points: parseInt(req.body.intraday_average_points),
                open_interest: parseInt(req.body.open_interest),
                date_of_survey: new Date()
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddSentimentSurveyResults;
