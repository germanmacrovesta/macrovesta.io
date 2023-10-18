import { addFullYear } from './dateUtils'

export function getCottonOnCallWeekData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: item.date, y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: item.date, y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getCottonOnCallSeasonData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: parseInt(addFullYear(String(item.season).substring(0, 2))), y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: parseInt(addFullYear(String(item.season).substring(0, 2))), y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getCommitmentOfTradersWeekData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getCommitmentOfTradersSeasonData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getSupplyAndDemandData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        if (parseInt(item[property]) !== 0) {
          const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
          dataset.data.push({ time: item.date, value: parseInt(item[property]) })
        }
      } else {
        if (parseInt(item[property]) !== 0) {
          const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
          dataset.data.push({ time: item.date, value: parseInt(item[property]) })
          datasetArray.push(dataset)
        }
      }
    })
  })
  return datasetArray
}

export function getAIndexData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: item.date, y: parseFloat(item[property]) })
        // dataset.data.push({ x: item.date, y: parseFloat(item[spreadVariable]) - parseFloat(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: item.date, y: parseFloat(item[property]) })
        // dataset.data.push({ x: item.date, y: parseFloat(item[spreadVariable]) - parseFloat(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getUSExportSalesData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: item.week_ending, y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: item.week_ending, y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getUSExportSalesWeekData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: parseInt(item.week), y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getUSExportSalesSeasonData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: parseInt(item.calendar_year), y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

export function getSeasonData (s1, s2, s3) {
  const array = []
  if (s1 != null && s1 !== 'Select Season') {
    const s1Data = { name: s1.season, data: [{ x: s1.month_of_low, y: s1.low_price }, { x: s1.month_of_high, y: s1.high_price }] }
    array.push(s1Data)
  }
  if (s2 != null && s2 !== 'Select Season') {
    const s2Data = { name: s2.season, data: [{ x: s2.month_of_low, y: s2.low_price }, { x: s2.month_of_high, y: s2.high_price }] }
    array.push(s2Data)
  }
  if (s3 != null && s3 !== 'Select Season') {
    const s3Data = { name: s3.season, data: [{ x: s3.month_of_low, y: s3.low_price }, { x: s3.month_of_high, y: s3.high_price }] }
    array.push(s3Data)
  }
  return array
}

export function getStudyData (s1, s2, s3) {
  const array = []
  if (s1 != null && s1 !== 'Select Contract') {
    const s1Data = { name: s1.year, data: [{ x: s1.month_of_low, y: s1.low }, { x: s1.month_of_high, y: s1.high }] }
    array.push(s1Data)
  }
  if (s2 != null && s2 !== 'Select Contract') {
    const s2Data = { name: s2.year, data: [{ x: s2.month_of_low, y: s2.low }, { x: s2.month_of_high, y: s2.high }] }
    array.push(s2Data)
  }
  if (s3 != null && s3 !== 'Select Contract') {
    const s3Data = { name: s3.year, data: [{ x: s3.month_of_low, y: s3.low }, { x: s3.month_of_high, y: s3.high }] }
    array.push(s3Data)
  }
  return array
}

export function getUniqueOptions (data, property) {
  const uniqueValues = data.reduce((acc, obj) => {
    return acc.includes(obj[property]) ? acc : [...acc, obj[property]]
  }, [])
  const options = []
  uniqueValues.forEach((value) => {
    options.push({ value: String(value) })
  })
  return options.sort((a, b) => a.value - b.value)
}

export function getEstimatesData (data, propertyArray, datasetNameArray) {
  const datasetArray = []
  data.forEach((item) => {
    propertyArray.forEach((property, index) => {
      if (datasetArray.find((dataset) => dataset.name === datasetNameArray[index]) !== undefined) {
        const dataset = datasetArray.find((dataset) => dataset.name === datasetNameArray[index])
        dataset.data.push({ x: item.date_created, y: parseInt(item[property]) })
      } else {
        const dataset = { name: datasetNameArray[index], data: [], noCircles: true }
        dataset.data.push({ x: item.date_created, y: parseInt(item[property]) })
        datasetArray.push(dataset)
      }
    })
  })
  return datasetArray
}

// Functions not used at the moment

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

// const renderers = {
//   h1: ({ node, ...props }) => <h1 {...props} />,
//   h2: ({ node, ...props }) => <h2 {...props} />,
//   h3: ({ node, ...props }) => <h3 {...props} />,
//   h4: ({ node, ...props }) => <h4 {...props} />,
//   h5: ({ node, ...props }) => <h5 {...props} />,
//   h6: ({ node, ...props }) => <h6 {...props} />
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
//     <img className='w-[400px]' src={imagesrc} />
//   )
// }
