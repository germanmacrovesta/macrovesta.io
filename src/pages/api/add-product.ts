// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('HEY')
    console.log(req.body)
    await prisma?.marketplace.create({
      data: {
        product: req.body.product,
        stock_tonnes: req.body.stock_tonnes,
        price_usd: req.body.price_usd,
        description: req.body.description,
        added_by: req.body.added_by
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddProduct
