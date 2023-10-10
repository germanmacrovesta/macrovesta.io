// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddProducerProductionPosition = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await prisma?.producer_production_estimates.create({
      data: {
        company_id: req.body.company_id,
        season: '22/23',
        production_estimate: req.body.production1,
        yield_estimate: req.body.yield1,
        added_by: req.body.user
      }
    })

    await prisma?.producer_production_estimates.create({
      data: {
        company_id: req.body.company_id,
        season: '23/24',
        production_estimate: req.body.production2,
        yield_estimate: req.body.yield2,
        added_by: req.body.user
      }
    })

    await prisma?.producer_production_estimates.create({
      data: {
        company_id: req.body.company_id,
        season: '24/25',
        production_estimate: req.body.production3,
        yield_estimate: req.body.yield3,
        added_by: req.body.user
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddProducerProductionPosition
