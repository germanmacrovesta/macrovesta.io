import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from "../../server/db";


const AddBasisCostEstimate = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET' && req.query?.access == "abc123") {

        try {
            const updateUsers = await prisma?.user.updateMany({
                data: {
                    submittedSurvey: false
                }
            })
            res.status(200).json({ message: JSON.stringify(updateUsers) });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Error Updating' });
        }


    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default AddBasisCostEstimate;
