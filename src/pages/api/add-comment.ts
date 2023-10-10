// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddSnapshot = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const record = await prisma?.comments.create({
      data: {
        comment: req.body.comment,
        section: req.body.section,
        date_of_comment: new Date(),
        added_by: req.body.user
      }
    })

    await prisma?.things_to_review.create({
      data: {
        table: 'Comments',
        type: 'Supervision',
        thing_id: record.record_id,
        information: `Section: ${req.body.section},\nComment: ${req.body.comment} `,
        added_by: req.body.user
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddSnapshot
