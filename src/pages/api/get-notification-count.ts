// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const getNotificationCount = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const data = await prisma.notification.count({})
    console.log(data)
    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default getNotificationCount
