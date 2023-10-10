export function calculateSpread (arr1, arr2, name) {
  // Transform arrays into maps for easy lookup
  const map1 = new Map(arr1.map(item => [item.datetime, item.close]))
  const map2 = new Map(arr2.map(item => [item.datetime, item.close]))

  // Find the later start date
  const start1 = new Date(arr1[0].datetime)
  const start2 = new Date(arr2[0].datetime)
  const start = start1 > start2 ? start1.toISOString() : start2.toISOString()

  // Merge arrays
  const merged = []
  for (const [datetime, close1] of map1) {
    if (datetime >= start) {
      const close2 = map2.get(datetime)
      if (close2 !== undefined) {
        merged.push({
          time: datetime,
          value: Number((close1 - close2).toPrecision(4))
        })
      }
    }
  }

  return [{ name, data: merged, noCircles: true, noHover: true }]
}

export function basisBarChartData (originalData) {
  const today = new Date() // Current date
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const data = originalData.filter((basis) => basis.date_of_basis_report > oneWeekAgo.toISOString())
  const result = Object.values(data.reduce((accumulator, current) => {
    const { country, CTZ23, CTZ24 } = current

    if (!accumulator[country]) {
      accumulator[country] = {
        country,
        CTZ23: CTZ23 || 0,
        CTZ24: CTZ24 || 0
      }
    } else {
      accumulator[country].CTZ23 += CTZ23 || 0
      accumulator[country].CTZ24 += CTZ24 || 0
    }

    return accumulator
  }, {})).map((countryData) => {
    const { country, CTZ23, CTZ24 } = countryData
    const count = data.filter(obj => obj.country === country).length

    return {
      country,
      CTZ23: parseFloat((CTZ23 / count).toFixed(0)),
      CTZ24: parseFloat((CTZ24 / count).toFixed(0))
    }
  })

  console.log(result)
  return result
}

export function averageFutureContract (data, property) {
  const array = data.reduce((acc, obj) => {
    acc[0] += parseFloat(obj[property])
    acc[1]++
    return acc
  }, [0, 0])
  return array[0] / array[1]
}

export function averageMarketSentiment (sentimentData, oneWeekAgo) {
  const data = sentimentData.filter((sentiment) => new Date(sentiment.date_of_survey) > oneWeekAgo)
  const total = data.reduce((acc, obj) => { acc += parseFloat(obj.bullish_or_bearish_value); return acc }, 0)
  console.log('total', total)
  return sentimentData.length > 0 ? total / data.length : 0
}

export function transformData (input) {
  const contract1Data = { name: 'CTZ23', data: [], noCircles: true }
  const contract2Data = { name: 'CTZ24', data: [], noCircles: true }
  input.forEach((item) => {
    contract1Data.data.push({ time: (new Date(item.date_of_basis_report)).toISOString(), value: item.CTZ23 })
    contract2Data.data.push({ time: (new Date(item.date_of_basis_report)).toISOString(), value: item.CTZ24 })
  })

  return [contract1Data, contract2Data]
}

export function transformSurveyData (inputArray, propertyUsed, precision = 2) {
  const outputArray = []
  const averages = {}
  // const combinedSeries = {
  //   name: "Combined",
  //   data: []
  // };
  averages.Bullish = {}
  averages.Bearish = {}
  averages.Neutral = {}

  for (const obj of inputArray) {
    const groupName = obj.bullish_or_bearish

    if (!averages[groupName]) {
      averages[groupName] = {}
    }
    if (!averages.Average) {
      averages.Average = {}
    }

    const date = new Date(obj.date_of_survey)
    const dateString = date.toISOString().split('T')[0]

    if (!averages[groupName][dateString]) {
      averages[groupName][dateString] = {
        sum: 0,
        count: 0
      }
    }
    if (!averages.Average[dateString]) {
      averages.Average[dateString] = {
        sum: 0,
        count: 0
      }
    }

    averages[groupName][dateString].sum += parseFloat(obj[propertyUsed])
    averages[groupName][dateString].count++
    averages.Average[dateString].sum += parseFloat(obj[propertyUsed])
    averages.Average[dateString].count++

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
    const group = averages[groupName]
    const data = []

    for (const dateString in group) {
      const average =
        parseFloat((group[dateString].sum / group[dateString].count).toFixed(precision))
      const date = new Date(dateString)

      data.push({
        time: date.toISOString(),
        value: average
      })
    }
    if (groupName === 'Average') {
      outputArray.push({
        name: groupName,
        data,
        dottedLine: true
      })
    } else {
      outputArray.push({
        name: groupName,
        data
      })
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
  console.log(propertyUsed, outputArray)
  return outputArray
}
export function parseSeasonalIndex (seasonalIndexData) {
  return parseFloat(JSON.parse(seasonalIndexData).probability_rate) * (JSON.parse(seasonalIndexData).inverse_year === 'Y' ? -1 : 1)
}

export function parseMonthlyIndex (monthlyIndexData) {
  return parseFloat(JSON.parse(monthlyIndexData).probability_rate) * (JSON.parse(monthlyIndexData).inverse_month === 'Y' ? -1 : 1)
}
