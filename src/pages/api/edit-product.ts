// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const EditProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  // An user is reserving a product
  if (req.body.reserved_by && req.body.isReserving && req.method === 'PUT') {
    try {
      await prisma.marketplace.update({
        where: {
          record_id: req.body.record_id
        },
        data: {
          reserved_by: req.body.reserved_by
        }
      })
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
    return
  }

  // Admin is modifying product
  if (req.method === 'PUT') {
    console.log(req.body)
    try {
      const updatedProduct = await prisma.marketplace.update({
        where: {
          record_id: req.body.record_id
        },
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
          expiry_date: new Date(req.body.expiry_date),
          reserved_by: req.body.reserved_by || null
        }
      })

      console.log(updatedProduct)
      console.log(req.body.agents)
      console.log(req.body.buyers)

      // Delete previous relation registers
      await prisma?.marketplaceBuyer.deleteMany({
        where: { marketplace_id: req.body.record_id }
      })

      await prisma?.marketplaceAgent.deleteMany({
        where: { marketplace_id: req.body.record_id }
      })

      // Add Relation Agents and Buyers
      const buyers = req.body.buyers.map(buyerId => ({
        marketplace_id: req.body.record_id,
        buyer_id: buyerId
      }))

      const agents = req.body.agents.map(agentId => ({
        marketplace_id: req.body.record_id,
        agent_id: agentId
      }))

      await prisma?.marketplaceBuyer.createMany({
        data: buyers
      })

      await prisma?.marketplaceAgent.createMany({
        data: agents
      })

      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default EditProduct
