// pages/api/import-csv.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { prisma } from "../../../server/db";
import {
    // DatafeedConfiguration,
    // ErrorCallback,
    // GetMarksCallback,
    // HistoryCallback,
    // IDatafeedChartApi,
    // IDatafeedQuotesApi,
    // IExternalDatafeed,
    // LibrarySymbolInfo,
    // Mark,
    // OnReadyCallback,
    // QuotesCallback,
    ResolutionString,
    // ResolveCallback,
    // SearchSymbolResultItem,
    // SearchSymbolsCallback,
    // ServerTimeCallback,
    // SubscribeBarsCallback,
    // TimescaleMark,
    // SymbolResolveExtension,
    // VisiblePlotsSet,
} from '../../../../public/static/charting_library/datafeed-api'

const History = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        res.status(200).json(
            {
                s: "ok",
                // nextTime: 1386493512,
                t: [1386493512, 1386493572, 1386493632, 1386493692],
                c: [42.1, 43.4, 44.3, 42.8],
                o: [41.0, 42.9, 43.7, 44.5],
                h: [43.0, 44.1, 44.8, 44.5],
                l: [40.4, 42.1, 42.8, 42.3],
                v: [12000, 18500, 24000, 45000]
            }
        );

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default History;
