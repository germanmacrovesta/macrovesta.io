// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log(req.body)
    await prisma?.marketplace.create({
      data: {
        product: req.body.product,
        category: req.body.category,
        quantity: req.body.quantity,
        description: req.body.description,
        price_usd: req.body.price_usd,
        quality: req.body.quality,
        shipment: req.body.shipment,
        payment_terms: req.body.payment_terms,
        hvi_file: req.body.hvi_file,
        image_url: req.body.image_url,
        added_by: req.body.added_by
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default AddProduct
