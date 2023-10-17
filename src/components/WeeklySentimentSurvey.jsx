import React, { useState } from 'react'
import InfoButton from './infoButton'
import FormSubmit from './formSubmit'
import BullishBearishDonut from './bullishBearishDonut'
import SemiCircleDial from './semiCircleDial'
import LineGraph from './lineGraph'
import { transformSurveyData, averageMarketSentiment } from '~/utils/calculateUtils'
import { oneWeekAgo } from '~/utils/dateUtils'

const WeeklySentimentSurvey = ({ session, sentimentData }) => {
  const todaysDate = new Date()

  const [sentimentErrorMessage, setSentimentErrorMessage] = useState('')
  const [sentimentSubmitted, setSentimentSubmitted] = useState(false)
  const [sentimentSubmitting, setSentimentSubmitting] = useState(false)
  const [sentimentWarningMessage, setSentimentWarningMessage] = useState('')
  const [sentimentWarningSubmit, setSentimentWarningSubmit] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)

  const goNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1)
    }
  }

  const goPrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1)
    }
  }

  const stages = [1, 2]
  const handleSentimentFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setSentimentSubmitting(true)

    const bullish_or_bearish = e.target.bullishbearish.value
    const high = e.target.high.value
    const low = e.target.low.value
    const intraday_average_points = e.target.intraday.value
    const open_interest = e.target.open_interest.value
    let errorMessage = ''
    const warningMessage = ''

    // if (bullishBearish != null && bullishBearish != "Select an Option") {
    //   bullish_or_bearish = bullishBearish;
    // } else {
    //   errorMessage += "Please select bullish or bearish. ";
    // }

    if (bullish_or_bearish == null || bullish_or_bearish == '') {
      errorMessage += 'Please enter Estimate for market feeling. '
    }
    if (high == null || high === '') {
      errorMessage += 'Please enter Estimate for high. '
    }
    if (low == null || low === '') {
      errorMessage += 'Please enter Estimate for low. '
    }
    if (intraday_average_points == null || intraday_average_points === '') {
      errorMessage += 'Please enter Estimate for intraday average in points. '
    }
    if (open_interest == null || open_interest === '') {
      errorMessage += 'Please enter Estimate for open interest. '
    }

    if (warningMessage !== '') {
      setSentimentWarningMessage(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (sentimentWarningMessage !== '') {
        setSentimentWarningMessage('')
      }
    }

    if (errorMessage !== '') {
      setSentimentErrorMessage(errorMessage)
      setSentimentWarningSubmit(false)
      setSentimentSubmitting(false)
    } else {
      if (sentimentErrorMessage !== '') {
        setSentimentErrorMessage('')
      }

      if (sentimentWarningSubmit === false && warningMessage !== '') {
        setSentimentWarningSubmit(true)
        setSentimentSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          bullish_or_bearish: bullish_or_bearish == '0' ? 'Neutral' : parseInt(bullish_or_bearish) < 0 ? 'Bearish' : 'Bullish',
          bullish_or_bearish_value: bullish_or_bearish,
          high,
          low,
          intraday_average_points,
          open_interest,
          email: session?.user.email,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-sentiment-survey-results'

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json'
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json().then(() => {
          setSentimentSubmitted(true)
          setSentimentSubmitting(false)
          setCurrentStage(1)
          // setSentimentData([...sentimentData, { record_id: "dummyid", bullish_or_bearish, high, low, intraday_average_points, open_interest }])
        })
        // setSubmitted(true); setSubmitting(false)
        // console.log(result);
      }
    }
  }

  return (
    <>
      {/* ((session?.submittedSurvey == true) || ((todaysDate.getDay() == 0) || (todaysDate.getDay() == 1))) */}
      {((session?.submittedSurvey === true) || ((todaysDate.getDay() === 0) || (todaysDate.getDay() === 1))) && (
        <div className='relative flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>
          {/* {stages[currentStage]} */}
          {/* (currentStage == 0) && ((todaysDate.getDay() == 0) || (todaysDate.getDay() == 1)) && (session?.submittedSurvey != true) */}
          {(currentStage === 0) && ((todaysDate.getDay() === 0) || (todaysDate.getDay() === 1)) && (session?.submittedSurvey !== true) && (
            <>
              <InfoButton text='Every Sunday we send out a quick survey to an exclusive list of senior traders to input their expectations for the week ahead. We ask for their expectations for week’s high, low, intraday moving average in points and open interest for futures only. ' />
              <div className='grid grid-cols-2'>
                <div className='col-span-2 mb-4 text-center text-xl font-semibold'>Weekly Macrovesta Sentiment Survey</div>
                <div className='col-span-2 grid grid-cols-2 gap-x-4 pl-4'>
                  {/* <div className="flex flex-col justify-end items-end">
                        <div className="w-full">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2 pl-3"
                          >
                            What is your feeling of the market?
                          </label>
                          <SingleSelectDropdown
                            options={[{ option: "Bullish" }, { option: "Bearish" }, { option: "Neutral" }]}
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
                      </div> */}
                </div>
                <form className='mt-4 mb-4 pl-4 grid grid-cols-2 col-span-2 gap-x-4 w-full' onSubmit={handleSentimentFormSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='bullishbearish'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      What is your feeling of the market?
                    </label>
                    <input
                      type='number'
                      step='1'
                      min={-5}
                      max={5}
                      id='bullishbearish'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='From -5 to 5'
                    />
                    <div className='pl-3 text-sm'>-5 for very bearish, 0 for neutral and 5 for very bullish</div>
                  </div>
                  <div className='flex flex-col'>
                    <div className='font-semibold leading-4 mb-3'>Please submit your guesstimates to view the unanimous opinions of our other partners</div>
                    <div className='text-sm leading-4'>This new feature displays unanimously the opinion of our partners about December 2023 Futures for the week ahead, offering a view of market sentiment for both short and long-term seasonal trends in the cotton industry.</div>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='high'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      High
                    </label>
                    <input
                      type='number'
                      step='.01'
                      id='high'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter your estimate'
                    />
                    <div className='pl-3 text-sm'>Last week's estimates average was {(transformSurveyData(sentimentData, 'high')?.find((group) => group.name === 'Average')?.data[transformSurveyData(sentimentData, 'high')?.find((group) => group.name === 'Average')?.data?.length - 2]?.value)?.toFixed(2)}</div>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='low'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Low
                    </label>
                    <input
                      type='number'
                      step='.01'
                      id='low'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter your estimate'
                    />
                    <div className='pl-3 text-sm'>Last week's estimates average was {(transformSurveyData(sentimentData, 'low')?.find((group) => group.name === 'Average')?.data[transformSurveyData(sentimentData, 'low')?.find((group) => group.name === 'Average')?.data?.length - 2]?.value).toFixed(2)}</div>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='intraday'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Intraday Average in Points
                    </label>
                    <input
                      type='number'
                      step='.01'
                      id='intraday'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter your estimate'
                    />
                    <div className='pl-3 text-sm'>Last week's estimates average was {(transformSurveyData(sentimentData, 'intraday_average_points')?.find((group) => group.name === 'Average')?.data[transformSurveyData(sentimentData, 'intraday_average_points')?.find((group) => group.name === 'Average')?.data?.length - 2]?.value)?.toFixed(0)}</div>
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='open_interest'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Open Interest (Futures only)
                    </label>
                    <input
                      type='number'
                      step='.01'
                      id='open_interest'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter your estimate'
                    />
                    <div className='pl-3 text-sm'>Last week's estimates average was {(transformSurveyData(sentimentData, 'open_interest')?.find((group) => group.name === 'Average')?.data[transformSurveyData(sentimentData, 'open_interest')?.find((group) => group.name === 'Average')?.data?.length - 2]?.value)?.toFixed(0)}</div>
                  </div>

                  <div className='col-span-2 flex justify-center'>
                    {/* <button
            type="submit"
            className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
          >
            Submit
          </button> */}
                    <FormSubmit errorMessage={sentimentErrorMessage} warningMessage={sentimentWarningMessage} submitted={sentimentSubmitted} submitting={sentimentSubmitting} warningSubmit={sentimentWarningSubmit} />
                  </div>
                </form>
              </div>
            </>
          )}
          {((currentStage === 1) || (session?.submittedSurvey === true)) && (
            <>
              <InfoButton text='Every Sunday we send out a quick survey to an exclusive list of senior traders to input their expectations for the week ahead. Our system calculates an average of inputs for each different category: bullish, neutral and bearish. ' />
              <div className='grid grid-cols-2 mb-12'>
                <div className='col-span-2 text-center text-xl font-semibold mb-4'>
                  Sentiment Survey Results
                </div>
                <div className='col-span-2 flex flex-col items-center'>
                  <div className='flex justify-center font-semibold'>
                    Disclaimer
                  </div>
                  <div className='pl-20 pr-16 mt-6'>
                    We understand the importance of privacy and confidentiality. Rest assured that when you submit information or interact with our platform, your data remains anonymous and we uphold strict safeguards to protect your privacy. We do not share any personal data, individually identifiable information, or user submissions with any third parties.
                  </div>
                  <div className='bg-deep_blue w-fit text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200 mt-8'>
                    Privacy Policies
                  </div>
                </div>
                <div className='col-span-2 grid grid-cols-2'>
                  <div className='flex flex-col items-center'>
                    <div className='font-semibold'>Market Sentiment Distribution</div>
                    <BullishBearishDonut Bullish={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish === 'Bullish' && new Date(sentiment.date_of_survey) > oneWeekAgo).length} Bearish={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish === 'Bearish' && new Date(sentiment.date_of_survey) > oneWeekAgo).length} Neutral={sentimentData.filter((sentiment) => sentiment.bullish_or_bearish === 'Neutral' && new Date(sentiment.date_of_survey) > oneWeekAgo).length} />
                  </div>

                  <div className='flex flex-col items-center'>
                    <div className='font-semibold mb-20'>Market Sentiment Strength</div>

                    <SemiCircleDial value={averageMarketSentiment(sentimentData, oneWeekAgo)} rangeStart={-5} rangeEnd={5} arcAxisText={['-5', '-3', '0', '3', '5']} leftText='Bearish' rightText='Bullish' decimals={1} />
                  </div>
                  {/* <SemiCircleDial value={parseFloat(JSON.parse(seasonalIndexData).probability_rate) * (JSON.parse(seasonalIndexData).inverse_year == "Y" ? -1 : 1)} /> */}

                </div>
                <div className='flex flex-col items-center'>
                  <div className='mt-6 -mb-2 font-semibold'>High</div>
                  <LineGraph lineLimit={5} data={transformSurveyData(sentimentData, 'high')} monthsTicks={1} />
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mt-6 -mb-2 font-semibold'>Low</div>
                  <LineGraph lineLimit={5} data={transformSurveyData(sentimentData, 'low')} monthsTicks={1} />
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mt-6 -mb-2 font-semibold'>Intraday Average in Points</div>
                  <LineGraph decimalPlaces={0} lineLimit={5} data={transformSurveyData(sentimentData, 'intraday_average_points')} monthsTicks={1} />
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mt-6 -mb-2 font-semibold'>Open Interest</div>
                  <LineGraph decimalPlaces={0} lineLimit={5} data={transformSurveyData(sentimentData, 'open_interest', 0)} monthsTicks={1} />
                </div>
              </div>
            </>
          )}
          <div className='flex justify-between px-8'>
            {currentStage === 0 && (
              <div />
            )}
            {currentStage > 0 && (
              <button className='bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={goPrevious}>Previous</button>
            )}
            {currentStage < (stages.length - 1) && sentimentSubmitted && session?.submittedSurvey === false && (
              <button className='bg-deep_blue w-[100px] text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={goNext}>Next</button>
            )}
          </div>
        </div>
      )}
      {((session?.submittedSurvey !== true) && ((todaysDate.getDay() !== 0) && (todaysDate.getDay() !== 1))) && (
        <div className='relative flex flex-col col-span-2 bg-[#ffffff] p-4 rounded-xl shadow-lg m-8'>
          <div className='relative w-full text-center col-span-2 mb-4 text-xl font-semibold'>
            <InfoButton text='Every Sunday we send out a quick survey to an exclusive list of senior traders to input their expectations for the week ahead. We ask for their expectations for week’s high, low, intraday moving average in points and open interest for futures only. ' />
            Weekly Macrovesta Sentiment Survey
          </div>
          <div className='px-8'>
            You did not fill in the survey sentiment this week on Sunday or Monday and therefore cannot view the results for this week.
            Please fill it out next week if you would like to see the results.
          </div>
        </div>
      )}
    </>
  )
}

export default WeeklySentimentSurvey
