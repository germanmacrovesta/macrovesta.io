import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { prisma } from '../server/db';
import Sidebar from '../components/sidebar';
import Breadcrumbs from '../components/breadcrumbs';
import TabMenu from '../components/tabmenu';
import { useRouter } from "next/router";
import { TabMenuArray } from '../components/tabMenuArray';
import React from "react";
import SingleSelectDropdown from '../components/singleSelectDropdown';
import { TVChartContainer } from "../components/TVChartContainer";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../public/static/charting_library/charting_library";
import GroupedBarChart from '../components/groupedBarChart';
import LineGraph from '../components/lineGraph';
import FormSubmit from '../components/formSubmit';

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: "AAPL",
  interval: "1D" as ResolutionString,
  library_path: "/static/charting_library/",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

const selectAppropriateImage = (inv, value) => {
  let imagesrc = "";
  if (inv == "Y") {
    if (value < 15) {

      imagesrc = "/Index_Neutral.jpg"

    } else if (value < 50) {
      imagesrc = "/Index_Inverse_Likely.jpg"
    } else {
      imagesrc = "/Index_Inverse_High.jpg"
    }
  } else {
    if (value < 15) {

      imagesrc = "/Index_Neutral.jpg"

    } else if (value < 50) {
      imagesrc = "/Index_Non_Likely.jpg"
    } else {
      imagesrc = "/Index_Non_High.jpg"
    }
  }
  return (
    <img className="w-[400px]" src={imagesrc} />
  )
}

const parseDateString = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  if (isNaN(date)) {
    return undefined
  } else {
    return `${day}-${month}-${year}`;
  }

};

const Home: NextPage = ({ monthlyIndexData, snapshotsData, countryNewsData, seasonsData, basisData }) => {
  const router = useRouter();
  const url = router.pathname;

  const baseUrlArray = url.split('/');
  let urlArray: any = [];
  baseUrlArray.forEach((urlCrumb) => {
    if (urlCrumb.startsWith('[')) {
      urlArray.push(router.query[`${urlCrumb.slice(1, -1)}`])
    } else {
      urlArray.push(urlCrumb)
    }
  })
  let root = '';
  let urlPath = '';
  const splitUrl = (urlcrumbs: any, number: any) => {
    for (let i = 1; i < urlcrumbs.length; i++) {
      if (i < number) {
        root += '/';
        root += urlcrumbs[i];
      } else {
        urlPath += '/';
        urlPath += urlcrumbs[i];
      }
    }
  }
  splitUrl(urlArray, 1)

  const [degrees, setDegrees] = React.useState(90)
  const [season1, setSeason1] = React.useState('')
  const [season2, setSeason2] = React.useState('')
  const [season3, setSeason3] = React.useState('')

  const [countryNewsPopup, setCountryNewsPopup] = React.useState(null)
  const [snapshotPopup, setSnapshotPopup] = React.useState(null)

  React.useEffect(() => {
    setSeason1(JSON.parse(seasonsData)[2]?.season ?? '')
    setSeason2(JSON.parse(seasonsData)[1]?.season ?? '')
    setSeason3(JSON.parse(seasonsData)[0]?.season ?? '')
  }, [seasonsData])

  React.useEffect(() => {
    setDegrees(90 - (parseFloat(JSON.parse(monthlyIndexData).probability_rate) / 100 * 90) * (JSON.parse(monthlyIndexData).inverse_month == "Y" ? 1 : -1))
  }, [monthlyIndexData])

  const data = [
    { country: 'Brazil', CTZ23: 10, CTZ24: 20 },
    { country: 'USA', CTZ23: 30, CTZ24: 40 },
    { country: 'WAF', CTZ23: 20, CTZ24: 40 },
    { country: 'Australia', CTZ23: 30, CTZ24: 50 },
    // ...
  ];

  const linedata = [
    {
      name: "Series 1",
      data: [
        { time: "2023-01-01T00:00:00Z", value: 12 },
        { time: "2023-01-08T00:00:00Z", value: 12 },
        { time: "2023-02-01T00:00:00Z", value: 22 },
        { time: "2023-02-08T00:00:00Z", value: 22 },
        { time: "2023-03-01T00:00:00Z", value: 21 },
        { time: "2023-04-01T00:00:00Z", value: 23 },
        { time: "2025-01-01T00:00:00Z", value: 26 },
        // more data...
      ],
    },
    {
      name: "Series 2",
      data: [
        { time: "2023-01-01T00:00:00Z", value: 15 },
        { time: "2023-01-08T00:00:00Z", value: 15 },
        { time: "2023-02-01T00:00:00Z", value: 18 },
        { time: "2023-02-08T00:00:00Z", value: 18 },
        { time: "2023-03-01T00:00:00Z", value: 11 },
        { time: "2023-04-01T00:00:00Z", value: 13 },
        { time: "2025-01-01T00:00:00Z", value: 16 },
        // more data...
      ],
    },
    // more series...
  ];

  const [openBasisCostForm, setOpenBasisCostForm] = React.useState(false)

  const [selectedCountry, setSelectedCountry] = React.useState(undefined)

  const handleBasisFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    setSubmitting(true);

    let country = "";
    let contractOneBasis = e.target["ctz23"].value;
    let contractTwoBasis = e.target["ctz24"].value;
    let errorMessage = "";
    let warningMessage = "";

    if (selectedCountry != null && selectedCountry != "Select Country") {
      country = selectedCountry;
    } else {
      errorMessage += "Please select a Country. ";
    }

    if (contractOneBasis == null || contractOneBasis == "") {
      errorMessage += "Please enter Estimate for CTZ23. ";
    }
    if (contractTwoBasis == null || contractTwoBasis == "") {
      errorMessage += "Please enter Estimate for CTZ24. ";
    }



    if (warningMessage !== "") {
      setWarning_Message(warningMessage);
      // throw new Error(errorMessage)
    } else {
      if (warning_Message != "") {
        setWarning_Message("")
      }
    }

    if (errorMessage != "") {
      setError_Message(errorMessage);
      setWarningSubmit(false);
      setSubmitting(false);
    } else {

      if (error_Message != "") {
        setError_Message("")
      }

      if (warningSubmit == false && warningMessage != "") {
        setWarningSubmit(true);
        setSubmitting(false);
      } else {
        // Get data from the form.
        const data = {
          country,
          contractOneBasis,
          contractTwoBasis
        };

        console.log(data);

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = "/api/add-basis-cost-estimate";

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: "POST",
          // Tell the server we're sending JSON.
          headers: {
            "Content-Type": "application/json"
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata
        };

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options);

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json().then(() => { setSubmitted(true); setSubmitting(false) });
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }

  };

  const [error_Message, setError_Message] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [warning_Message, setWarning_Message] = React.useState("");
  const [warningSubmit, setWarningSubmit] = React.useState(false);

  interface CountryData {
    country: string;
    CTZ23: number;
    CTZ24: number;
  }

  type formattedBasis = {
    country: string;
    date_of_basis_report: string;
    CTZ23: number;
    CTZ24: number;
  }[]

  const basisBarChartData = (originalData: formattedBasis) => {
    const today = new Date(); // Current date
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const data: formattedBasis = originalData.filter((basis: formattedBasis[number]) => basis.date_of_basis_report > oneWeekAgo.toISOString());
    const result: CountryData[] = Object.values(data.reduce((accumulator: { [key: string]: CountryData }, current) => {
      const { country, CTZ23, CTZ24 } = current;

      if (!accumulator[country]) {
        accumulator[country] = {
          country,
          CTZ23: CTZ23 || 0,
          CTZ24: CTZ24 || 0,
        };
      } else {
        accumulator[country]!.CTZ23 += CTZ23 || 0;
        accumulator[country]!.CTZ24 += CTZ24 || 0;
      }

      return accumulator;
    }, {})).map((countryData: CountryData) => {
      const { country, CTZ23, CTZ24 } = countryData;
      const count = data.filter(obj => obj.country === country).length;

      return {
        country,
        CTZ23: CTZ23 / count,
        CTZ24: CTZ24 / count
      };
    });

    console.log(result);
    return result
  }

  // function transformData(input) {
  //   // Create a container for the new data structure
  //   let output = {};

  //   // Iterate over the input data
  //   for (let item of input) {
  //     // For each contract date, add data to the output
  //     for (let key of Object.keys(item)) {
  //       if (key.startsWith("CTZ")) {
  //         let contractName = `${item.country} CTZ${key.slice(-2)}`;

  //         // If this contract name hasn't been added to the output yet, initialize it
  //         if (!output[contractName]) {
  //           output[contractName] = [];
  //         }

  //         // Add the data point
  //         output[contractName].push({ time: item.date_of_basis_report, value: item[key] });
  //       }
  //     }
  //   }

  //   // Convert the output object to an array
  //   output = Object.keys(output).map(name => {
  //     return { name: name, data: output[name] };
  //   });

  //   return output;
  // }

  // function transformData(input) {
  //   // Create a container for the new data structure
  //   let output = {};

  //   // Container to keep track of the sum and count for each contract and date
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

  //         let date = item.date_of_basis_report;

  //         // If this date hasn't been added to the averages for this contract yet, initialize it
  //         if (!averages[contractName][date]) {
  //           averages[contractName][date] = { sum: 0, count: 0 };
  //         }

  //         // Add the data point to the averages
  //         averages[contractName][date].sum += item[key];
  //         averages[contractName][date].count++;
  //       }
  //     }
  //   }

  //   // Convert the averages to actual averages and add them to the output
  //   for (let contractName of Object.keys(averages)) {
  //     for (let date of Object.keys(averages[contractName])) {
  //       let average = averages[contractName][date].sum / averages[contractName][date].count;
  //       output[contractName].push({ time: date, value: average });
  //     }
  //   }

  //   // Convert the output object to an array
  //   output = Object.keys(output).map(name => {
  //     return { name: name, data: output[name] };
  //   });

  //   return output;
  // }

  // function getWeek(date) {
  //   const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  //   tempDate.setUTCDate(tempDate.getUTCDate() + 3 - (tempDate.getUTCDay() + 6) % 7);
  //   const week1 = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 4));
  //   return 1 + Math.ceil(((tempDate - week1) / 86400000 + 3) / 7);
  // }

  function getWeek(date, startDay) {
    const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tempDate.setUTCDate(tempDate.getUTCDate() + 3 - (tempDate.getUTCDay() + 6 - startDay + 7) % 7);
    const week1 = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 4));
    return 1 + Math.ceil(((tempDate - week1) / 86400000 + 3) / 7);
  }


  function transformData(input) {
    // Create a container for the new data structure
    let output = {};
    const start_day = 1

    // Container to keep track of the sum and count for each contract and week
    let averages = {};

    // Iterate over the input data
    for (let item of input) {
      // For each contract date, add data to the output
      for (let key of Object.keys(item)) {
        if (key.startsWith("CTZ")) {
          let contractName = `${item.country} CTZ${key.slice(-2)}`;

          // If this contract name hasn't been added to the output yet, initialize it
          if (!output[contractName]) {
            output[contractName] = [];
            averages[contractName] = {};
          }

          let date = new Date(item.date_of_basis_report);
          let week = getWeek(date, start_day);

          // If this week hasn't been added to the averages for this contract yet, initialize it
          if (!averages[contractName][week]) {
            averages[contractName][week] = { sum: 0, count: 0 };
          }

          // Add the data point to the averages
          averages[contractName][week].sum += item[key];
          averages[contractName][week].count++;
        }
      }
    }

    // Convert the averages to actual averages and add them to the output
    for (let contractName of Object.keys(averages)) {
      for (let week of Object.keys(averages[contractName])) {
        let average = averages[contractName][week].sum / averages[contractName][week].count;
        // Assume the first day of the week (Monday) for the time
        let date = new Date(new Date().getFullYear(), 0, 1 + (week - 1) * 7);
        output[contractName].push({ time: date.toISOString(), value: average });
      }
    }

    // Convert the output object to an array
    output = Object.keys(output).map(name => {
      return { name: name, data: output[name] };
    });

    return output;
  }


  console.log("Basis Data", JSON.parse(basisData).filter((basis) => basis.country == "Brazil"))
  console.log("Line Data", transformData(JSON.parse(basisData).filter((basis) => basis.country == "Brazil")))

  const [basisCountry, setBasisCountry] = React.useState("Brazil")


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <script src="/static/datafeeds/udf/dist/bundle.js" async />
      </Head>
      <main className="grid grid-cols-[160px_auto] h-screen items-center">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-50 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={"Macrovesta Demo"} urlPath={urlPath} />
            <TabMenu data={TabMenuArray} urlPath={urlPath} />
          </header>
          <div className="p-6 bg-slate-200">
            Macrovesta is being developed to deliver AI-powered cotton market expertise from farmer to retailer. The insights delivered by your personalised dashboard will provide you with the information and context you need to make confident risk and position management decisions. Our artificial intelligence model uses cutting edge technology to generate insights and explain how and why they are important to your business.
            <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              {/* <div>
                <LineGraph data={linedata} />
              </div> */}

              <div className="text-center">
                The Macrovesta Index
              </div>
              <div className="flex justify-around gap-8">
                <div className="relative">
                  <div className="text-center">
                    Monthly Index
                  </div>
                  {selectAppropriateImage(JSON.parse(monthlyIndexData).inverse_month, parseFloat(JSON.parse(monthlyIndexData).probability_rate))}
                  {/* <img className="w-[400px]" src="/Index_Inverse_High.jpg" /> */}
                  <div className="absolute origin-right bg-turquoise w-[130px] ml-[68px] bottom-[45px] h-2 transition-all duration-1000" style={{
                    transform: `rotate(${90 - (parseFloat(JSON.parse(monthlyIndexData).probability_rate) / 100 * 90) * (JSON.parse(monthlyIndexData).inverse_month == "Y" ? 1 : -1)}deg)`
                  }}>
                    {/* <div className="origin-right bg-turquoise w-[150px] ml-[50px] bottom-[28px] h-2" style={{ transform: `rotate(${degrees}deg)` }}>
                    </div> */}
                  </div>
                  <div className="absolute bg-white shadow-center-lg text-black rounded-full right-0 w-12 h-12 grid place-content-center -translate-x-[178px] -translate-y-[25px] bottom-0">{JSON.parse(monthlyIndexData).probability_rate}</div>
                </div>
                <div>
                  <div className="text-center">
                    Seasonal Index
                  </div>
                  <img className="w-[400px]" src="/Draft_Index_indicator.svg" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col bg-[#ffffff] shadow-center-lg text-black rounded-xl px-4 py-2 mb-8 mx-8">
                <img className="w-fit" src="/example-chart.png" />
              </div>
              <div className="text-center text-2xl">Please Select the Seasons you want to compare</div>
              <div className="grid grid-cols-3 justify-center gap-8 mx-8 mt-4 text-xl">
                <div className="flex flex-col">
                  <SingleSelectDropdown
                    options={JSON.parse(seasonsData)}
                    label="Season"
                    variable="season"
                    onSelectionChange={(e) => setSeason1(e.season)}
                    placeholder="Select Season"
                    searchPlaceholder="Search Seasons"
                    includeLabel={false}
                    defaultValue={season1}
                  />
                  {/* <div className="text-center mt-4 mb-2 font-semibold">Season 1</div> */}
                  <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                    <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.high_price}</div>
                    <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_low)}</div>
                    <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_high)}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <SingleSelectDropdown
                    options={JSON.parse(seasonsData)}
                    label="Season"
                    variable="season"
                    colour="bg-deep_blue"
                    onSelectionChange={(e) => setSeason2(e.season)}
                    placeholder="Select Season"
                    searchPlaceholder="Search Seasons"
                    includeLabel={false}
                    defaultValue={season2}
                  />
                  {/* <div className="text-center mt-4 mb-2 font-semibold">Season 2</div> */}
                  <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                    <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.high_price}</div>
                    <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_low)}</div>
                    <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_high)}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <SingleSelectDropdown
                    options={JSON.parse(seasonsData)}
                    label="Season"
                    variable="season"
                    colour="bg-turquoise"
                    onSelectionChange={(e) => setSeason3(e.season)}
                    placeholder="Select Season"
                    searchPlaceholder="Search Seasons"
                    includeLabel={false}
                    defaultValue={season3}
                  />
                  {/* <div className="text-center mt-4 mb-2 font-semibold">Season 3</div> */}
                  <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                    <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.high_price}</div>
                    <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_low)}</div>
                    <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_high)}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                    <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <TVChartContainer {...defaultWidgetProps} />
            </div> */}
            <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <div className="text-center">
                30 Seconds Snapshot
              </div>
              <div className="grid grid-cols-2 justify-around items-start gap-x-8 gap-y-4 mt-4">
                {/* {JSON.parse(snapshotsData).map((snapshot) => (
                  <div>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                ))} */}
                {JSON.parse(snapshotsData).filter((object: any, index: number) => index < 10).map((snapshot) => (
                  <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setSnapshotPopup(snapshot)}>
                    {snapshot.title_of_snapshot_strategy}
                  </div>
                ))}
                {snapshotPopup != null && (
                  <div className='absolute modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <img className="w-3/4" src={snapshotPopup.image_of_snapshot_strategy} />
                        <div className="my-4 font-semibold text-lg">
                          {snapshotPopup.title_of_snapshot_strategy}
                        </div>
                        <div className="">
                          {snapshotPopup.text_of_snapshot_strategy}
                        </div>
                      </div>
                      <div onClick={() => setSnapshotPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8  ">
              <div className="col-span-2 grid grid-cols-2 mb-4">
                <div className="col-start-2 flex justify-center">
                  <div className="w-[200px]">
                    <SingleSelectDropdown
                      options={[{ country: "Brazil" }, { country: "USA" }, { country: "WAF" }, { country: "Australia" }]}
                      label="Country"
                      variable="country"
                      colour="bg-deep_blue"
                      onSelectionChange={(e) => setBasisCountry(e.country)}
                      placeholder="Select Country"
                      searchPlaceholder="Search Countries"
                      includeLabel={false}
                      defaultValue="Brazil"
                    />
                  </div>
                </div>
              </div>
              <div className="relative flex flex-col items-center">
                <div className='absolute top-2 right-2 remove-me group' >

                  <img className=' w-[15px] h-[15px] self-center opacity-100 group-hover:hidden' width="15" height="15" src={"/i_G_SQ.png"}></img>
                  <img className=' w-[15px] h-[15px] self-center opacity-100 hidden group-hover:block' width="15" height="15" src={"/i.png"}></img>
                  <div className="z-50 pointer-events-none absolute flex flex-col justify-end left-1/2 w-[300px] h-[600px] -translate-x-full -translate-y-[615px] invisible group-hover:visible origin-bottom-right scale-0 group-hover:scale-100 transition-all duration-300 ">
                    <div className="shadow-center-2xl flex flex-col items-center px-4 pt-2 pb-4 rounded-2xl bg-deep_blue text-white text-center text-xs">
                      <img className="opacity-70" width="30px" src="/i_White.png" />
                      <div className="mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                      </div>
                    </div>
                  </div>
                </div>
                <div>Current Basis Cost</div>
                <GroupedBarChart data={basisBarChartData(JSON.parse(basisData))} />
              </div>
              <div className="flex flex-col items-center">
                <div className="-mb-2">Historical Basis Cost</div>
                <LineGraph data={transformData(JSON.parse(basisData).filter((basis) => basis.country == basisCountry))} />
              </div>
              <div className="col-span-2 grid place-content-center mt-4 mb-2">
                <div className="bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenBasisCostForm(true)}>
                  Add Basis Cost Estimate
                </div>
                {openBasisCostForm && (
                  <div className='absolute modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 font-semibold text-lg">
                          Add Basis Cost Estimate
                        </div>
                        <div className="w-full">
                          <SingleSelectDropdown
                            options={[{ country: "Brazil" }, { country: "USA" }, { country: "WAF" }, { country: "Australia" }]}
                            label="Country"
                            variable="country"
                            colour="bg-deep_blue"
                            onSelectionChange={(e) => setSelectedCountry(e.country)}
                            placeholder="Select Country"
                            searchPlaceholder="Search Countries"
                            includeLabel={false}
                          />
                          <form className="mt-4 mb-4 pl-4 grid grid-cols-2 gap-x-4 w-full" onSubmit={handleBasisFormSubmit}>
                            <div className="mb-4">
                              <label
                                htmlFor="ctz23"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                CTZ23 Basis Estimate
                              </label>
                              <input
                                type="number"
                                id="ctz23"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                htmlFor="ctz24"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                CTZ24 Basis Estimate
                              </label>
                              <input
                                type="number"
                                id="ctz24"
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>

                            <div className="col-span-2 flex justify-center">
                              {/* <button
                                type="submit"
                                className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                              >
                                Submit
                              </button> */}
                              <FormSubmit errorMessage={error_Message} warningMessage={warning_Message} submitted={submitted} submitting={submitting} warningSubmit={warningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => setOpenBasisCostForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-8">
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <img src="/example-bar-chart.png" />
              </div>
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  In Country News
                </div>
                <div className="flex flex-col justify-around items-start gap-4 mt-4">
                  {JSON.parse(countryNewsData).filter((object: any, index: number) => index < 6).map((news) => (
                    <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setCountryNewsPopup(news)}>
                      {news.title_of_in_country_news}
                    </div>
                  ))}
                  {countryNewsPopup != null && (
                    <div className='absolute modal left-0 top-0 z-40'>
                      <div className=' fixed grid place-content-center inset-0 z-40'>
                        <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                          <img className="w-3/4" src={countryNewsPopup.image_of_in_country_news} />
                          <div className="my-4 font-semibold text-lg">
                            {countryNewsPopup.title_of_in_country_news}
                          </div>
                          <div className="">
                            {countryNewsPopup.text_of_in_country_news}
                          </div>
                        </div>
                        <div onClick={() => setCountryNewsPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
            <div className="text-xl text-center">Learn More with Macrovesta</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-24 text-lg">
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center">Button 1</div>
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center">Button 2</div>
            </div>
          </div>
        </div>
      </main >
    </>
  );
};
//some random shit
export const getServerSideProps = async (context: any) => {
  const today = new Date(); // Current date
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const basis = await prisma?.basis_comparison.findMany({
    // where: {
    //   date_of_basis_report: {
    //     gte: oneWeekAgo.toISOString(), // Filtering records greater than or equal to one week ago
    //     lte: today.toISOString() // Filtering records less than or equal to the current date
    //   }
    // }
  })

  const formattedBasis = basis.map((basis) => {
    const { country, date_of_basis_report, contract_december_2023: CTZ23, contract_december_2024: CTZ24 } = basis;
    console.log(date_of_basis_report)
    return { country, date_of_basis_report, CTZ23, CTZ24 }
  })

  const basisData = JSON.stringify(formattedBasis)

  const season = await prisma?.comparison_charts_with_17_months_year.findMany({
    orderBy: {
      date_of_low: 'desc'
    }
  })
  const seasonsData = JSON.stringify(season);

  const countryNews = await prisma?.in_country_news.findMany({

  })
  const countryNewsData = JSON.stringify(countryNews)

  const snapshot = await prisma?.snapshot_strategy.findMany({

  })
  const snapshotsData = JSON.stringify(snapshot);

  const monthlyindex = await prisma?.monthly_index.findFirst({
    // where: {
    //   inverse_month: "N"
    // }
  });
  const monthlyIndexData = JSON.stringify(monthlyindex);
  console.log(monthlyIndexData)
  return {
    props: { monthlyIndexData, snapshotsData, countryNewsData, seasonsData, basisData },
  };
};

export default Home;
