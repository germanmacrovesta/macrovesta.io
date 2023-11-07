export function getCurrentMonth () {
  // Create a new Date object
  const date = new Date()

  // Create an array of month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  // Get the month number from the Date object and use it to get the month name
  const monthName = monthNames[date.getMonth()]
  console.log(monthName)
  return monthName
}

export function parseDateString (dateString) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)

  if (isNaN(date)) {
    return undefined
  } else {
    return `${day}-${month}-${year}`
  }
}

export function parseDateStringFullYear (dateString) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())

  if (isNaN(date)) {
    return undefined
  } else {
    return `${year}-${month}-${day}`
  }
}

export function getWeekNumber (d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo]
}

export function addFullYear (twoDigitYear) {
  if (twoDigitYear[0] === '0' || twoDigitYear[0] === '1' || twoDigitYear[0] === '2') {
    const newYear = `20${twoDigitYear}`
    // return `20${twoDigitYear}`
    return newYear
  } else {
    return `19${twoDigitYear}`
  }
}

export function getWeek (date, startDay) {
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  tempDate.setUTCDate(tempDate.getUTCDate() + 3 - (tempDate.getUTCDay() + 6 - startDay + 7) % 7)
  const week1 = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 4))
  return 1 + Math.ceil(((tempDate - week1) / 86400000 + 3) / 7)
}

export const today = new Date() // Current date

export const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

export function getTodayDate () {
  const temp = new Date()
  const dd = String(temp.getDate()).padStart(2, '0')
  const mm = String(temp.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = temp.getFullYear()
  temp.setSeconds(0)
  const today = `${yyyy}-${mm}-${dd}`

  return today
}

export function getOneYearAgoDate () {
  const temp = new Date()
  temp.setFullYear(temp.getFullYear() - 1)

  const year2 = temp.getFullYear()
  const month2 = (temp.getMonth() + 1).toString().padStart(2, '0') // add leading zero if necessary
  const day2 = temp.getDate().toString().padStart(2, '0') // add leading zero if necessary

  const dateOneYearAgo = `${year2}-${month2}-${day2}`
  return dateOneYearAgo
}

export function getDateSixMothAgo () {
  const temp2 = new Date() // get the current date
  temp2.setMonth(temp2.getMonth() - 6) // subtract 6 months

  // format the date as yyyy-mm-dd
  const year = temp2.getFullYear()
  let month = (temp2.getMonth() + 1).toString() // JavaScript months are 0-based, so we add 1
  let day = (temp2.getDate()).toString()

  // ensure month and day are 2 digits
  if (parseInt(month) < 10) {
    month = '0' + month
  }
  if (parseInt(day) < 10) {
    day = '0' + day
  }

  return `${year}-${month}-${day}`
}
