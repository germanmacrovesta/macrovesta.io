// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddSnapshot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log(req.body)
    const record = await prisma?.snapshot_strategy.create({
      data: {
        title_of_snapshot_strategy: req.body.title,
        text_of_snapshot_strategy: req.body.text,
        image_of_snapshot_strategy: req.body.image,
        date_of_snapshot_strategy: new Date(),
        news_type: req.body.news_type ?? '',
        impact: req.body.impact,
        added_by: req.body.user
      }
    })

    await prisma?.things_to_review.create({
      data: {
        table: 'Snapshot Strategy',
        type: 'Verification',
        thing_id: record.record_id,
        information: `Title: ${req.body.title},\nText: ${req.body.text} `,
        added_by: req.body.user
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddSnapshot
