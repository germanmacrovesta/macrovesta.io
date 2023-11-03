// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const StoreNotification = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

  }
}

export default StoreNotification
