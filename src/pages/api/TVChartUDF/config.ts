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

const Config = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        res.status(200).json({
            supports_search: false,
            supports_group_request: true,
            supported_resolutions: [
                '1' as ResolutionString,
                '5' as ResolutionString,
                '15' as ResolutionString,
                '30' as ResolutionString,
                '60' as ResolutionString,
                '1D' as ResolutionString,
                '1W' as ResolutionString,
                '1M' as ResolutionString,
            ],
            supports_marks: false,
            supports_timescale_marks: false,
        });

    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
};

export default Config;
