// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

function excelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    return date_info.toISOString().split('T')[0];  // returns date in YYYY-MM-DD format
}

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
                            if (key != "record_id" && key != "MA-Simple" && key != "datetime" && key != "date_of_high" && key != "date_of_low" && key != "comments") {
                                acc[key] = (value != null || value != undefined) ? isNaN(Number(value)) ? value : Number(value) : null;
                            } else if ((key == "datetime")) {
                                acc[key] = new Date(value)
                            } else if ((key == "date_of_high") || (key == "date_of_low")) {
                                // let dateString = value;
                                // let parts = dateString.split("/");
                                // let dateRecord = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                                // console.log("Date Record", `${parts[2]}-${parts[1]}-${parts[0]}`)
                                acc[key] = new Date(excelDateToJSDate(value))
                            } else if (key == "comments") {
                                acc[key] = `${value}`
                            }
                            return acc;
                        },
                        {} as Record<string, unknown>
                    );
                    // modelData.contract = req.body.contract

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
