import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../server/db";


const SaveCustomDashboard = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

    const dataObject = { templateArray: req.body.templateArray, pageIndices: req.body.pageIndices, venue: req.body.venue }

    await prisma?.dashboard_Templates.upsert({
      where: {
        company: req.body.venue
      },
      update: {
        data: JSON.stringify(dataObject)
      },
      create: {
        company: req.body.venue,
        data: JSON.stringify(dataObject)
      }
    })

    res.status(200).json({ message: 'Success' })

  } else {
    res.status(405).json({ message: 'Method not allowed' }); // If the request is not a POST request
  }
};

export default SaveCustomDashboard;
