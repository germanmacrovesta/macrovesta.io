// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const Notification = async (req: NextApiRequest, res: NextApiResponse) => {
  // Save Notification
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

  // Get Notification count
  if (req.method === 'GET') {
    const id = req.query?.id as string
    const data = await prisma.notification.count({
      where: { user_id: id, is_read: false }
    })
    console.log(data)
    res.status(200).json(data)
  }

  // Edit Notification (Mark as read or not)
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

  // Delete Notification
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

export default Notification
