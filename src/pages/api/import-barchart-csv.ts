import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        if (!req.body.csvData) {
            res.status(400).json({ message: 'CSV data is required.' });
            return;
        }

        try {
            const data: Record<string, unknown>[] = [];
            const parser = csvParser();

            console.log("Started Parsing")

            parser.write(req.body.csvData);
            parser.end();

            let isFirstRow = true;
            parser.on('data', (row: Record<string, unknown>) => {
                if (isFirstRow) {
                    isFirstRow = false;
                    return;
                }

                if (row['Date Time'] !== undefined && row['Open'] !== undefined) { // Ignore the last row
                    const formattedRow: Record<string, unknown> = {};
                    formattedRow['datetime'] = new Date(row['Date Time']); // Convert "Date Time" to datetime

                    for (const [key, value] of Object.entries(row)) {
                        if (key !== 'MA-Simple') { // Remove last 3 columns
                            formattedRow[key.toLowerCase()] = isNaN(Number(value)) ? value : Number(value); // Convert columns to lowercase and handle numeric values
                        }
                    }
                    console.log(formattedRow)
                    data.push(formattedRow);
                }
            });

            console.log("Data[1]", data[1])

            parser.on('end', async () => {
                for (const row of data) {
                    await prisma[`${req.body.table}`].create({
                        data: row,
                    });
                }
                res.status(200).json({ message: 'CSV data imported successfully.' });
            });
        } catch (error) {
            console.error('Error importing CSV data:', error);
            res.status(500).json({ message: 'Error importing CSV data.' });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default handler;
