// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddBasisCostEstimate = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const record = await prisma?.basis_comparison.create({
      data: {
        date_of_basis_report: new Date(),
        country: req.body.country,
        contract_december_2023: parseInt(req.body.contractOneBasis),
        contract_december_2024: parseInt(req.body.contractTwoBasis),
        added_by: req.body.user,
        cost_type: req.body.cost_type
      }
    })

    await prisma?.things_to_review.create({
      data: {
        table: 'Basis Comparison',
        type: 'Supervision',
        thing_id: record.record_id,
        information: `Country: ${req.body.country},\nContract1: ${req.body.contractOneBasis},\nContract2: ${req.body.contractTwoBasis} `,
        added_by: req.body.user
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddBasisCostEstimate
