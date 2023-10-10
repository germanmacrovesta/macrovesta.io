// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddBugReport = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const record = await prisma?.bug_report.create({
      data: {
        title: req.body.title,
        text: req.body.text,
        type: req.body.bug_type ?? '',
        added_by: req.body.user
      }
    })

    await prisma?.things_to_review.create({
      data: {
        table: 'Bug Report',
        type: 'Supervision',
        thing_id: record.record_id,
        information: `Type: ${req.body.bug_type},\nTitle: ${req.body.title},\nText: ${req.body.text} `,
        added_by: req.body.user
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddBugReport
