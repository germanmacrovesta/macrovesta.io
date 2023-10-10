// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../server/db'
import { getSession } from 'next-auth/react'

const ChangeSelectedCompany = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await prisma?.user.update({
      where: {
        email: req.body.email
      },
      data: {
        selected_company_id: req.body.new_company_id
      }
    })

    await getSession()

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default ChangeSelectedCompany
