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
            {
                description: 'Apple Inc.',
                exchange: 'NYSE',
                full_name: 'NYSE:AAPL',
                symbol: 'AAPL',
                ticker: 'AAPL',
                type: 'stock',
            }
        );

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default Search;
