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

const SymbolInfo = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        res.status(200).json(
            {
                symbol: ["AAPL", "MSFT", "SPX"],
                description: ["Apple Inc", "Microsoft corp", "S&P 500 index"],
                exchange_listed: "NYSE",
                exchange_traded: "NYSE",
                minmovement: 1,
                minmovement2: 0,
                pricescale: [1, 1, 100],
                has_dwm: true,
                has_intraday: true,
                has_no_volume: [false, false, true],
                type: ["stock", "stock", "index"],
                ticker: ["AAPL~0", "MSFT~0", "$SPX500"],
                timezone: "America/New_York",
                session_regular: "0900-1600",
            }
        );

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default SymbolInfo;
