// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const deleteNotification = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const notificationId = req.query?.id as string
    try {
      await prisma.notification.delete({
        where: {
          id: notificationId
        }
      })
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default deleteNotification
