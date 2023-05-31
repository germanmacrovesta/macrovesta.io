<<<<<<< HEAD
import Head from "next/head";
import { TVChartContainer } from "../components/TVChartContainer";
import {
    ChartingLibraryWidgetOptions,
    ResolutionString,
} from "../../public/static/charting_library/charting_library";
import ImportCsvForm from '../components/importCSVForm'

// const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
//     symbol: "AAPL",
//     interval: "1D" as ResolutionString,
//     library_path: "/static/charting_library/",
//     locale: "en",
//     charts_storage_url: "https://saveload.tradingview.com",
//     charts_storage_api_version: "1.1",
//     client_id: "tradingview.com",
//     user_id: "public_user_id",
//     fullscreen: false,
//     autosize: true,
// };

export default function GraphPage() {
    return (
        <>
            <Head>
                <title>TradingView Charting Library and Next.js</title>
                <script src="/static/datafeeds/udf/dist/bundle.js" async />
            </Head>
            <main>
                {/* <TVChartContainer {...defaultWidgetProps} /> */}
                <ImportCsvForm />
            </main>
        </>
    );
}
=======
<!DOCTYPE html>
<html>
<head>
  <title>Simple Web Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <h1>Welcome to My Web Page</h1>
  <p>This is a simple web page created using HTML and CSS.</p>
  <p>Feel free to modify and enhance it as you like!</p>
</body>
</html>
>>>>>>> 856058cd4627b583b68ced5893270616cc776d16
