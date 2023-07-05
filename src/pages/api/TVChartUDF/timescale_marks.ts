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

const Search = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        res.status(200).json(
            [{
                id: "123",
                color: "rgba(255, 0, 0, 0.5)",
                label: "A",
                time: 1625059200, // Unix timestamp representing a specific time
                tooltip: "This is a tooltip",
                shape: "circle",
            }]
        );

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default Search;
