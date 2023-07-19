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

const renderers = {
  h1: ({ node, ...props }) => <h1 {...props} />,
  h2: ({ node, ...props }) => <h2 {...props} />,
  h3: ({ node, ...props }) => <h3 {...props} />,
  h4: ({ node, ...props }) => <h4 {...props} />,
  h5: ({ node, ...props }) => <h5 {...props} />,
  h6: ({ node, ...props }) => <h6 {...props} />
}

const Home: NextPage = ({ monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, CTZ23Data, CTH24Data, CTK24Data, CTN24Data, CTZ24Data, futureContractsStudyData }) => {
  const router = useRouter();
  const url = router.pathname;

  const { data: session } = useSession();
  console.log("session", session)
  console.log("session.submittedSurvey", session?.submittedSurvey)

  const todaysDate = new Date()

  const [sentimentData, setSentimentData] = React.useState(() => {
    try {
      return JSON.parse(initialSentimentData);
    } catch {
      return [];
    }
  })

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

  const [contract1, setContract1] = React.useState('')
  const [contract2, setContract2] = React.useState('')
  const [contract3, setContract3] = React.useState('')

  const [countryNewsPopup, setCountryNewsPopup] = React.useState(null)
  const [snapshotPopup, setSnapshotPopup] = React.useState(null)

  React.useEffect(() => {
    setSeason1(JSON.parse(seasonsData)[2]?.season ?? '')
    setSeason2(JSON.parse(seasonsData)[1]?.season ?? '')
    setSeason3(JSON.parse(seasonsData)[0]?.season ?? '')
    // setContract1(JSON.parse(seasonsData)[2]?.season ?? '')
    // setContract2(JSON.parse(seasonsData)[1]?.season ?? '')
    // setContract3(JSON.parse(seasonsData)[0]?.season ?? '')
  }, [seasonsData])

  React.useEffect(() => {
    setContract1(JSON.parse(futureContractsStudyData)[2]?.year ?? '')
    setContract2(JSON.parse(futureContractsStudyData)[1]?.year ?? '')
    setContract3(JSON.parse(futureContractsStudyData)[0]?.year ?? '')
  }, [futureContractsStudyData])

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

  const [bullishBearish, setBullishBearish] = React.useState(undefined)

  const handleSentimentFormSubmit = async (e: any) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    setSentimentSubmitting(true);

    let bullish_or_bearish = "";
    let high = e.target["high"].value;
    let low = e.target["low"].value;
    let intraday_average_points = e.target["intraday"].value;
    let open_interest = e.target["open_interest"].value;
    let errorMessage = "";
    let warningMessage = "";

    if (bullishBearish != null && bullishBearish != "Select an Option") {
      bullish_or_bearish = bullishBearish;
    } else {
      errorMessage += "Please select bullish or bearish. ";
    }

    if (high == null || high == "") {
      errorMessage += "Please enter Estimate for high. ";
    }
    if (low == null || low == "") {
      errorMessage += "Please enter Estimate for low. ";
    }
    if (intraday_average_points == null || intraday_average_points == "") {
      errorMessage += "Please enter Estimate for intraday average in points. ";
    }
    if (open_interest == null || open_interest == "") {
      errorMessage += "Please enter Estimate for open interest. ";
    }



    if (warningMessage !== "") {
      setSentimentWarning_Message(warningMessage);
      // throw new Error(errorMessage)
    } else {
      if (warning_Message != "") {
        setSentimentWarning_Message("")
      }
    }

    if (errorMessage != "") {
      setSentimentError_Message(errorMessage);
      setSentimentWarningSubmit(false);
      setSentimentSubmitting(false);
    } else {

      if (error_Message != "") {
        setSentimentError_Message("")
      }

      if (warningSubmit == false && warningMessage != "") {
        setSentimentWarningSubmit(true);
        setSentimentSubmitting(false);
      } else {
        // Get data from the form.
        const data = {
          bullish_or_bearish,
          high,
          low,
          intraday_average_points,
          open_interest,
          email: session?.user.email
        };

        console.log(data);

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);

        // API endpoint where we send form data.
        const endpoint = "/api/add-sentiment-survey-results";

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
        const result = await response.json().then(() => {
          setSentimentSubmitted(true);
          setSentimentSubmitting(false);
          setCurrentStage(1);
          // setSentimentData([...sentimentData, { record_id: "dummyid", bullish_or_bearish, high, low, intraday_average_points, open_interest }])
        });
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }

  };

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

  const [sentimentError_Message, setSentimentError_Message] = React.useState("");
  const [sentimentSubmitted, setSentimentSubmitted] = React.useState(false);
  const [sentimentSubmitting, setSentimentSubmitting] = React.useState(false);
  const [sentimentWarning_Message, setSentimentWarning_Message] = React.useState("");
  const [sentimentWarningSubmit, setSentimentWarningSubmit] = React.useState(false);

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
        CTZ23: parseFloat((CTZ23 / count).toFixed(0)),
        CTZ24: parseFloat((CTZ24 / count).toFixed(0))
      };
    });

    console.log(result);
    return result
  }

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
        let average = parseFloat((averages[contractName][week].sum / averages[contractName][week].count).toFixed(0));
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

  function transformSurveyData(inputArray, propertyUsed) {
    const outputArray = [];
    const averages = {};
    // const combinedSeries = {
    //   name: "Combined",
    //   data: []
    // };

    for (const obj of inputArray) {
      const groupName = obj.bullish_or_bearish;

      if (!averages[groupName]) {
        averages[groupName] = {};
      }
      if (!averages["Average"]) {
        averages["Average"] = {};
      }

      const date = new Date(obj.date_of_survey);
      const dateString = date.toISOString().split("T")[0];

      if (!averages[groupName][dateString]) {
        averages[groupName][dateString] = {
          sum: 0,
          count: 0
        };
      }
      if (!averages["Average"][dateString]) {
        averages["Average"][dateString] = {
          sum: 0,
          count: 0
        };
      }

      averages[groupName][dateString].sum += parseFloat(obj[propertyUsed]);
      averages[groupName][dateString].count++;
      averages["Average"][dateString].sum += parseFloat(obj[propertyUsed]);
      averages["Average"][dateString].count++;

      // Add the values to the combined series
      // if (!isNaN(parseFloat(obj[propertyUsed]))) {
      //   if (!combinedSeries.data[dateString]) {
      //     combinedSeries.data[dateString] = {
      //       sum: 0,
      //       count: 0
      //     };
      //   }

      //   combinedSeries.data[dateString].sum += parseFloat(obj[propertyUsed]);
      //   combinedSeries.data[dateString].count++;
      // }
    }

    for (const groupName in averages) {
      const group = averages[groupName];
      const data = [];

      for (const dateString in group) {
        const average =
          group[dateString].sum / group[dateString].count;
        const date = new Date(dateString);

        data.push({
          time: date.toISOString(),
          value: average
        });
      }
      if (groupName == "Average") {
        outputArray.push({
          name: groupName,
          data: data,
          dottedLine: true
        });
      } else {
        outputArray.push({
          name: groupName,
          data: data
        });
      }

    }
    // Calculate the average for the combined series
    // for (const dateString in combinedSeries.data) {
    //   const average =
    //     combinedSeries.data[dateString].sum / combinedSeries.data[dateString].count;
    //   const date = new Date(dateString);

    //   combinedSeries.data[dateString] = {
    //     time: date.toISOString(),
    //     value: average
    //   };
    // }

    // outputArray.push(combinedSeries);

    return outputArray;
  }

  function calculateSpread(arr1, arr2, name) {
    // Transform arrays into maps for easy lookup
    const map1 = new Map(arr1.map(item => [item.datetime, item.close]));
    const map2 = new Map(arr2.map(item => [item.datetime, item.close]));

    // Find the later start date
    const start1 = new Date(arr1[0].datetime);
    const start2 = new Date(arr2[0].datetime);
    const start = start1 > start2 ? start1.toISOString() : start2.toISOString();

    // Merge arrays
    const merged = [];
    for (const [datetime, close1] of map1) {
      if (datetime >= start) {
        const close2 = map2.get(datetime);
        if (close2 !== undefined) {
          merged.push({
            time: datetime,
            value: close1 - close2,
          });
        }
      }
    }

    return [{ name: name, data: merged, noCircles: true }];
  }

  console.log("Basis Data", JSON.parse(basisData).filter((basis) => basis.country == "Brazil"))
  console.log("Line Data", transformData(JSON.parse(basisData).filter((basis) => basis.country == "Brazil")))

  const [basisCountry, setBasisCountry] = React.useState("Brazil");

  const [currentStage, setCurrentStage] = React.useState(0);

  const goNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const goPrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };



  const stages = [1, 2];

  const markdown = `# Ira media medius induit deum

  ## Exaudire enim ad sit
  
  Lorem markdownum colores, se gravatum flet vulnera: dum in, onusque parvumque geminata quoque. Expositum valentes nobis capax opes rapidas quas. Iudicis miserande prius ea iubet cupidine? Inde sua amo latis amantis: Hiberis sinus fervet fecit ex ullis circumfluit furor turbida, mox inque, infera? Nec lumina maneret: patrios etiamnum modum et modo generum quamvis in verbis, si, hic rerum.
  
  > Inhibente proceresque morata paelice, precor veri; umeris Tereu sic constitit in harenosae ut diva est, hoc. Cruore cremat, quam cornua verba. In forte defluit valuisse gaudens faciem: luctisono et vulnere, tuo ordine navigii. Agenore fuso sidera; sacra exit: est modo, ibi saxa aetate domitis enim.
  
  ## Protinus clara
  
  Rhoetus arcusque; in coma nosti fratrem ipse abstulerat fassurae satyri: nil dextra corripitur saetae, expositum sententia scelus. Latentia sua progenuit nam enim lyramque amori post, Ilithyiam datis per vestris ferrugine quorum, admirantibus. Novos iter ut: ego omnes, campis memini.
  
  `
  const [contractParameter, setContractParameter] = React.useState("close")

  const getSeasonData = (s1, s2, s3) => {
    let array = []
    if (s1 != null && s1 != "Select Season") {
      const s1Data = { name: s1.season, data: [{ x: s1.month_of_low, y: s1.low_price }, { x: s1.month_of_high, y: s1.high_price }] }
      array.push(s1Data)
    }
    if (s2 != null && s2 != "Select Season") {
      const s2Data = { name: s2.season, data: [{ x: s2.month_of_low, y: s2.low_price }, { x: s2.month_of_high, y: s2.high_price }] }
      array.push(s2Data)
    }
    if (s3 != null && s3 != "Select Season") {
      const s3Data = { name: s3.season, data: [{ x: s3.month_of_low, y: s3.low_price }, { x: s3.month_of_high, y: s3.high_price }] }
      array.push(s3Data)
    }
    return array
  }
  const getStudyData = (s1, s2, s3) => {
    let array = []
    if (s1 != null && s1 != "Select Contract") {
      const s1Data = { name: s1.year, data: [{ x: s1.month_of_low, y: s1.low }, { x: s1.month_of_high, y: s1.high }] }
      array.push(s1Data)
    }
    if (s2 != null && s2 != "Select Contract") {
      const s2Data = { name: s2.year, data: [{ x: s2.month_of_low, y: s2.low }, { x: s2.month_of_high, y: s2.high }] }
      array.push(s2Data)
    }
    if (s3 != null && s3 != "Select Contract") {
      const s3Data = { name: s3.year, data: [{ x: s3.month_of_low, y: s3.low }, { x: s3.month_of_high, y: s3.high }] }
      array.push(s3Data)
    }
    return array
  }

  const averageFutureContract = (data, property) => {
    const array = data.reduce((acc, obj) => {
      acc[0] += parseFloat(obj[property])
      acc[1]++;
      return acc;
    }, [0, 0])
    return array[0] / array[1]
  }

  return (
    <>
      <Head>
        <title>Macrovesta</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <script src="/static/datafeeds/udf/dist/bundle.js" async />
      </Head>
      <main className="grid grid-cols-[160px_auto] h-screen items-center">
        <Sidebar />
        <div className="w-40"></div>
        <div className="flex w-full flex-col self-start">
          <header className="z-50 w-full grid grid-cols-[auto_1fr] grid-rows-1 bg-white shadow-center-md">
            <Breadcrumbs title={"Macrovesta Demo"} urlPath={urlPath} user={session?.user.name} />
            <TabMenu data={TabMenuArray} urlPath={urlPath} />
          </header>
          <div className="p-6 bg-slate-200">
            Macrovesta is being developed to deliver AI-powered cotton market expertise from farmer to retailer. The insights delivered by your personalised dashboard will provide you with the information and context you need to make confident risk and position management decisions. Our artificial intelligence model uses cutting edge technology to generate insights and explain how and why they are important to your business.
            <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg">
              {/* <div>
                <LineGraph data={linedata} />
              </div> */}

              <div className="text-center font-semibold text-xl">
                The Macrovesta Index {session?.user.id}
              </div>
              <div className="flex justify-around gap-8">
                <div className="relative">
                  <div className="text-center font-semibold">
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
                <div className="relative">
                  <div className="text-center font-semibold">
                    Seasonal Index
                  </div>
                  {selectAppropriateImage(JSON.parse(seasonalIndexData).inverse_year, parseFloat(JSON.parse(seasonalIndexData).probability_rate))}
                  {/* <img className="w-[400px]" src="/Index_Inverse_High.jpg" /> */}
                  <div className="absolute origin-right bg-turquoise w-[130px] ml-[68px] bottom-[45px] h-2 transition-all duration-1000" style={{
                    transform: `rotate(${90 - (parseFloat(JSON.parse(seasonalIndexData).probability_rate) / 100 * 90) * (JSON.parse(seasonalIndexData).inverse_year == "Y" ? 1 : -1)}deg)`
                  }}>
                    {/* <div className="origin-right bg-turquoise w-[150px] ml-[50px] bottom-[28px] h-2" style={{ transform: `rotate(${degrees}deg)` }}>
                    </div> */}
                  </div>
                  <div className="absolute bg-white shadow-center-lg text-black rounded-full right-0 w-12 h-12 grid place-content-center -translate-x-[178px] -translate-y-[25px] bottom-0">{JSON.parse(seasonalIndexData).probability_rate}</div>
                </div>

              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 pb-12 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-4 py-2 mb-8 mx-8">
                <div className="flex flex-col col-span-2 items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23</div>
                  <LineGraph data={contractParameter != null ? [{ name: "CTZ23", data: JSON.parse(CTZ23Data), noCircles: true }] : []} monthsTicks={6} xValue="datetime" yValue={contractParameter} graphWidth={1000} graphHeight={400} />
                  <div className="flex justify-center mt-8">
                    <div className="w-[200px]">
                      <SingleSelectDropdown
                        options={[{ name: "Open", parameter: "open" }, { name: "Close", parameter: "close" }, { name: "High", parameter: "high" }, { name: "Low", parameter: "low" }]}
                        label="Parameter"
                        variable="name"
                        colour="bg-deep_blue"
                        onSelectionChange={(e) => setContractParameter(e.parameter)}
                        placeholder="Select Parameter"
                        searchPlaceholder="Search Parameter"
                        includeLabel={false}
                        defaultValue="Close"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTH24 Spread</div>
                  <LineGraph data={calculateSpread(JSON.parse(CTZ23Data), JSON.parse(CTH24Data), "CTZ23 / CTH24 Spread")} monthsTicks={6} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTK24 Spread</div>
                  <LineGraph data={calculateSpread(JSON.parse(CTZ23Data), JSON.parse(CTK24Data), "CTZ23 / CTK24 Spread")} monthsTicks={6} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTN24 Spread</div>
                  <LineGraph data={calculateSpread(JSON.parse(CTZ23Data), JSON.parse(CTN24Data), "CTZ23 / CTN24 Spread")} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="mt-6 -mb-2 font-semibold">CTZ23 / CTZ24 Spread</div>
                  <LineGraph data={calculateSpread(JSON.parse(CTZ23Data), JSON.parse(CTZ24Data), "CTZ23 / CTZ24 Spread")} />
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <TVChartContainer {...defaultWidgetProps} />
            </div> */}
            {((session?.submittedSurvey == true) || ((todaysDate.getDay() == 0) || (todaysDate.getDay() == 1))) && (
              <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
                {/* {stages[currentStage]} */}
                {(currentStage == 0) && (session?.submittedSurvey != true) && ((todaysDate.getDay() == 0) || (todaysDate.getDay() == 1)) && (
                  <div className="grid grid-cols-2">
                    <div className="col-span-2 mb-4 text-center text-xl font-semibold">Macrovesta Sentiment Survey</div>
                    <div className="col-span-2 grid grid-cols-2 gap-x-4 pl-4">
                      <div className="flex flex-col justify-end items-end">
                        <div className="w-full">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            What is your feeling of the market?
                          </label>
                          <SingleSelectDropdown
                            options={[{ option: "Bullish" }, { option: "Bearish" }]}
                            label="BullishBearish"
                            variable="option"
                            colour="bg-[#ffffff]"
                            onSelectionChange={(e) => setBullishBearish(e.option)}
                            placeholder="Select an Option"
                            searchPlaceholder="Search Options"
                            includeLabel={false}
                            textCenter={false}
                            textColour="text-black"
                            border={true}
                            borderStyle="rounded-md border border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold leading-4 mb-3">Please submit your guesstimates to view the unanimous opinions of our other partners</div>
                        <div className="text-sm leading-4">This new feature displays unanimously the opinion of our partners about December 2023 Futures for the week ahead, offering a view of market sentiment for both short and long-term seasonal trends in the cotton industry.</div>
                      </div>
                    </div>
                    <form className="mt-4 mb-4 pl-4 grid grid-cols-2 col-span-2 gap-x-4 w-full" onSubmit={handleSentimentFormSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="high"
                          className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                        >
                          High
                        </label>
                        <input
                          type="number"
                          step=".01"
                          id="high"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                          placeholder="Enter your estimate"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="low"
                          className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                        >
                          Low
                        </label>
                        <input
                          type="number"
                          step=".01"
                          id="low"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                          placeholder="Enter your estimate"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="intraday"
                          className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                        >
                          Intraday Average in Points
                        </label>
                        <input
                          type="number"
                          step=".01"
                          id="intraday"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                          placeholder="Enter your estimate"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="open_interest"
                          className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                        >
                          Open Interest
                        </label>
                        <input
                          type="number"
                          step=".01"
                          id="open_interest"
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
                        <FormSubmit errorMessage={sentimentError_Message} warningMessage={sentimentWarning_Message} submitted={sentimentSubmitted} submitting={sentimentSubmitting} warningSubmit={sentimentWarningSubmit} />
                      </div>
                    </form>
                  </div>
                )}
                {((currentStage == 1) || (session?.submittedSurvey === true)) && (
                  <div className="grid grid-cols-2 mb-12">
                    <div className="col-span-2 text-center text-xl font-semibold mb-4">
                      Sentiment Survey Results
                    </div>
                    <div className="col-span-2 grid grid-cols-2">
                      <div className="flex flex-col items-center">
                        <div className="font-semibold">Bullish or Bearish</div>
                        <BullishBearishDonut Bullish={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish == "Bullish").length} Bearish={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish == "Bearish").length} />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex justify-center font-semibold">
                          Disclaimer
                        </div>
                        <div className="pl-20 pr-16 mt-6">
                          We understand the importance of privacy and confidentiality. Rest assured that when you submit information or interact with our platform, your data remains anonymous and we uphold strict safeguards to protect your privacy. We do not share any personal data, individually identifiable information, or user submissions with any third parties.
                        </div>
                        <div className="bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200 mt-8">
                          Privacy Policies
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mt-6 -mb-2 font-semibold">High</div>
                      <LineGraph data={transformSurveyData(sentimentData, 'high')} monthsTicks={1} />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mt-6 -mb-2 font-semibold">Low</div>
                      <LineGraph data={transformSurveyData(sentimentData, 'low')} monthsTicks={1} />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mt-6 -mb-2 font-semibold">Intraday Average in Points</div>
                      <LineGraph data={transformSurveyData(sentimentData, 'intraday_average_points')} monthsTicks={1} />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mt-6 -mb-2 font-semibold">Open Interest</div>
                      <LineGraph data={transformSurveyData(sentimentData, 'open_interest')} monthsTicks={1} />
                    </div>
                  </div>
                )}
                <div className="flex justify-between px-8">
                  {currentStage == 0 && (
                    <div></div>
                  )}
                  {currentStage > 0 && (
                    <button className="bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={goPrevious}>Previous</button>
                  )}
                  {currentStage < (stages.length - 1) && submitted && session?.submittedSurvey == false && (
                    <button className="bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={goNext}>Next</button>
                  )}
                </div>
              </div>
            )}
            {((session?.submittedSurvey != true) || ((todaysDate.getDay() != 0) || (todaysDate.getDay() != 1))) && (
              <div className="flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
                <div className="col-span-2 mb-4 text-center text-xl font-semibold">Macrovesta Sentiment Survey</div>
                <div className="px-8">
                  You did not fill in the survey sentiment this week on Sunday or Monday and therefore cannot view the results for this week.
                  Please fill it out next week if you would like to see the results.
                </div>
              </div>
            )}
            <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg m-8">
              <div className="text-center font-semibold text-xl">
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
                <div className="text-center font-semibold text-xl">Current Basis Cost</div>
                <GroupedBarChart data={basisBarChartData(JSON.parse(basisData))} />
              </div>
              <div className="flex flex-col items-center">
                <div className="-mb-2 text-center font-semibold text-xl">Historical Basis Cost</div>
                <LineGraph data={transformData(JSON.parse(basisData).filter((basis) => basis.country == basisCountry))} />
              </div>
              <div className="col-span-2 grid grid-cols-2 mb-4">
                <div className="grid place-content-center">
                  {session?.role == "partner" && (
                    <div className="bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200" onClick={() => setOpenBasisCostForm(true)}>
                      Add Basis Cost Estimate
                    </div>
                  )}
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
                <div className="flex justify-center">
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
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-8">
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <img src="/Charts_Under_Construction_Half_width.png" />
              </div>
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg">
                <div className="text-center font-semibold text-xl">
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
                            {/* <ReactMarkdown children={countryNewsPopup.text_of_in_country_news} /> */}
                            {/* <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown> */}
                            {/* {(countryNewsPopup.text_of_in_country_news).replace('[newline]', '\n\n')} */}
                            {countryNewsPopup.text_of_in_country_news.split('[newline]').map((paragraph, index) => (
                              <>
                                <p>{paragraph}</p>
                                {index != countryNewsPopup.text_of_in_country_news.split('[newline]').length - 1 && (
                                  <>
                                    <br />
                                  </>
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                        <div onClick={() => setCountryNewsPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10'></div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
            <div className="flex flex-col bg-[#ffffff] items-center p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12">
              <div className="text-xl font-semibold text-center pt-4">Future Contracts Study</div>
              {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
              <LineGraphNotTime data={(contract1 && contract2 && contract3) ? getStudyData(JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract1), JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract2), JSON.parse(futureContractsStudyData).find((contract) => contract.year == contract3)) : []} graphWidth={1000} graphHeight={600} />
            </div>
            <div className="text-center text-2xl mt-4">Please Select the Seasons you want to compare</div>
            <div className="grid grid-cols-3 justify-center gap-8 mx-8 mt-4 text-xl">
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Contract"
                  variable="year"
                  onSelectionChange={(e) => setContract1(e.year)}
                  placeholder="Select Contract"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract1}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 1</div> */}
                {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season1)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season1)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season1)?.inverse_season}</div>
                </div> */}
              </div>
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Season"
                  variable="year"
                  colour="bg-deep_blue"
                  onSelectionChange={(e) => setContract2(e.year)}
                  placeholder="Select Season"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract2}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 2</div> */}
                {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season2)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season2)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season2)?.inverse_season}</div>
                </div> */}
              </div>
              <div className="flex flex-col">
                <SingleSelectDropdown
                  options={JSON.parse(futureContractsStudyData)}
                  label="Contract"
                  variable="year"
                  colour="bg-turquoise"
                  onSelectionChange={(e) => setContract3(e.year)}
                  placeholder="Select Contract"
                  searchPlaceholder="Search Contracts"
                  includeLabel={false}
                  defaultValue={contract3}
                />
                {/* <div className="text-center mt-4 mb-2 font-semibold">Season 3</div> */}
                {/* <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4 mt-8">
                  <div>Low Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.low_price}</div>
                  <div>High Price: {JSON.parse(seasonsData).find((season) => season.season == season3)?.high_price}</div>
                  <div>Date of Low: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_low)}</div>
                  <div>Date of High: {parseDateString(JSON.parse(seasonsData).find((season) => season.season == season3)?.date_of_high)}</div>
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season3)?.inverse_season}</div>
                </div> */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 m-8">
              <div className="flex flex-col gap-1 bg-[#ffffff] shadow-center-lg text-black rounded-xl px-8 py-4">
                <div>Average High (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), "high")).toFixed(2)}</div>
                <div>Average Low (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), "low")).toFixed(2)}</div>
                <div>Average Price Range (1970-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), "price_range_between_high_and_low")).toFixed(2)}</div>
                <div>Average High (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), "high")).toFixed(2)}</div>
                <div>Average Low (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), "low")).toFixed(2)}</div>
                <div>Average Price Range (2000-2023): {(averageFutureContract(JSON.parse(futureContractsStudyData), "price_range_between_high_and_low")).toFixed(2)}</div>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#ffffff] p-4 rounded-xl shadow-lg mx-8 mt-4 pb-12">
              <div className="text-xl font-semibold text-center pt-4">V4</div>
              {/* <img src="/Charts_Under_Construction_Wide.png" /> */}
              <LineGraphNotTime data={(season1 && season2 && season3) ? getSeasonData(JSON.parse(seasonsData).find((season) => season.season == season1), JSON.parse(seasonsData).find((season) => season.season == season2), JSON.parse(seasonsData).find((season) => season.season == season3)) : []} graphWidth={1000} graphHeight={600} />
            </div>
            <div className="text-center text-2xl mt-4">Please Select the Seasons you want to compare</div>
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
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season1)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season1)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season1)?.inverse_season}</div>
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
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season2)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season2)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season2)?.inverse_season}</div>
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
                  <div>Month of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_low}</div>
                  <div>Month of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.month_of_high}</div>
                  <div>Week of Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_low}</div>
                  <div>Week of High: {JSON.parse(seasonsData).find((season) => season.season == season3)?.calendar_week_of_high}</div>
                  <div>Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.range_between_high_low}</div>
                  <div>Rank of Price Range: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_of_price_range}</div>
                  <div>Percentage Rate to Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.percentage_rate_to_low}</div>
                  <div>Day Range between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.day_range_between_high_low}</div>
                  <div>Rank between High and Low: {JSON.parse(seasonsData).find((season) => season.season == season3)?.rank_between_high_low}</div>
                  <div>Inverse Season: {JSON.parse(seasonsData).find((season) => season.season == season3)?.inverse_season}</div>
                </div>
              </div>
            </div>
            <div className="text-xl text-center mt-8">Learn More with Macrovesta</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 m-8 gap-24 text-lg">
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center">Learning Dash</div>
              <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg text-center">Market Reports</div>
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

  const contract = await prisma?.cotton_contracts.findMany({})

  const contractsObject = contract.reduce((acc, obj) => {
    if (acc[obj.contract] == undefined) {
      acc[obj.contract] = [obj]
    } else {
      acc[obj.contract].push(obj)
    }
    return acc;
  }, {})

  const CTZ23 = contractsObject?.CTZ23
  const CTH24 = contractsObject?.CTH24
  const CTK24 = contractsObject?.CTK24
  const CTN24 = contractsObject?.CTN24
  const CTZ24 = contractsObject?.CTZ24

  const CTZ23Data = JSON.stringify(CTZ23)
  const CTH24Data = JSON.stringify(CTH24)
  const CTK24Data = JSON.stringify(CTK24)
  const CTN24Data = JSON.stringify(CTN24)
  const CTZ24Data = JSON.stringify(CTZ24)

  const sentiment = await prisma?.sentiment_survey.findMany({

  })
  const initialSentimentData = JSON.stringify(sentiment)

  console.log("intitalData", initialSentimentData)

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

  const future = await prisma?.future_contracts_study.findMany({
    orderBy: {
      date_of_high: "desc"
    }
  })

  const futureContractsStudyData = JSON.stringify(future)

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

  const seasonalIndex = await prisma?.seasonal_index.findFirst({
    // where: {
    //   inverse_month: "N"
    // }
  });
  const seasonalIndexData = JSON.stringify(seasonalIndex);
  console.log(monthlyIndexData)
  return {
    props: { monthlyIndexData, seasonalIndexData, snapshotsData, countryNewsData, seasonsData, basisData, initialSentimentData, CTZ23Data, CTH24Data, CTK24Data, CTN24Data, CTZ24Data, futureContractsStudyData },
  };
};

export default Home;
