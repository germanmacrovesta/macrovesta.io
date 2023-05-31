// pages/api/import-csv.ts
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
            parser.write(req.body.csvData);
            parser.end();

            parser.on('data', async (row: Record<string, unknown>) => {
                data.push(row);
            });

            parser.on('end', async () => {
                for (const row of data) {
                    // Map CSV row to Prisma model data
                    const modelData = Object.entries(row).reduce(
                        (acc, [key, value]) => {
                            if (key != "record_id") {
                                acc[key] = isNaN(Number(value)) ? value : Number(value);
                            }
                            return acc;
                        },
                        {} as Record<string, unknown>
                    );

                    await prisma[`${req.body.table}`].create({
                        data: modelData,
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
