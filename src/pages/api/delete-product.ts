// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'

const DeleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const productId = req.query?.id as string
    console.log(productId)

    try {
      const deleteAgents = prisma.marketplaceAgent.deleteMany({
        where: { record_id: productId }
      })

      const deleteBuyers = prisma.marketplaceBuyer.deleteMany({
        where: { record_id: productId }
      })

      const deleteProduct = prisma.marketplace.delete({
        where: { record_id: productId }
      })

      const transaction = await prisma.$transaction([deleteAgents, deleteBuyers, deleteProduct])
      console.log(transaction)
      res.status(200).json({ message: 'Success' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default DeleteProduct
