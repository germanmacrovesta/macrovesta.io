// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const StoreNotification = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.method)
  if (req.method === 'POST') {
    try {
      const { title, description, userId } = req.body
      console.log(req.body)
      const storedNotification = await prisma?.notification.create({
        data: {
          title,
          description,
          user_id: userId,
          is_read: false
        }
      })
      console.log(storedNotification)
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default StoreNotification
