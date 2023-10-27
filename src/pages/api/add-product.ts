// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const AddProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log(req.body)
    try {
      const createdProduct = await prisma?.marketplace.create({
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

      const marketplaceId = createdProduct.record_id

      console.log(marketplaceId)

      req.body.agents.forEach(async (agentId) => {
        await prisma?.marketplaceAgent.create({
          data: {
            marketplace_id: marketplaceId,
            agent_id: agentId
          }
        })
      })

      console.log('bien agentes')

      req.body.buyers.forEach(async (buyerId) => {
        await prisma?.marketplaceBuyer.create({
          data: {
            marketplace_id: marketplaceId,
            buyer_id: buyerId
          }
        })
      })

      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default AddProduct
