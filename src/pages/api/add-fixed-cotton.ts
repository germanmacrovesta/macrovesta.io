// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddUnfixedCotton = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (req.body.selected_contract == undefined || req.body.selected_contract.name == 'Select Contract') {
      await prisma?.fixed_cotton.create({
        data: {
          company_id: req.body.company_id,
          contract_number: req.body.contract,
          futures_month: req.body.futures_month,
          basis: req.body.basis,
          fixed_price_without_basis: req.body.fixed,
          amount_fixed: req.body.quantity,
          added_by: req.body.user
        }
      })
    } else {
      const unfixedContract = await prisma?.unfixed_cotton.findFirst({
        where: {
          contract_number: req.body.selected_contract.contract_number
        }
      })

      const fixedContract = await prisma?.fixed_cotton.findFirst({
        where: {
          contract_number: req.body.selected_contract.contract_number
        }
      })

      await prisma?.fixed_cotton.upsert({
        where: {
          contract_number: req.body.selected_contract.contract_number
        },
        update: {
          fixed_price_without_basis: (fixedContract?.amount_fixed != undefined && fixedContract?.amount_fixed != undefined && fixedContract?.fixed_price_without_basis != undefined && fixedContract?.fixed_price_without_basis != undefined) ? (Number(fixedContract?.amount_fixed) * Number(fixedContract?.fixed_price_without_basis) + parseFloat(req.body.quantity) * parseFloat(req.body.fixed)) / (Number(fixedContract?.amount_fixed) + parseFloat(req.body.quantity)) : null,
          amount_fixed: (fixedContract?.amount_fixed != undefined && fixedContract?.amount_fixed != undefined) ? Number(fixedContract?.amount_fixed) + parseFloat(req.body.quantity) : null,
          added_by: req.body.user
        },
        create: {
          company_id: req.body.company_id,
          // company: {
          //     connect: {
          //         company_manager_id: req.body.company_id
          //     }
          // },
          contract_number: req.body.selected_contract.contract_number,
          futures_month: req.body.selected_contract.futures_month,
          basis: req.body.selected_contract.basis,
          fixed_price_without_basis: req.body.fixed,
          amount_fixed: req.body.quantity,
          added_by: req.body.user
        }
      })

      await prisma?.unfixed_cotton.updateMany({
        where: {
          company_id: req.body.company_id,
          contract_number: req.body.selected_contract.contract_number
        },
        data: {
          amount_remaining: (unfixedContract?.amount_remaining != undefined && unfixedContract?.amount_remaining != null) ? Number(unfixedContract?.amount_remaining) - parseFloat(req.body.quantity) : null,
          added_by: req.body.user
        }
      })
    }

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddUnfixedCotton
