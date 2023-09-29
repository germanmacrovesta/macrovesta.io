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
import DragDrop from '../components/dragDrop'

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

const Home: NextPage = ({ templateData }) => {
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

  const [openSuggestionForm, setOpenSuggestionForm] = React.useState(false)

  const [selectedSuggestionType, setSelectedSuggestionType] = React.useState("")

  const [suggestionError_Message, setSuggestionError_Message] = React.useState("");
  const [suggestionSubmitted, setSuggestionSubmitted] = React.useState(false);
  const [suggestionSubmitting, setSuggestionSubmitting] = React.useState(false);
  const [suggestionWarning_Message, setSuggestionWarning_Message] = React.useState("");
  const [suggestionWarningSubmit, setSuggestionWarningSubmit] = React.useState(false);

  const handleSuggestionFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    setSuggestionSubmitting(true);

    let suggestion_type = "";
    // let title = e.target["title"].value;
    let text = e.target["text"].value;
    // let image = e.target["image"].value;
    let errorMessage = "";
    let warningMessage = "";

    // console.log("textarea", text == "")

    if (selectedSuggestionType != null && selectedSuggestionType != "" && selectedSuggestionType != "Select Suggestion Type") {
      suggestion_type = selectedSuggestionType
    } else {
      errorMessage += "Please select a suggestion type. ";
    }
    // if (title == null || title == "") {
    //   errorMessage += "Please enter a title. ";
    // }
    if (text == null || text == "") {
      errorMessage += "Please enter a text. ";
    }
    // if (image == null || image == "") {
    //   warningMessage += "You can add an image as well. If you don't want to just click confirm. ";
    // }

    // if (warningMessage !== "") {
    //   setSuggestionWarning_Message(warningMessage);
    //   // throw new Error(errorMessage)
    // } else {
    //   if (suggestionWarning_Message != "") {
    //     setSuggestionWarning_Message("")
    //   }
    // }

    if (errorMessage != "") {
      setSuggestionError_Message(errorMessage);
      setSuggestionWarningSubmit(false);
      setSuggestionSubmitting(false);
    } else {

      if (suggestionError_Message != "") {
        setSuggestionError_Message("")
      }

      if (suggestionWarningSubmit == false && warningMessage != "") {
        setSuggestionWarningSubmit(true);
        setSuggestionSubmitting(false);
      } else {
        // Get data from the form.
        const data = {
          text,
          user: session?.user?.name,
          suggestion_type
        };

        console.log(data);

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = "/api/add-suggestion";

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
        const result = await response.json().then(() => { setSuggestionSubmitted(true); setSuggestionSubmitting(false) });
        // setSnapshotSubmitted(true); setSnapshotSubmitting(false)
      }
    }

  };

  const [marketplacePopup, setMarketplacePopup] = React.useState(null)

  const TemplateModule = ({ module }) => {

    switch (module.title) {

      case "Waste Lifecycle":
        return (
          <>
            <div className={`col-span-${module.width} h-[150px] text-center`}>{module.title}</div>
          </>
        )

        break;

      case "General Streams Info":
        return (
          <>
            <div className={`col-span-${module.width} h-[90mm] grid grid-cols-2`}>
              <div className='relative flex flex-col place-content-center w-full h-full'>
                <img className="self-center w-[20mm] animate-grow duration-300" src="/Products_Iso.png" />
                <div className="flex justify-center gap-4">
                  <div className='flex flex-col  place-content-center'>
                    {/* <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_products)} duration={750} /> */}
                    {/* <span className="text-1xl self-end font-semibold">&nbsp;{t("products")}</span> */}
                  </div>
                </div>
              </div>
              <div className='relative flex flex-col place-content-center w-full h-full'>
                <img className="self-center w-[20mm] animate-grow duration-300" src="/Streams_Iso.png" />
                <div className="flex justify-center gap-4">
                  <div className='flex flex-col place-content-center'>
                    {/* <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_streams)} duration={750} /> */}
                    {/* <span className="text-1xl self-end font-semibold">&nbsp;{t("streams")}</span> */}
                  </div>
                </div>
              </div>
              <div className='relative flex flex-col place-content-center w-full h-full'>
                <img className="self-center w-[20mm] animate-grow duration-300" src="/Products_Iso.png" />
                <div className="flex justify-center gap-4">
                  <div className='flex flex-col  place-content-center'>
                    {/* <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_products)} duration={750} /> */}
                    {/* <span className="text-1xl self-end font-semibold">&nbsp;{t("products")}</span> */}
                  </div>
                </div>
              </div>
              <div className='relative flex flex-col place-content-center w-full h-full'>
                <img className="self-center w-[20mm] animate-grow duration-300" src="/Streams_Iso.png" />
                <div className="flex justify-center gap-4">
                  <div className='flex flex-col place-content-center'>
                    {/* <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_streams)} duration={750} /> */}
                    {/* <span className="text-1xl self-end font-semibold">&nbsp;{t("streams")}</span> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )

        break;

      case "Stream Text":
        return (
          <>
            <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
              <div className="text-3xl text-left w-full font-semibold">Streams</div>
              {/* <div className="text-left">{`All products are grouped into streams which indicate how they will enter the circular economy. Waste streams are collected by waste managers, and go through sorting and reprocessing to discover the final recycling statistics. ${router.query?.venue} has a total of ${JSON.parse(props.streamsData).length} Streams, and has had ${JSON.parse(props.collectionsData).length} collections over the reporting period.`}</div> */}
            </div>
          </>
        )

      case "Collection Text":
        return (
          <>
            <div className={`col-span-4 flex flex-col items-center justify-start h-[55mm] gap-y-4`}>
              <div className="text-3xl text-left w-full font-semibold">Collections</div>
              {/* <div className="text-left">{`Waste collections provide data on the quantity of material removed from site, which is a good early indicator of product capture rates, but cannot be used for this until sorting has occured. ${router.query?.venue} has had ${JSON.parse(props.collectionsData).length} waste collections over the reporting period and has had collections for ${JSON.parse(props.streamsData).reduce((acc, obj) => { if (obj?.number_of_waste_collections > 0) { acc++ } return acc; }, 0)} of ${JSON.parse(props.streamsData).length} streams. Collection distances are calculated and carbon associated from this journey is calculated in line with the GHG protocol.`}</div> */}
            </div>
          </>
        )
      case "Sorting Text":
        return (
          <>
            <div className={`col-span-4 flex flex-col items-center justify-start h-[45mm] gap-y-4`}>
              <div className="text-3xl text-left w-full font-semibold">Sorting</div>
              {/* <div className="text-left">{`Waste sorting occurs after waste collections have been made. ${router.query?.venue}'s waste streams are being sorting by percentage single, meaning sampling of their waste streams is being used to determine the contamination rate, which is applied to their waste collection.`}</div> */}
            </div>
          </>
        )
      case "Product Text":
        return (
          <>
            <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
              <div className="text-3xl text-left w-full font-semibold">Products</div>
              {/* <div className="text-left">{`The Rubbish Portal gathers product data including the material and weight to aid in the tracking process. ${router.query?.venue} has a total of ${JSON.parse(props.productsData)?.length} products, and has had a total of ${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_delivered != null) { acc += parseInt(obj?.number_of_products_delivered) } return acc; }, 0))} products delivered during this reporting period. Product carbon impact is calculated using the embodied carbon of the material and the quantity consumed.`}</div> */}
            </div>
          </>
        )
      case "Delivery Text":
        // const timePeriod = JSON.parse(JSON.parse(props.templateData))?.timePeriod
        // let deliveries = JSON.parse(props.deliveriesData)
        // if (timePeriod?.start != undefined && timePeriod?.end != undefined) {
        //   deliveries = JSON.parse(props.deliveriesData)?.filter((delivery) => delivery?.date < timePeriod?.end && delivery?.date > timePeriod?.start)
        // }

        return (
          <>
            <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
              <div className="text-3xl text-left w-full font-semibold">Deliveries</div>
              {/* <div className="text-left">{`For any product being tracked, every delivery made to the venue should be logged. ${router.query?.venue} has logged ${deliveries?.length} deliveries during this reporting period, totalling ${nFormat.format(deliveries?.reduce((acc, obj) => { if (obj?.number_of_products_delivered != null) { acc += parseInt(obj?.number_of_products_delivered) } return acc; }, 0))} products delivered. Delivery distances are calculated and carbon associated from this journey is calculated in line with the GHG protocol.`}</div> */}
            </div>
          </>
        )

      case "Stock Check Text":
        return (
          <>
            <div className={`col-span-4 flex flex-col items-center justify-start h-[45mm] gap-y-4`}>
              <div className="text-3xl text-left w-full font-semibold">Stock Checks</div>
              {/* <div className="text-left">{`Stock checks are vital for calculating the actual consumption figures for products. Within this reporting period, ${router.query?.venue} has completed ${JSON.parse(props.stocksData)?.length} stock checks, allowing The Portal to calculate a consumption figure of ${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_used != null) { acc += parseInt(obj?.number_of_products_used) } return acc; }, 0))} products.`}</div> */}
            </div>
          </>
        )

      case "Weight Collected":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Waste_Iso.png" />
                  <div>
                    Weight Collected
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.collectionsData)?.reduce((acc, obj) => { if (obj?.weight_collected != null) { acc += parseInt(obj?.weight_collected) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Waste Collections":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Collection_Iso.png" />
                  <div>
                    Waste Collections
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.collectionsData)?.length)}`} */}
                  {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Total Streams":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Streams_Iso.png" />
                  <div>
                    Total Streams
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.streamsData)?.length)}`} */}
                  {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Percentage Sorted":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Sorting_Iso.png" />
                  <div>
                    Percentage Sorted
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.collectionsData)?.reduce((acc, obj) => { if (obj?.weight_sorted != null) { acc += parseInt(obj?.weight_sorted) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Contamination":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Contamination_Iso.png" />
                  <div>
                    Contamination
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.venueData)[0]?.contamination_rate * 100)}`}&nbsp;<span className="text-base font-semibold">%</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Collection Carbon":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Emissions_Iso.png" />
                  <div className="font-bold text-xl">
                    {/* {`${nFormat.format(JSON.parse(props.collectionsData)?.reduce((acc, obj) => { if (obj?.transport_carbon_emissions != null) { acc += parseInt(obj?.transport_carbon_emissions) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                  </div>
                </div>
                <div>
                  Collection Carbon
                </div>
              </div>
            </div>
          </>
        )

      case "Closed Loop Carbon Saving":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Emissions_Saving_Iso.png" />
                  <div className="font-bold text-xl">
                    {/* {`${nFormat.format(JSON.parse(props.streamsData)?.reduce((acc, obj) => { if (obj?.carbon_savings != null) { acc += parseInt(obj?.carbon_savings) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                  </div>
                </div>
                <div>
                  Closed Loop Carbon Saving
                </div>
              </div>
            </div>
          </>
        )

      case "Products Used":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Used_Iso.png" />
                  <div>
                    Products Used
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_used != null) { acc += parseInt(obj?.number_of_products_used) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Products Delivered":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Used_Iso.png" />
                  <div>
                    Products Delivered
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_delivered != null) { acc += parseInt(obj?.number_of_products_delivered) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Total Products":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Products_Iso.png" />
                  <div>
                    Total Products
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.productsData)?.length)}`} */}
                  {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Deliveries":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Deliveries_Iso.png" />
                  <div>
                    Deliveries
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.deliveriesData)?.length)}`} */}
                  {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Product Carbon":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Product_Emissions_Iso.png" />
                  <div>
                    Product Carbon
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.product_carbon_impact != null) { acc += parseInt(obj?.product_carbon_impact) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Delivery Carbon":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Emissions_Iso.png" />
                  <div>
                    Delivery Carbon
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.deliveriesData)?.reduce((acc, obj) => { if (obj?.transport_carbon_emissions != null) { acc += parseInt(obj?.transport_carbon_emissions) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      case "Current Stock":
        return (
          <>
            <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
              <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                <div className="flex flex-col items-center">
                  <img className="w-[30mm]" src="/Deliveries_Iso.png" />
                  <div>
                    Current Stock
                  </div>
                </div>
                <div className="font-bold text-xl">
                  {/* {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.stock_remaining != null) { acc += parseInt(obj?.stock_remaining) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span> */}
                </div>
              </div>
            </div>
          </>
        )

      default:
        return (
          <></>
        )
        break;
    }
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
          <header className="z-50 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={"Preferences"} urlPath={urlPath} user={session?.user.name} />
            {/* <TabMenu data={TabMenuArray} urlPath={urlPath} /> */}
          </header>
          {/* <WeglotLanguageSwitcher
            domain="macrovesta.ai"
            langs={{ www: 'en', es: 'es', tr: 'tr', th: 'th', 'pt-br': 'pt-br' }} /> */}
          <div className=" bg-slate-200">
            {/* <DragDrop templatesData={templatesData} /> */}
            {JSON.parse(JSON.parse(templateData))?.templateArray?.map((templateModule, moduleIndex) => (
              <TemplateModule module={templateModule} />
            ))}
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
        destination: `/`,
      }
    }
  }

  const template = await prisma?.dashboard_Templates.findFirst({})

  const templateData = JSON.stringify(template?.data)


  // console.log(monthlyIndexData)
  return {
    props: { templateData },
  };
};

export default Home;
