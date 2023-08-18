// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
import { prisma } from "../../server/db";


const AddSentimentSurveyResults = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        const record = await prisma?.sentiment_survey.create({
            data: {
                bullish_or_bearish: req.body.bullish_or_bearish,
                bullish_or_bearish_value: parseInt(req.body.bullish_or_bearish_value),
                high: parseFloat(req.body.high),
                low: parseFloat(req.body.low),
                intraday_average_points: parseFloat(req.body.intraday_average_points),
                open_interest: parseFloat(req.body.open_interest),
                date_of_survey: new Date(),
                added_by: req.body.user
            }
        })

        console.log(req.body.email)

        await prisma?.things_to_review.create({
            data: {
                table: "Sentiment Survey",
                type: "Supervision",
                thing_id: record.record_id,
                information: `Sentiment: ${req.body.bullish_or_bearish_value},\nHigh: ${req.body.high},\nLow: ${req.body.low},\nIntraday: ${req.body.intraday_average_points},\nOpen Interest: ${req.body.open_interest} `,
                added_by: req.body.user
            }
        })

        await prisma?.user.update({
            where: {
                email: req.body.email
            },
            data: {
                submittedSurvey: true
            }
        })

        res.status(200).json({ message: 'Success' });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddSentimentSurveyResults;
