// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const GetCottonContractsData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const data = await prisma?.cotton_contracts.findMany({})

    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default GetCottonContractsData
