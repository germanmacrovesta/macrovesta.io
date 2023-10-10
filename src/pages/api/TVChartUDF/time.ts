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

const Time = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const currentTime = Math.floor(Date.now() / 1000) // Convert milliseconds to seconds

    res.status(200).send(currentTime.toString())
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}

export default Time
