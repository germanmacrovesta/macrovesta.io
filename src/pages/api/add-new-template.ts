import { type NextApiRequest, type NextApiResponse } from 'next'
import { prisma } from '../../server/db'

const GenerateCustomReport = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const name = 'Nick'

    const now = new Date()

    const dataObject = { templateArray: req.body.templateArray, pageIndices: req.body.pageIndices, venue: req.body.venue }

    await prisma?.report_Templates.create({
      data: {
        name: req.body.name,
        company: req.body.venue,
        data: JSON.stringify(dataObject)
      }
    })

    await prisma?.dashboard_Templates.create({
      data: {
        company: req.body.venue,
        data: JSON.stringify(dataObject)
      }
    })

    res.status(200).json({ message: 'Success' })
  } else {
    res.status(405).json({ message: 'Method not allowed' }) // If the request is not a POST request
  }
}

export default GenerateCustomReport
