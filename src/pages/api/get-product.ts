// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const getProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const productId = req.query?.id as string

    const data = await prisma.marketplace.findUnique({
      where: { record_id: productId },
      include: {
        reserved_by_user: true,
        buyers: {
          select: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        agents: {
          select: {
            agent: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    res.status(200).json(data)
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default getProduct
