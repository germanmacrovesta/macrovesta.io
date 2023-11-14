// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const editNotification = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id, isRead } = req.body
    console.log(req.body)
    try {
      await prisma.notification.update({
        where: {
          id: id
        },
        data: {
          is_read: isRead
        }
      })
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default editNotification
