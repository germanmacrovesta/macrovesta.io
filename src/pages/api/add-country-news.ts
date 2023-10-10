// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddSnapshot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const record = await prisma?.in_country_news.create({
      data: {
        country: req.body.country,
        title_of_in_country_news: req.body.title,
        text_of_in_country_news: req.body.text,
        image_of_in_country_news: req.body.image,
        date_of_in_country_news: new Date(),
        added_by: req.body.user
      }
    })

    await prisma?.things_to_review.create({
      data: {
        table: 'In Country News',
        type: 'Verification',
        thing_id: record.record_id,
        information: `Title: ${req.body.title},\nText: ${req.body.text} `,
        added_by: req.body.user
      }
    })

    // await fetch(`http://${req.headers.host}/api/send-email`, {
    //     method: 'POST',
    //     body: JSON.stringify({ to: 'developer@macrovesta.ai', subject: `${req.body.user} has added a new in-country news`, text: `Title: \n${req.body.title}\n\nText:\n${req.body.text}` }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddSnapshot
