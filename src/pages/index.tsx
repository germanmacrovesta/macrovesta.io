import { type NextPage } from 'next'
import Head from 'next/head'
import { prisma } from '../server/db'
import Sidebar from '../components/sidebar'
import Breadcrumbs from '../components/breadcrumbs'
import TabMenu from '../components/tabmenu'
import { useRouter } from 'next/router'
import { TabMenuArray } from '../components/tabMenuArray'
import React from 'react'
import { TVChartContainer } from '../components/TVChartContainer'
import type {
  ChartingLibraryWidgetOptions,
  ResolutionString
} from '../../public/static/charting_library/charting_library'
import GroupedBarChart from '../components/groupedBarChart'
import FormSubmit from '../components/formSubmit'
import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'
import BullishBearishDonut from '../components/bullishBearishDonut'
import { useSession, getSession } from 'next-auth/react'
import { useDateFormatter, useLocale } from 'react-aria'
import { WeglotLanguageSwitcher } from '~/components/weglotLanguageSwitcher'
import useWeglotLang from '../components/useWeglotLang'
import MonthlyIndex from '~/components/MonthlyIndex'
import { groupAndStringifyContracts, formatAndStringifyBasisData } from '../utils/calculateUtils'
import { getCurrentMonth, oneWeekAgo } from '../utils/dateUtils'
import SeasonalIndex from '~/components/SeasonalIndex'
import LatestMarketReport from '~/components/LatestMarketReport'
import CTZ23 from '~/components/CTZ23'
import DomesticPrices from '~/components/DomesticPrices'
import WeeklySentimentSurvey from '~/components/WeeklySentimentSurvey'
import RecentEvents from '~/components/RecentEvents'
import BasisCosts from '~/components/BasisCosts'
import USExportSales from '~/components/USExportSales'
import FutureConsiderations from '~/components/FutureConsiderations'
import InCountryNews from '~/components/InCountryNews'
import CottonOnCall from '~/components/CottonOnCall'
import CommitmentOfTraders from '~/components/CommitmentOfTraders'
import SupplyAndDemmand from '~/components/SupplyAndDemmand'
import FutureContractsStudy from '~/components/FutureContractsStudy'
import V4 from '~/components/V4'
import LearnMore from '~/components/LearnMore'

// const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
//   symbol: 'AAPL',
//   interval: '1D' as ResolutionString,
//   library_path: '/static/charting_library/',
//   locale: 'en',
//   charts_storage_url: 'https://saveload.tradingview.com',
//   charts_storage_api_version: '1.1',
//   client_id: 'tradingview.com',
//   user_id: 'public_user_id',
//   fullscreen: false,
//   autosize: true
// }

// const selectAppropriateImage = (inv, value) => {
//   let imagesrc = ''
//   if (inv === 'Y') {
//     if (value < 15) {
//       imagesrc = '/Index_Neutral.jpg'
//     } else if (value < 50) {
//       imagesrc = '/Index_Inverse_Likely.jpg'
//     } else {
//       imagesrc = '/Index_Inverse_High.jpg'
//     }
//   } else {
//     if (value < 15) {
//       imagesrc = '/Index_Neutral.jpg'
//     } else if (value < 50) {
//       imagesrc = '/Index_Non_Likely.jpg'
//     } else {
//       imagesrc = '/Index_Non_High.jpg'
//     }
//   }
//   return (
//     <img className="w-[400px]" src={imagesrc} />
//   )
// }

// const renderers = {
//   h1: ({ node, ...props }) => <h1 {...props} />,
//   h2: ({ node, ...props }) => <h2 {...props} />,
//   h3: ({ node, ...props }) => <h3 {...props} />,
//   h4: ({ node, ...props }) => <h4 {...props} />,
//   h5: ({ node, ...props }) => <h5 {...props} />,
//   h6: ({ node, ...props }) => <h6 {...props} />
// }

// TODO: Use <Image></Image> from next instead <img> - Better performance.
// TODO: The data that will arrive at the Home page from the server needs to be typed here.Type it when we are sure of the final form in which the data will arrive.

interface HomeProps {
  monthlyIndexData: unknown;
  seasonalIndexData: unknown;
  snapshotsData: unknown;
  countryNewsData: unknown;
  seasonsData: unknown;
  basisData: unknown;
  initialSentimentData: unknown;
  contractData: unknown;
  futureContractsStudyData: unknown;
  commentsData: unknown;
  commitmentData: unknown;
  supplyAndDemandData: unknown;
  cottonReportURLData: unknown;
  conclusionData: unknown;
}

const Home: NextPage<HomeProps> = ({ monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, contractData, futureContractsStudyData, commentsData, commitmentData, supplyAndDemandData, cottonReportURLData, conclusionData }) => {
  const router = useRouter()
  const url = router.pathname

  const currentLang = useWeglotLang()

  const { data: session } = useSession()

  const baseUrlArray = url.split('/')
  const urlArray: any = []

  baseUrlArray.forEach((urlCrumb) => {
    if (urlCrumb.startsWith('[')) {
      urlArray.push(router.query[`${urlCrumb.slice(1, -1)}`])
    } else {
      urlArray.push(urlCrumb)
    }
  })

  let root = ''
  let urlPath = ''

  const splitUrl = (urlcrumbs: any, number: any) => {
    for (let i = 1; i < urlcrumbs.length; i++) {
      if (i < number) {
        root += '/'
        root += urlcrumbs[i]
      } else {
        urlPath += '/'
        urlPath += urlcrumbs[i]
      }
    }
  }

  splitUrl(urlArray, 1)

  // const [degrees, setDegrees] = React.useState(90)

  // React.useEffect(() => {
  //   setDegrees(90 - (parseFloat(JSON.parse(monthlyIndexData).probability_rate) / 100 * 90) * (JSON.parse(monthlyIndexData).inverse_month === 'Y' ? 1 : -1))
  // }, [monthlyIndexData])

  // const data = [
  //   { country: 'Brazil', CTZ23: 10, CTZ24: 20 },
  //   { country: 'USA', CTZ23: 30, CTZ24: 40 },
  //   { country: 'WAF', CTZ23: 20, CTZ24: 40 },
  //   { country: 'Australia', CTZ23: 30, CTZ24: 50 }
  //   // ...
  // ]

  // const linedata = [
  //   {
  //     name: 'Series 1',
  //     data: [
  //       { time: '2023-01-01T00:00:00Z', value: 12 },
  //       { time: '2023-01-08T00:00:00Z', value: 12 },
  //       { time: '2023-02-01T00:00:00Z', value: 22 },
  //       { time: '2023-02-08T00:00:00Z', value: 22 },
  //       { time: '2023-03-01T00:00:00Z', value: 21 },
  //       { time: '2023-04-01T00:00:00Z', value: 23 },
  //       { time: '2025-01-01T00:00:00Z', value: 26 }
  //       // more data...
  //     ]
  //   },
  //   {
  //     name: 'Series 2',
  //     data: [
  //       { time: '2023-01-01T00:00:00Z', value: 15 },
  //       { time: '2023-01-08T00:00:00Z', value: 15 },
  //       { time: '2023-02-01T00:00:00Z', value: 18 },
  //       { time: '2023-02-08T00:00:00Z', value: 18 },
  //       { time: '2023-03-01T00:00:00Z', value: 11 },
  //       { time: '2023-04-01T00:00:00Z', value: 13 },
  //       { time: '2025-01-01T00:00:00Z', value: 16 }
  //       // more data...
  //     ]
  //   }
  //   // more series...
  // ]

  // const [bullishBearish, setBullishBearish] = React.useState(undefined)

  // interface CountryData {
  //   country: string;
  //   CTZ23: number;
  //   CTZ24: number;
  // }

  // type formattedBasis = {
  //   country: string;
  //   date_of_basis_report: string;
  //   CTZ23: number;
  //   CTZ24: number;
  // }[]

  // function transformData(input) {
  //   // Create a container for the new data structure
  //   let output = {};
  //   const start_day = 1

  //   // Container to keep track of the sum and count for each contract and week
  //   let averages = {};

  //   // Iterate over the input data
  //   for (let item of input) {
  //     // For each contract date, add data to the output
  //     for (let key of Object.keys(item)) {
  //       if (key.startsWith("CTZ")) {
  //         let contractName = `${item.country} CTZ${key.slice(-2)}`;

  //         // If this contract name hasn't been added to the output yet, initialize it
  //         if (!output[contractName]) {
  //           output[contractName] = [];
  //           averages[contractName] = {};
  //         }

  //         let date = new Date(item.date_of_basis_report);
  //         let week = getWeek(date, start_day);
  //         // let week = getWeek(date, start_day);

  //         // If this week hasn't been added to the averages for this contract yet, initialize it
  //         if (!averages[contractName][week]) {
  //           averages[contractName][week] = { sum: 0, count: 0 };
  //         }

  //         // Add the data point to the averages
  //         averages[contractName][week].sum += item[key];
  //         averages[contractName][week].count++;
  //       }
  //     }
  //   }

  //   // Convert the averages to actual averages and add them to the output
  //   for (let contractName of Object.keys(averages)) {
  //     for (let week of Object.keys(averages[contractName])) {
  //       let average = parseFloat((averages[contractName][week].sum / averages[contractName][week].count).toFixed(0));
  //       // Assume the first day of the week (Monday) for the time
  //       let date = new Date(new Date().getFullYear(), 0, 1 + (week - 1) * 7);
  //       output[contractName].push({ time: date.toISOString(), value: average });
  //     }
  //   }

  //   // Convert the output object to an array
  //   output = Object.keys(output).map(name => {
  //     return { name: name, data: output[name] };
  //   });

  //   return output;
  // }

  // function transformSurveyData(inputArray, propertyUsed) {
  //   const outputArray = [];

  //   // Group the objects based on bullish_or_bearish property
  //   const groups = inputArray.reduce((result, obj) => {
  //     const key = obj.bullish_or_bearish;
  //     if (!result[key]) {
  //       result[key] = [];
  //     }
  //     result[key].push(obj);
  //     return result;
  //   }, {});

  //   // Convert each group into the desired format
  //   for (const groupName in groups) {
  //     const group = groups[groupName];
  //     const data = group.map(obj => {
  //       return {
  //         time: obj.date_of_survey,
  //         value: parseFloat(obj[propertyUsed])
  //       };
  //     });

  //     outputArray.push({
  //       name: groupName,
  //       data: data
  //     });
  //   }

  //   return outputArray;
  // }

  // function transformSurveyData(inputArray, propertyUsed) {
  //   const outputArray = [];
  //   const averages = {};

  //   for (const obj of inputArray) {
  //     const groupName = obj.bullish_or_bearish;

  //     if (!averages[groupName]) {
  //       averages[groupName] = {};
  //     }

  //     const date = new Date(obj.date_of_survey);
  //     const dateString = date.toISOString().split("T")[0];

  //     if (!averages[groupName][dateString]) {
  //       averages[groupName][dateString] = {
  //         sum: 0,
  //         count: 0
  //       };
  //     }

  //     averages[groupName][dateString].sum += parseFloat(obj[propertyUsed]);
  //     averages[groupName][dateString].count++;
  //   }

  //   for (const groupName in averages) {
  //     const group = averages[groupName];
  //     const data = [];

  //     for (const dateString in group) {
  //       const average =
  //         group[dateString].sum / group[dateString].count;
  //       const date = new Date(dateString);

  //       data.push({
  //         time: date.toISOString(),
  //         value: average
  //       });
  //     }

  //     outputArray.push({
  //       name: groupName,
  //       data: data
  //     });
  //   }

  //   return outputArray;
  // }

  // const getCottonOnCallWeekData = (data, salesOrPurchases) => {
  //   let october = { name: "october", data: [], noCircles: true }
  //   let december = { name: "december", data: [], noCircles: true }
  //   let march = { name: "march", data: [], noCircles: true }
  //   let may = { name: "may", data: [], noCircles: true }
  //   let july = { name: "july", data: [], noCircles: true }
  //   data.forEach((item) => {
  //     october.data.push({ x: parseInt(item.week), y: parseInt(item[`october_${salesOrPurchases}`]) })
  //     december.data.push({ x: parseInt(item.week), y: parseInt(item[`december_${salesOrPurchases}`]) })
  //     march.data.push({ x: parseInt(item.week), y: parseInt(item[`march_${salesOrPurchases}`]) })
  //     may.data.push({ x: parseInt(item.week), y: parseInt(item[`may_${salesOrPurchases}`]) })
  //     july.data.push({ x: parseInt(item.week), y: parseInt(item[`july_${salesOrPurchases}`]) })
  //   })
  //   return [october, december, march, may, july]
  // }

  // const getCommitmentOfTradersWeekData = (data) => {
  //   let producer_merchant_net = { name: "Producer Merchant Net", data: [], noCircles: true }
  //   let open_interest_all = { name: "Open Interest All", data: [], noCircles: true }
  //   let swap_position_net = { name: "Swap Position Net", data: [], noCircles: true }
  //   let managed_money_net = { name: "Managed Money Net", data: [], noCircles: true }
  //   let other_reportables_net = { name: "Other Reportables Net", data: [], noCircles: true }
  //   let total_reportables_net = { name: "Total Reportables Net", data: [], noCircles: true }
  //   let non_reportables_net = { name: "Non Reportables Net", data: [], noCircles: true }
  //   let specs_net = { name: "Specs Net", data: [], noCircles: true }
  //   data.forEach((item) => {
  //     producer_merchant_net.data.push({ x: parseInt(item.week), y: parseInt(item.producer_merchant_net) })
  //     open_interest_all.data.push({ x: parseInt(item.week), y: parseInt(item.open_interest_all) })
  //     swap_position_net.data.push({ x: parseInt(item.week), y: parseInt(item.swap_position_net) })
  //     managed_money_net.data.push({ x: parseInt(item.week), y: parseInt(item.managed_money_net) })
  //     other_reportables_net.data.push({ x: parseInt(item.week), y: parseInt(item.other_reportables_net) })
  //     total_reportables_net.data.push({ x: parseInt(item.week), y: parseInt(item.total_reportables_net) })
  //     non_reportables_net.data.push({ x: parseInt(item.week), y: parseInt(item.non_reportables_net) })
  //     specs_net.data.push({ x: parseInt(item.week), y: parseInt(item.specs_net) })
  //   })
  //   console.log("product_merchant_net", producer_merchant_net)
  //   return [producer_merchant_net, open_interest_all, swap_position_net, managed_money_net, other_reportables_net, total_reportables_net, non_reportables_net, specs_net]
  // }
  // const getCommitmentOfTradersSeasonData = (data) => {
  //   let producer_merchant_net = { name: "Producer Merchant Net", data: [], noCircles: true }
  //   let open_interest_all = { name: "Open Interest All", data: [], noCircles: true }
  //   let swap_position_net = { name: "Swap Position Net", data: [], noCircles: true }
  //   let managed_money_net = { name: "Managed Money Net", data: [], noCircles: true }
  //   let other_reportables_net = { name: "Other Reportables Net", data: [], noCircles: true }
  //   let total_reportables_net = { name: "Total Reportables Net", data: [], noCircles: true }
  //   let non_reportables_net = { name: "Non Reportables Net", data: [], noCircles: true }
  //   let specs_net = { name: "Specs Net", data: [], noCircles: true }
  //   data.forEach((item) => {
  //     producer_merchant_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.producer_merchant_net) })
  //     open_interest_all.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.open_interest_all) })
  //     swap_position_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.swap_position_net) })
  //     managed_money_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.managed_money_net) })
  //     other_reportables_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.other_reportables_net) })
  //     total_reportables_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.total_reportables_net) })
  //     non_reportables_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.non_reportables_net) })
  //     specs_net.data.push({ x: parseInt(item.calendar_year), y: parseInt(item.specs_net) })
  //   })
  //   console.log("product_merchant_net", producer_merchant_net)
  //   return [producer_merchant_net, open_interest_all, swap_position_net, managed_money_net, other_reportables_net, total_reportables_net, non_reportables_net, specs_net]
  // }

  // const [salesWeekOrYear, setSalesWeekOrYear] = React.useState('Week')
  // const [salesYear, setSalesYear] = React.useState('0102')
  // const [salesWeek, setSalesWeek] = React.useState(1)

  // const [purchasesWeekOrYear, setPurchasesWeekOrYear] = React.useState('Week')
  // const [purchasesYear, setPurchasesYear] = React.useState('0102')
  // const [purchasesWeek, setPurchasesWeek] = React.useState(1)

  // const [totalOnCallWeekOrYear, setTotalOnCallWeekOrYear] = React.useState('Week')
  // const [totalOnCallYear, setTotalOnCallYear] = React.useState('0102')
  // const [totalOnCallWeek, setTotalOnCallWeek] = React.useState(1)

  // const [UOCWeekOrYear, setUOCWeekOrYear] = React.useState('Week')
  // const [UOCYear, setUOCYear] = React.useState('0102')
  // const [UOCWeek, setUOCWeek] = React.useState(1)

  // const [exportSalesWeekOrYear, setExportSalesWeekOrYear] = React.useState('Week')
  // const [exportSalesYear, setExportSalesYear] = React.useState(2010)
  // const [exportSalesWeek, setExportSalesWeek] = React.useState(1)

  // const [selectedSupplyAndDemandStartDate, setSelectedSupplyAndDemandStartDate] = React.useState(parseDate(dateSixMonthsAgo));
  // const [selectedSupplyAndDemandEndDate, setSelectedSupplyAndDemandEndDate] = React.useState(parseDate(today));

  // const [commitmentPropertiesArray, setCommitmentPropertiesArray] = React.useState(["open_interest_all", "producer_merchant_net", "swap_position_net", "managed_money_net", "other_reportables_net", "total_reportables_net", "non_reportables_net", "specs_net"])
  // const [commitmentNamesArray, setCommitmentNamesArray] = React.useState(["Open Interest All", "Producer Merchant Net", "Swap Position Net", "Managed Money Net", "Other Reportables Net", "Total Reportables Net", "Non Reportables Net", "Specs Net"])

  // const markdown = `# Ira media medius induit deum

  // ## Exaudire enim ad sit

  // Lorem markdownum colores, se gravatum flet vulnera: dum in, onusque parvumque geminata quoque. Expositum valentes nobis capax opes rapidas quas. Iudicis miserande prius ea iubet cupidine? Inde sua amo latis amantis: Hiberis sinus fervet fecit ex ullis circumfluit furor turbida, mox inque, infera? Nec lumina maneret: patrios etiamnum modum et modo generum quamvis in verbis, si, hic rerum.

  // > Inhibente proceresque morata paelice, precor veri; umeris Tereu sic constitit in harenosae ut diva est, hoc. Cruore cremat, quam cornua verba. In forte defluit valuisse gaudens faciem: luctisono et vulnere, tuo ordine navigii. Agenore fuso sidera; sacra exit: est modo, ibi saxa aetate domitis enim.

  // ## Protinus clara

  // Rhoetus arcusque; in coma nosti fratrem ipse abstulerat fassurae satyri: nil dextra corripitur saetae, expositum sententia scelus. Latentia sua progenuit nam enim lyramque amori post, Ilithyiam datis per vestris ferrugine quorum, admirantibus. Novos iter ut: ego omnes, campis memini.

  // `

  // Weglot Initialize
  React.useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.weglot.com/weglot.min.js'
    script.async = true

    script.onload = () => {
      Weglot.initialize({
        api_key: 'wg_60b49229f516dee77edb3109e6a46c379'
      })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Macrovesta</title>
        <meta name="description" content="Generated by Macrovesta" />
        <link rel="icon" href="/favicon.ico" />
        {/* <script src="/static/datafeeds/udf/dist/bundle.js" async /> */}
        <link rel="alternate" hrefLang="en" href="https://www.macrovesta.ai" />
        <link rel="alternate" hrefLang="pt-br" href="https://pt-br.macrovesta.ai" />
        <link rel="alternate" hrefLang="es" href="https://es.macrovesta.ai" />
        <link rel="alternate" hrefLang="tr" href="https://tr.macrovesta.ai" />
        <link rel="alternate" hrefLang="th" href="https://th.macrovesta.ai" />
        {/* <script type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
        <script>
          {Weglot.initialize({
            api_key: 'wg_60b49229f516dee77edb3109e6a46c379'
          })}
        </script> */}
      </Head>
      <main className="main grid grid-cols-[160px_auto] h-screen items-center">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-20 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={'Macrovesta Demo'} urlPath={urlPath} user={session?.user.name} />
            <TabMenu data={TabMenuArray} urlPath={urlPath} />
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200">
            <p className='mx-8 text-justify'>
              Macrovesta is being developed to deliver AI-powered cotton market expertise from farmer to retailer. The insights delivered by your personalised dashboard will provide you with the information and context you need to make confident risk and position management decisions. Our artificial intelligence model uses cutting edge technology to generate insights and explain how and why they are important to your business.
            </p>
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">

              {/* <div>
                <LineGraph data={linedata} />
              </div> */}

              <div className="text-center font-semibold text-xl">The Macrovesta Index</div>
              <div className="flex justify-around gap-8">
                {/* <IndexDial probability={0} /> */}
                <MonthlyIndex monthlyIndexData={monthlyIndexData}></MonthlyIndex>
                <SeasonalIndex seasonalIndexData={seasonalIndexData}></SeasonalIndex>
              </div>
            </div>

            <LatestMarketReport
              currentLang={currentLang}
              conclusionData={conclusionData}
              cottonReportURLData={cottonReportURLData}
            />

            <CTZ23
              session={session}
              contractData={contractData}
              commentsData={commentsData}
            />

            <DomesticPrices
              session={session}
              commentsData={commentsData}
            />

            {/* <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <TVChartContainer {...defaultWidgetProps} />
            </div> */}

            <WeeklySentimentSurvey
              session={session}
              sentimentData={JSON.parse(initialSentimentData)}
            />

            <RecentEvents
              session={session}
              snapshotsData={snapshotsData}
            />

            <FutureConsiderations
              snapshotsData={snapshotsData}
              session={session}
            />

            <BasisCosts
              session={session}
              basisData={basisData}
              commentsData={commentsData}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-8">
              <USExportSales
                commentsData={commentsData}
                session={session}
              />

              <InCountryNews
                session={session}
                countryNewsData={countryNewsData}
              />
            </div>

            <CottonOnCall
              commentsData={commentsData}
              session={session}
            />

            {/* <div className="flex flex-col bg-[#ffffff] items-center p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12">
              <div className="text-xl font-semibold text-center pt-4">Future Contracts Study</div>
              <img src="/Charts_Under_Construction_Wide.png" />
              <LineGraphNotTime data={getCottonOnCallWeekData(JSON.parse(cottonOnCallData).filter((data) => data.season == "0102"))} graphWidth={1000} graphHeight={600} xDomain2={52} xAxisTitle="Week" />
              <LineGraphNotTime data={getCottonOnCallSeasonData(JSON.parse(cottonOnCallData).filter((data) => data.week == "1"))} graphWidth={1000} graphHeight={600} xDomain1={2001} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" />
              <LineGraphNotTime data={getCommitmentOfTradersWeekData(JSON.parse(commitmentData).filter((data) => parseInt(data.calendar_year) == 2010))} graphWidth={1000} graphHeight={600} xDomain2={52} xAxisTitle="Week" />
              <LineGraphNotTime data={getCommitmentOfTradersSeasonData(JSON.parse(commitmentData).filter((data) => parseInt(data.week) == 1))} graphWidth={1000} graphHeight={600} xDomain1={2009} xDomain2={2023} xAxisTitle="Year" yAxisTitle="Sales" />
            </div> */}

            <CommitmentOfTraders
              commitmentData={commitmentData}
              commentsData={commentsData}
              session={session}
            />

            <SupplyAndDemmand
              supplyAndDemandData={supplyAndDemandData}
              commentsData={commentsData}
              session={session}
            />

            <FutureContractsStudy
              futureContractsStudyData={futureContractsStudyData}
            />

            <V4
              seasonsData={seasonsData}
            />

            <LearnMore />
          </div>
        </div>
      </main >
    </>
  )
}
// some random shit added by Vic
export const getServerSideProps = async (context: any) => {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/introduction'
      }
    }
  }

  // TODO Parallel querys using Promise.all - Better performance
  const [sentiment, basis, contract, season, future, countryNews, snapshot, monthlyIndex, seasonalIndex, comments, commitment, supplydemand, cottonreport, conclusion] = await Promise.all([
    prisma?.sentiment_survey.findMany({ orderBy: { date_of_survey: 'asc' } }),
    prisma?.basis_comparison.findMany({
      orderBy: {
        date_of_basis_report: 'asc'
      }
      // where: {
      //   date_of_basis_report: {
      //     gte: oneWeekAgo.toISOString(), // Filtering records greater than or equal to one week ago
      //     lte: today.toISOString() // Filtering records less than or equal to the current date
      //   }
      // }
    }),
    prisma?.cotton_contracts.findMany({}),
    prisma?.comparison_charts_with_17_months_year.findMany({ orderBy: { date_of_low: 'desc' } }),
    prisma?.future_contracts_study.findMany({ orderBy: { date_of_high: 'desc' } }),
    prisma?.in_country_news.findMany({ where: { verified: true }, orderBy: { date_of_in_country_news: 'desc' } }),
    prisma?.snapshot_strategy.findMany({ where: { verified: true }, orderBy: { date_of_snapshot_strategy: 'desc' } }),
    prisma?.monthly_index.findFirst({ where: { year: new Date().getFullYear(), month: getCurrentMonth() } }),
    prisma?.seasonal_index.findFirst({ /* where: {year: new Date().getFullYear()} */ }),
    prisma?.comments.findMany({ where: { date_of_comment: { gt: oneWeekAgo.toISOString() } }, orderBy: { date_of_comment: 'desc' } }),
    prisma?.commitment_of_traders.findMany({}),
    prisma?.supply_and_demand.findMany({ orderBy: { date: 'asc' } }),
    prisma?.external_Links.findMany({ where: { type: 'Cotton Report' }, orderBy: { date_created: 'desc' } }),
    prisma?.conclusion.findFirst({ orderBy: { date_created: 'desc' } })
  ])

  // Transform data for properly read by components
  const initialSentimentData = JSON.stringify(sentiment)
  const basisData = formatAndStringifyBasisData(basis)
  const contractData = groupAndStringifyContracts(contract)

  const seasonsData = JSON.stringify(season)
  const futureContractsStudyData = JSON.stringify(future)
  const countryNewsData = JSON.stringify(countryNews)
  const snapshotsData = JSON.stringify(snapshot)
  const monthlyIndexData = JSON.stringify(monthlyIndex)
  const seasonalIndexData = JSON.stringify(seasonalIndex)
  const commentsData = JSON.stringify(comments)
  // const onCall = await prisma?.cotton_on_call.findMany({})
  // const cottonOnCallData = JSON.stringify(onCall)
  // const cottonOnCallData = JSON.stringify({ variable: 'hello world' })
  const commitmentData = JSON.stringify(commitment)
  // const exportdata = await prisma?.us_export_sales.findMany({})
  // const exportSalesData = JSON.stringify(exportdata)
  // const exportSalesData = JSON.stringify({ variable: 'hello world' })
  const supplyAndDemandData = JSON.stringify(supplydemand)
  const cottonReportURLData = JSON.stringify(cottonreport)
  const conclusionData = JSON.stringify(conclusion)
  // const aIndex = await prisma?.a_index.findMany({})
  // const aIndexData = JSON.stringify(aIndex)
  // const aIndexData = JSON.stringify({ variable: 'hello world' })
  // console.log(monthlyIndexData)

  return {
    props: { monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, contractData, futureContractsStudyData, commentsData, commitmentData, supplyAndDemandData, cottonReportURLData, conclusionData }
  }
}

export default Home
