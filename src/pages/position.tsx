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
import LineGraphNotTime from '../components/lineGraphNotTime';
import FormSubmit from '../components/formSubmit';
import ReactMarkdown from 'react-markdown';
import { render } from "react-dom";
import BullishBearishDonut from '../components/bullishBearishDonut';
import { useSession, getSession } from "next-auth/react";
import Comments from '../components/comments';
import IndexDial from '../components/indexDial';
import SemiCircleDial from '../components/semiCircleDial';
import MultipleSelectDropdown from '../components/multipleSelectDropdown';
import DateField from '../components/dateField';
import { useDateFormatter, useLocale } from 'react-aria';
import { parseDate } from '@internationalized/date';
import { WeglotLanguageSwitcher } from "~/components/weglotLanguageSwitcher";
import useWeglotLang from '../components/useWeglotLang';
import InfoButton from '../components/infoButton';

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

function getCurrentMonth() {
  // Create a new Date object
  let date = new Date();

  // Create an array of month names
  let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // Get the month number from the Date object and use it to get the month name
  let monthName = monthNames[date.getMonth()];

  return monthName;
}

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

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

const renderers = {
  h1: ({ node, ...props }) => <h1 {...props} />,
  h2: ({ node, ...props }) => <h2 {...props} />,
  h3: ({ node, ...props }) => <h3 {...props} />,
  h4: ({ node, ...props }) => <h4 {...props} />,
  h5: ({ node, ...props }) => <h5 {...props} />,
  h6: ({ node, ...props }) => <h6 {...props} />
}

const Home: NextPage = ({ companyData, productionData, costData, commercialisationData, strategyLogData }) => {
  const router = useRouter();
  const url = router.pathname;

  const currentLang = useWeglotLang();

  const { data: session } = useSession();
  console.log("session", session)
  console.log("session.submittedSurvey", session?.submittedSurvey)

  const todaysDate = new Date()

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



  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.weglot.com/weglot.min.js';
    script.async = true;

    script.onload = () => {
      Weglot.initialize({
        api_key: 'wg_60b49229f516dee77edb3109e6a46c379',
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [strategyPopup, setStrategyPopup] = React.useState(null)

  const [openProductionForm, setOpenProductionForm] = React.useState(false)

  const [productionError_Message, setProductionError_Message] = React.useState("");
  const [productionSubmitted, setProductionSubmitted] = React.useState(false);
  const [productionSubmitting, setProductionSubmitting] = React.useState(false);
  const [productionWarning_Message, setProductionWarning_Message] = React.useState("");
  const [productionWarningSubmit, setProductionWarningSubmit] = React.useState(false);

  const [openCostForm, setOpenCostForm] = React.useState(false)

  const [costError_Message, setCostError_Message] = React.useState("");
  const [costSubmitted, setCostSubmitted] = React.useState(false);
  const [costSubmitting, setCostSubmitting] = React.useState(false);
  const [costWarning_Message, setCostWarning_Message] = React.useState("");
  const [costWarningSubmit, setCostWarningSubmit] = React.useState(false);

  const [openCommercialisationForm, setOpenCommercialisationForm] = React.useState(false)

  const [commercialisationError_Message, setCommercialisationError_Message] = React.useState("");
  const [commercialisationSubmitted, setCommercialisationSubmitted] = React.useState(false);
  const [commercialisationSubmitting, setCommercialisationSubmitting] = React.useState(false);
  const [commercialisationWarning_Message, setCommercialisationWarning_Message] = React.useState("");
  const [commercialisationWarningSubmit, setCommercialisationWarningSubmit] = React.useState(false);

  const handleProductionFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    setProductionSubmitting(true);

    let production1 = e.target["production1"].value;
    let yield1 = e.target["yield1"].value;
    let production2 = e.target["production2"].value;
    let yield2 = e.target["yield2"].value;
    let production3 = e.target["production3"].value;
    let yield3 = e.target["yield3"].value;
    let errorMessage = "";
    let warningMessage = "";

    if (production1 == null || production1 == "") {
      errorMessage += "Please enter an estimate. ";
    }

    if (warningMessage !== "") {
      setProductionWarning_Message(warningMessage);
      // throw new Error(errorMessage)
    } else {
      if (productionWarning_Message != "") {
        setProductionWarning_Message("")
      }
    }

    if (errorMessage != "") {
      setProductionError_Message(errorMessage);
      setProductionWarningSubmit(false);
      setProductionSubmitting(false);
    } else {

      if (productionError_Message != "") {
        setProductionError_Message("")
      }

      if (productionWarningSubmit == false && warningMessage != "") {
        setProductionWarningSubmit(true);
        setProductionSubmitting(false);
      } else {
        // Get data from the form.
        const data = {
          production1,
          production2,
          production3,
          yield1,
          yield2,
          yield3,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        };

        console.log(data);

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = "/api/add-producer-production-position";

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
        const result = await response.json().then(() => { setProductionSubmitted(true); setProductionSubmitting(false) });
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }

  };

  const handleCostFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    setCostSubmitting(true);

    let dollars_per_hectare1 = e.target["dollars_per_hectare1"].value;
    let cents_per_pound1 = e.target["cents_per_pound1"].value;
    let dollars_per_hectare2 = e.target["dollars_per_hectare2"].value;
    let cents_per_pound2 = e.target["cents_per_pound2"].value;
    let dollars_per_hectare3 = e.target["dollars_per_hectare3"].value;
    let cents_per_pound3 = e.target["cents_per_pound3"].value;
    let errorMessage = "";
    let warningMessage = "";

    // if (comment == null || comment == "") {
    //   errorMessage += "Please enter a comment. ";
    // }

    if (warningMessage !== "") {
      setCostWarning_Message(warningMessage);
      // throw new Error(errorMessage)
    } else {
      if (costWarning_Message != "") {
        setCostWarning_Message("")
      }
    }

    if (errorMessage != "") {
      setCostError_Message(errorMessage);
      setCostWarningSubmit(false);
      setCostSubmitting(false);
    } else {

      if (costError_Message != "") {
        setCostError_Message("")
      }

      if (costWarningSubmit == false && warningMessage != "") {
        setCostWarningSubmit(true);
        setCostSubmitting(false);
      } else {
        // Get data from the form.
        const data = {
          dollars_per_hectare1,
          dollars_per_hectare2,
          dollars_per_hectare3,
          cents_per_pound1,
          cents_per_pound2,
          cents_per_pound3,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        };

        console.log(data);

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = "/api/add-producer-cost-position";

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
        const result = await response.json().then(() => { setCostSubmitted(true); setCostSubmitting(false) });
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }

  };

  const handleCommercialisationFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    setCommercialisationSubmitting(true);

    let percentage1 = e.target["percentage1"].value;
    let percentage2 = e.target["percentage2"].value;
    let percentage3 = e.target["percentage3"].value;
    let errorMessage = "";
    let warningMessage = "";


    if (warningMessage !== "") {
      setCommercialisationWarning_Message(warningMessage);
      // throw new Error(errorMessage)
    } else {
      if (commercialisationWarning_Message != "") {
        setCommercialisationWarning_Message("")
      }
    }

    if (errorMessage != "") {
      setCommercialisationError_Message(errorMessage);
      setCommercialisationWarningSubmit(false);
      setCommercialisationSubmitting(false);
    } else {

      if (commercialisationError_Message != "") {
        setCommercialisationError_Message("")
      }

      if (commercialisationWarningSubmit == false && warningMessage != "") {
        setCommercialisationWarningSubmit(true);
        setCommercialisationSubmitting(false);
      } else {
        // Get data from the form.
        const data = {
          percentage1,
          percentage2,
          percentage3,
          company_id: JSON.parse(companyData)?.record_id,
          user: session?.user?.name
        };

        console.log(data);

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = "/api/add-producer-commercialisation-position";

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
        const result = await response.json().then(() => { setCommercialisationSubmitted(true); setCommercialisationSubmitting(false) });
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }

  };

  const getEstimatesData = (data, propertyArray, datasetNameArray) => {
    let datasetArray = [];
    data.forEach((item) => {
      propertyArray.forEach((property, index) => {
        if (datasetArray.find((dataset) => dataset.name == datasetNameArray[index]) != undefined) {
          let dataset = datasetArray.find((dataset) => dataset.name == datasetNameArray[index])
          dataset.data.push({ x: item.date_created, y: parseInt(item[property]) })
        } else {
          let dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ x: item.date_created, y: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      })
    })
    return datasetArray
  }

  return (
    <>
      <Head>
        <title>Macrovesta</title>
        <meta name="description" content="Generated by Macrovesta" />
        <link rel="icon" href="/favicon.ico" />
        <script src="/static/datafeeds/udf/dist/bundle.js" async />
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
      <main className="main grid grid-cols-[160px_auto] h-screen items-center bg-slate-200">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-40 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={"Position"} urlPath={urlPath} user={session?.user.name} />
            {/* <TabMenu data={TabMenuArray} urlPath={urlPath} /> */}
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className="p-6 bg-slate-200">
            <div className="rounded-lg px-4 py-2 bg-deep_blue text-white flex justify-between -mt-6">
              <div className="flex flex-col">
                <div>Client Name: {JSON.parse(companyData)?.name}</div>
                <div>Client Manager Name: {JSON.parse(companyData)?.company_manager?.name}</div>
                <div>Macrovesta Manager Name: {JSON.parse(companyData)?.macrovesta_manager?.name}</div>
              </div>
            </div>
            {/* {JSON.parse(productionData).length}
            {JSON.parse(costData).length}
            {JSON.parse(commercialisationData).length} */}
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Production 22/23</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(productionData).filter((estimate) => estimate.season == "22/23"), ["production_estimate"], ["Production Estimate"])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Production" />
                  </div>
                </div>
                <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Yield 22/23</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(productionData).filter((estimate) => estimate.season == "22/23"), ["yield_estimate"], ["Yield Estimate"])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Production" />
                  </div>
                </div>
              </div>
              <div className="grid place-content-center">
                <div className="bg-deep_blue text-white rounded-lg px-4 py-1 -mt-8 mb-4 cursor-pointer" onClick={() => setOpenProductionForm(true)}>Update your Production</div>
                {openProductionForm && (
                  <div className='absolute text-black modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 text-black font-semibold text-lg">
                          Update your production
                        </div>
                        <div className="w-full">
                          <form className="mt-4 mb-4 pl-4 grid grid-cols-2 gap-x-4 w-full" onSubmit={handleProductionFormSubmit}>
                            <div className="col-span-2 text-center py-2 font-semibold">22/23 Season</div>
                            <div>
                              <label
                                htmlFor="production1"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Production
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="production1"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="yield1"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Yield
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="yield1"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="col-span-2 text-center py-2 font-semibold">23/24 Season</div>
                            <div>
                              <label
                                htmlFor="production2"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Production
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="production2"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="yield2"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Yield
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="yield2"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="col-span-2 text-center py-2 font-semibold">24/25 Season</div>
                            <div>
                              <label
                                htmlFor="production3"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Production
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="production3"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="yield3"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Yield
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="yield3"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="col-span-2 flex justify-center pt-4">
                              {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                              <FormSubmit errorMessage={productionError_Message} warningMessage={productionWarning_Message} submitted={productionSubmitted} submitting={productionSubmitting} warningSubmit={productionWarningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => setOpenProductionForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Dollars per Hectare 22/23</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(costData).filter((estimate) => estimate.season == "22/23"), ["cost_estimate_dollar_per_hectare"], [""])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Cost" />
                  </div>
                </div>
                <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Cents per Pound 22/23</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(costData).filter((estimate) => estimate.season == "22/23"), ["cost_estimate_cent_per_pound"], [""])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Cost" />
                  </div>
                </div>
              </div>
              <div className="grid place-content-center">
                <div className="bg-deep_blue text-white rounded-lg px-4 py-1 -mt-8 mb-4 cursor-pointer" onClick={() => setOpenCostForm(true)}>Update your Cost of Production</div>
                {openCostForm && (
                  <div className='absolute text-black modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 text-black font-semibold text-lg">
                          Update your cost of production
                        </div>
                        <div className="w-full">
                          <form className="mt-4 mb-4 pl-4 grid grid-cols-2 gap-x-4 w-full" onSubmit={handleCostFormSubmit}>
                            <div className="col-span-2 text-center py-2 font-semibold">22/23 Season</div>
                            <div>
                              <label
                                htmlFor="dollars_per_hectare1"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Dollars per Hectare
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="dollars_per_hectare1"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cents_per_pound1"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Cents per Pound
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="cents_per_pound1"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="col-span-2 text-center py-2 font-semibold">23/24 Season</div>
                            <div>
                              <label
                                htmlFor="dollars_per_hectare2"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Dollars per Hectare
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="dollars_per_hectare2"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cents_per_pound2"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Cents per Pound
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="cents_per_pound2"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="col-span-2 text-center py-2 font-semibold">24/25 Season</div>
                            <div>
                              <label
                                htmlFor="dollars_per_hectare3"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Dollars per Hectare
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="dollars_per_hectare3"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="cents_per_pound3"
                                className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                              >
                                Cents per Pound
                              </label>
                              <input
                                type="number"
                                step=".01"
                                id="cents_per_pound3"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your estimate"
                              />
                            </div>
                            <div className="col-span-2 flex justify-center pt-4">
                              {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                              <FormSubmit errorMessage={costError_Message} warningMessage={costWarning_Message} submitted={costSubmitted} submitting={costSubmitting} warningSubmit={costWarningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => setOpenCostForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1">
                <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Commercialisation 22/23</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(commercialisationData).filter((estimate) => estimate.season == "22/23"), ["percentage_sold"], ["Percentage"])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Percentage Sold" />
                  </div>
                </div>
                {/* <div>
                  <div className="mt-6 -mb-2 font-semibold text-center">Cents per Pound 22/23</div>
                  <div className="mb-16 w-full">

                    <LineGraph data={getEstimatesData(JSON.parse(costData).filter((estimate) => estimate.season == "22/23"), ["cost_estimate_cent_per_pound"], [""])} xValue="x" yValue="y" xAxisTitle="Time" yAxisTitle="Cost" />
                  </div>
                </div> */}
              </div>
              <div className="grid place-content-center">
                <div className="bg-deep_blue text-white rounded-lg px-4 py-1 -mt-8 mb-4 cursor-pointer" onClick={() => setOpenCommercialisationForm(true)}>Update your Commercialisation</div>
                {openCommercialisationForm && (
                  <div className='absolute text-black modal left-0 top-0 z-40'>
                    <div className=' fixed grid place-content-center inset-0 z-40'>
                      <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                        <div className="my-4 text-black font-semibold text-lg">
                          Update your commercialisation
                        </div>
                        <div className="w-full">
                          <form className="mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full" onSubmit={handleCommercialisationFormSubmit}>
                            <div className=" text-center py-2 font-semibold">22/23 Season</div>

                            <label
                              htmlFor="percentage1"
                              className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                            >
                              Percentage Sold
                            </label>
                            <input
                              type="number"
                              step=".01"
                              id="percentage1"
                              required
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                              placeholder="Enter your estimate"
                            />

                            <div className="col-span-2 text-center py-2 font-semibold">23/24 Season</div>

                            <label
                              htmlFor="percentage2"
                              className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                            >
                              Percentage Sold
                            </label>
                            <input
                              type="number"
                              step=".01"
                              id="percentage2"
                              required
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                              placeholder="Enter your estimate"
                            />

                            <div className="col-span-2 text-center py-2 font-semibold">24/25 Season</div>

                            <label
                              htmlFor="percentage3"
                              className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                            >
                              Percentage Sold
                            </label>
                            <input
                              type="number"
                              step=".01"
                              id="percentage3"
                              required
                              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                              placeholder="Enter your estimate"
                            />

                            <div className="col-span-2 flex justify-center pt-4">
                              {/* <button
                        type="submit"
                        className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                      >
                        Submit
                      </button> */}
                              <FormSubmit errorMessage={commercialisationError_Message} warningMessage={commercialisationWarning_Message} submitted={commercialisationSubmitted} submitting={commercialisationSubmitting} warningSubmit={commercialisationWarningSubmit} />
                            </div>
                          </form>
                        </div>
                      </div>
                      <div onClick={() => setOpenCommercialisationForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              <div className="text-lg font-semibold text-center">
                Strategy Log
              </div>
              {JSON.parse(strategyLogData).map((strategy) => (
                <div className="border flex justify-between hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setStrategyPopup(strategy)}>
                  <div>
                    {strategy?.title}
                  </div>
                  <div>
                    {parseDateString(strategy?.date_created)}
                  </div>
                </div>
              ))}
              {strategyPopup != null && (
                <div className='absolute modal left-0 top-0 z-40'>
                  <div className=' fixed grid place-content-center inset-0 z-40'>
                    <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                      {/* <img className="w-3/4" src={strategyPopup.image_of_in_country_news} /> */}
                      <div className="my-4 font-semibold text-lg">
                        {strategyPopup.title}
                      </div>
                      <div className="-mt-4 mb-2">
                        {parseDateString(strategyPopup.date_created)}
                      </div>
                      <div className="">
                        {/* <ReactMarkdown children={strategyPopup.text_of_in_country_news} /> */}
                        {/* <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown> */}
                        {/* {(strategyPopup.text_of_in_country_news).replace('[newline]', '\n\n')} */}
                        {strategyPopup.text.split('[newline]').map((paragraph, index) => (
                          <>
                            <p>{paragraph}</p>
                            {index != strategyPopup.text.split('[newline]').length - 1 && (
                              <>
                                <br />
                              </>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                    <div onClick={() => setStrategyPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main >
    </>
  );
};
//some random shit added by Vic
export const getServerSideProps = async (context: any) => {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin`,
      }
    }
  }

  let company_id = session?.company_id

  if (session.company_id == "cllxqmywr0000zbdg10nqp2up") {
    company_id = session?.selected_company_id
  }

  const company = await prisma?.company.findFirst({
    where: {
      record_id: company_id
    },
    include: {
      macrovesta_manager: true,
      company_manager: true
    }
  })

  const companyData = JSON.stringify(company)

  const production = await prisma?.producer_production_estimates.findMany({
    where: {
      company_id: company_id
    }
  })

  const productionData = JSON.stringify(production)

  const cost = await prisma?.producer_cost_estimates.findMany({
    where: {
      company_id: company_id
    }
  })

  const costData = JSON.stringify(cost)

  const commercialisation = await prisma?.producer_commercialisation_estimates.findMany({
    where: {
      company_id: company_id
    }
  })

  const commercialisationData = JSON.stringify(commercialisation)

  const strategylog = await prisma?.strategy_log.findMany({
    where: {
      company_id: company_id
    }
  })

  const strategyLogData = JSON.stringify(strategylog)

  const today = new Date(); // Current date
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);



  // console.log(monthlyIndexData)
  return {
    props: { companyData, productionData, costData, commercialisationData, strategyLogData },
  };
};

export default Home;
