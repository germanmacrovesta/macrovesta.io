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

        res.status(200)
        // .json(
        //     {
        //         ticker: ticker,
        //         name: symbolName,
        //         base_name: [listedExchange + ':' + symbolName],
        //         full_name: fullName,
        //         listed_exchange: listedExchange,
        //         exchange: tradedExchange,
        //         currency_code: currencyCode,
        //         original_currency_code: extractField(data, 'original-currency-code', symbolIndex),
        //         unit_id: unitId,
        //         original_unit_id: extractField(data, 'original-unit-id', symbolIndex),
        //         unit_conversion_types: extractField(data, 'unit-conversion-types', symbolIndex, true),
        //         description: extractField(data, 'description', symbolIndex),
        //         has_intraday: definedValueOrDefault(extractField(data, 'has-intraday', symbolIndex), false),
        //         has_no_volume: definedValueOrDefault(extractField(data, 'has-no-volume', symbolIndex), undefined),
        //         visible_plots_set: definedValueOrDefault(extractField(data, 'visible-plots-set', symbolIndex), undefined),
        //         minmov: extractField(data, 'minmovement', symbolIndex) || extractField(data, 'minmov', symbolIndex) || 0,
        //         minmove2: extractField(data, 'minmove2', symbolIndex) || extractField(data, 'minmov2', symbolIndex),
        //         fractional: extractField(data, 'fractional', symbolIndex),
        //         pricescale: extractField(data, 'pricescale', symbolIndex),
        //         type: extractField(data, 'type', symbolIndex),
        //         session: extractField(data, 'session-regular', symbolIndex),
        //         session_holidays: extractField(data, 'session-holidays', symbolIndex),
        //         corrections: extractField(data, 'corrections', symbolIndex),
        //         timezone: extractField(data, 'timezone', symbolIndex),
        //         supported_resolutions: definedValueOrDefault(extractField(data, 'supported-resolutions', symbolIndex, true), this._datafeedSupportedResolutions),
        //         has_daily: definedValueOrDefault(extractField(data, 'has-daily', symbolIndex), true),
        //         intraday_multipliers: definedValueOrDefault(extractField(data, 'intraday-multipliers', symbolIndex, true), ['1', '5', '15', '30', '60']),
        //         has_weekly_and_monthly: extractField(data, 'has-weekly-and-monthly', symbolIndex),
        //         has_empty_bars: extractField(data, 'has-empty-bars', symbolIndex),
        //         volume_precision: definedValueOrDefault(extractField(data, 'volume-precision', symbolIndex), 0),
        //         format: 'price',
        //     }
            // {
            //     full_name: "NYSE:AAPLUSD",
            //     name: "AAPL",
            //     description: "Apple Inc",
            //     exchange: "NYSE",
            //     listed_exchange: "NYSE",
            //     exchange_traded: "NYSE",
            //     format: "price",
            //     minmovement: 1,
            //     minmovement2: 0,
            //     pricescale: 1,
            //     has_dwm: true,
            //     has_intraday: true,
            //     has_no_volume: false,
            //     type: "stock",
            //     ticker: "AAPL~0",
            //     timezone: "America/New_York",
            //     session_regular: "0900-1600",
            // }
        );

    } else {
    res.status(405).json({ message: 'Method not allowed.' });
}
};

export default SymbolInfo;
