// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const Product = async (req: NextApiRequest, res: NextApiResponse) => {
  // An user is reserving a product
  if (req.body.reserved_by && req.body.isReserving && req.method === 'PUT') {
    try {
      await prisma.product.update({
        where: {
          id: req.body.id
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

  // Creating a product (Seller panel)
  if (req.method === 'POST') {
    console.log(req.body)
    try {
      const createdProduct = await prisma?.product.create({
        data: {
          name: req.body.product,
          category: req.body.category,
          quantity: parseInt(req.body.quantity),
          description: req.body.description,
          price_usd: parseInt(req.body.price_usd),
          quality: req.body.quality,
          shipment: req.body.shipment,
          payment_terms: req.body.payment_terms,
          hvi_file: req.body.hvi_file,
          image_url: req.body.image_url,
          added_by: req.body.added_by,
          expiry_date: new Date(req.body.expiry_date)
        }
      })
      console.log(createdProduct);
      const productId = createdProduct.id

      req.body.agents.forEach(async (agentId) => {
        await prisma?.productAgent.create({
          data: {
            product_id: productId,
            agent_id: agentId
          }
        })
      })

      console.log('bien agentes')

      req.body.buyers.forEach(async (buyerId) => {
        await prisma?.productBuyer.create({
          data: {
            product_id: productId,
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

  // Updating a product (Seller panel)
  if (req.method === 'PUT') {
    console.log(req.body)
    try {
      const updatedProduct = await prisma.product.update({
        where: {
          id: req.body.id
        },
        data: {
          name: req.body.name,
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
      await prisma?.productBuyer.deleteMany({
        where: { product_id: req.body.id }
      })

      await prisma?.productAgent.deleteMany({
        where: { product_id: req.body.id }
      })

      // Add Relation Agents and Buyers
      const buyers = req.body.buyers.map(buyerId => ({
        product_id: req.body.id,
        buyer_id: buyerId
      }))

      const agents = req.body.agents.map(agentId => ({
        product_id: req.body.id,
        agent_id: agentId
      }))

      await prisma?.productBuyer.createMany({
        data: buyers
      })

      await prisma?.productAgent.createMany({
        data: agents
      })

      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Delete a product (Seller Panel)
  if (req.method === 'DELETE') {
    const productId = req.query?.id as string
    console.log(productId)

    try {
      const deleteAgents = prisma.productAgent.deleteMany({
        where: { id: productId }
      })

      const deleteBuyers = prisma.productBuyer.deleteMany({
        where: { id: productId }
      })

      const deleteProduct = prisma.product.delete({
        where: { id: productId }
      })

      const transaction = await prisma.$transaction([deleteAgents, deleteBuyers, deleteProduct])
      console.log(transaction)
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Get a specific product by id
  if (req.method === 'GET') {
    const productId = req.query?.id as string

    const data = await prisma.product.findUnique({
      where: { id: productId },
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
  }

}

export default Product
