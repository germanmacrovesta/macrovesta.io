// pages/api/import-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { prisma } from '../../../server/db'
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
  ResolutionString
  // ResolveCallback,
  // SearchSymbolResultItem,
  // SearchSymbolsCallback,
  // ServerTimeCallback,
  // SubscribeBarsCallback,
  // TimescaleMark,
  // SymbolResolveExtension,
  // VisiblePlotsSet,
} from '../../../../public/static/charting_library/datafeed-api'

const Marks = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200)
    // .json(
    //     {
    //         id: [array of ids],
    //         time: [array of times],
    //         color: [array of colors],
    //         text: [array of texts],
    //         label: [array of labels],
    //         labelFontColor: [array of label font colors],
    //         minSize: [array of minSizes],
    //     }
    // );
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default Marks
