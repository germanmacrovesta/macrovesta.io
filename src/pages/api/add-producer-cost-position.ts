// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddProducerCostPosition = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await prisma?.producer_cost_estimates.create({
      data: {
        company_id: req.body.company_id,
        season: '22/23',
        cost_estimate_dollar_per_hectare: req.body.dollars_per_hectare1,
        cost_estimate_cent_per_pound: req.body.cents_per_pound1,
        added_by: req.body.user
      }
    })

    await prisma?.producer_cost_estimates.create({
      data: {
        company_id: req.body.company_id,
        season: '23/24',
        cost_estimate_dollar_per_hectare: req.body.dollars_per_hectare2,
        cost_estimate_cent_per_pound: req.body.cents_per_pound2,
        added_by: req.body.user
      }
    })

    await prisma?.producer_cost_estimates.create({
      data: {
        company_id: req.body.company_id,
        season: '24/25',
        cost_estimate_dollar_per_hectare: req.body.dollars_per_hectare3,
        cost_estimate_cent_per_pound: req.body.cents_per_pound3,
        added_by: req.body.user
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddProducerCostPosition
