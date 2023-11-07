// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const getNotificationCount = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query?.id as string
  if (req.method === 'GET') {
    const data = await prisma.notification.count({
      where: { user_id: id, is_read: '0' }
    })
    console.log(data)
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default getNotificationCount
