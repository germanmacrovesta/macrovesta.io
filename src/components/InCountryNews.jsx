import { useState } from 'react'
import InfoButton from './infoButton'
import SingleSelectDropdown from './singleSelectDropdown'
import FormSubmit from './formSubmit'
import { parseDateString } from '~/utils/dateUtils'

const InCountryNews = ({ countryNewsData, session, setCountryNewsFormCountry }) => {
  const [countryNewsFilter, setCountryNewsFilter] = useState('All Countries')
  const [countryNewsPopup, setCountryNewsPopup] = useState(null)
  const [openCountryNewsForm, setOpenCountryNewsForm] = useState(false)
  const [countryNewsError_Message, setCountryNewsError_Message] = useState('')
  const [countryNewsSubmitted, setCountryNewsSubmitted] = useState(false)
  const [countryNewsSubmitting, setCountryNewsSubmitting] = useState(false)
  const [countryNewsWarning_Message, setCountryNewsWarning_Message] = useState('')
  const [countryNewsWarningSubmit, setCountryNewsWarningSubmit] = useState(false)

  const handleCountryNewsFormSubmit = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault()
    setCountryNewsSubmitting(true)

    const country = countryNewsFormCountry
    const title = e.target.title.value
    const text = e.target.text.value
    const image = e.target.image.value
    let errorMessage = ''
    let warningMessage = ''

    // console.log("textarea", text == "")

    if (country == null || country == '') {
      errorMessage += 'Please select a country. '
    }
    if (title == null || title == '') {
      errorMessage += 'Please enter a title. '
    }
    if (text == null || text == '') {
      errorMessage += 'Please enter a text. '
    }
    if (image == null || image == '') {
      warningMessage += "You can add an image as well. If you don't want to just click confirm. "
    }

    if (warningMessage !== '') {
      setCountryNewsWarning_Message(warningMessage)
      // throw new Error(errorMessage)
    } else {
      if (countryNewsWarning_Message != '') {
        setCountryNewsWarning_Message('')
      }
    }

    if (errorMessage != '') {
      setCountryNewsError_Message(errorMessage)
      setCountryNewsWarningSubmit(false)
      setCountryNewsSubmitting(false)
    } else {
      if (countryNewsError_Message != '') {
        setCountryNewsError_Message('')
      }

      if (countryNewsWarningSubmit == false && warningMessage != '') {
        setCountryNewsWarningSubmit(true)
        setCountryNewsSubmitting(false)
      } else {
        // Get data from the form.
        const data = {
          country,
          title,
          text,
          image,
          user: session?.user?.name
        }

        console.log(data)

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/add-country-news'

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
        const result = await response.json().then(() => { setCountryNewsSubmitted(true); setCountryNewsSubmitting(false) })
        // setCountryNewsSubmitted(true); setCountryNewsSubmitting(false)
      }
    }
  }
  return (
    <div className='relative flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-lg'>
      <div className='relative text-center font-semibold text-xl mb-4'>
        <InfoButton text={'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'} />
        In Country News
      </div>
      <div className=''>
        <SingleSelectDropdown
          options={[{ country: 'All Countries' }, { country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]}
          label='Country'
          variable='country'
          colour='bg-deep_blue'
          onSelectionChange={(e) => setCountryNewsFilter(e.country)}
          placeholder='Select Country'
          searchPlaceholder='Search Countries'
          includeLabel={false}
          defaultValue='All Countries'
        />
      </div>
      <div className='flex flex-col justify-around items-start gap-4 mt-4'>
        {JSON.parse(countryNewsData).filter((object) => countryNewsFilter !== 'Select Country' && countryNewsFilter != 'All Countries' ? object?.country === countryNewsFilter : true).filter((object, index) => index < 10).map((news, index) => (
        // <div className="border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer" onClick={() => setCountryNewsPopup(news)}>
        //   {news.title_of_in_country_news}
        // </div>
          <>
            {index === 0 && (
              <div className='border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-2 cursor-pointer flex gap-4' onClick={() => setCountryNewsPopup(news)}>
                <img className='w-[150px] h-[150px] aspect-square object-cover rounded-lg' src={news?.image_of_in_country_news !== '' ? news?.image_of_in_country_news : '/macrovesta_news_default_picture.jpg'} />
                <div className='flex flex-col w-full'>
                  <div className='grid grid-cols-[auto_75px]'>
                    <div className='font-semibold'>
                      {news.title_of_in_country_news}
                    </div>
                    <div className='w-[75px]'>
                      {parseDateString(news.date_of_in_country_news)}
                    </div>
                  </div>
                  <div className='text-sm pt-2'>{news.text_of_in_country_news.length > 200 ? `${news.text_of_in_country_news.slice(0, 200)}...` : news.text_of_in_country_news}</div>
                </div>
              </div>
            )}
            {index !== 0 && (
              <div className='border hover:bg-deep_blue hover:text-white transition-colors duration-300 shadow-lg rounded-lg w-full py-2 px-4 cursor-pointer' onClick={() => setCountryNewsPopup(news)}>
                {news.title_of_in_country_news}
              </div>
            )}
          </>
        ))}
        {countryNewsPopup != null && (
          <div className='absolute modal left-0 top-0 z-40'>
            <div className=' fixed grid place-content-center inset-0 z-40'>
              <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
                <img className='w-3/4' src={countryNewsPopup.image_of_in_country_news} />
                <div className='my-4 font-semibold text-lg'>
                  {countryNewsPopup.title_of_in_country_news}
                </div>
                <div className='-mt-4 mb-2'>
                  {parseDateString(countryNewsPopup.date_of_in_country_news)}
                </div>
                <div className=''>
                  {/* <ReactMarkdown children={countryNewsPopup.text_of_in_country_news} /> */}
                  {/* <ReactMarkdown components={renderers}>{markdown}</ReactMarkdown> */}
                  {/* {(countryNewsPopup.text_of_in_country_news).replace('[newline]', '\n\n')} */}
                  {countryNewsPopup.text_of_in_country_news.split('[newline]').map((paragraph, index) => (
                    <>
                      <p>{paragraph}</p>
                      {index !== countryNewsPopup.text_of_in_country_news.split('[newline]').length - 1 && (
                        <>
                          <br />
                        </>
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div onClick={() => setCountryNewsPopup(null)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10' />
            </div>
          </div>
        )}

      </div>
      {(session?.role === 'partner' || session?.role === 'admin') && (
        <div className='flex justify-center'>
          <div className='bg-deep_blue w-fit text-white px-4 py-2 mt-4 rounded-xl cursor-pointer hover:scale-105 duration-200' onClick={() => setOpenCountryNewsForm(true)}>
            Add in country news
          </div>
        </div>
      )}
      {openCountryNewsForm && (
        <div className='absolute modal left-0 top-0 z-40'>
          <div className=' fixed grid place-content-center inset-0 z-40'>
            <div className='flex flex-col items-center w-[750px] max-h-[600px] overflow-y-auto inset-0 z-50 bg-white rounded-xl shadow-lg px-8 py-4'>
              <div className='my-4 font-semibold text-lg'>
                Add in country news
              </div>
              <div className='w-full'>
                <form className='mt-4 mb-4 pl-4 flex flex-col gap-x-4 w-full' onSubmit={handleCountryNewsFormSubmit}>
                  <div className='mb-4'>
                    <SingleSelectDropdown
                      options={[{ country: 'Brazil' }, { country: 'USA' }, { country: 'Bangladesh' }, { country: 'Australia' }, { country: 'Pakistan' }, { country: 'Vietnam' }, { country: 'India' }, { country: 'China' }, { country: 'Thailand' }, { country: 'Turkey' }, { country: 'Spain' }, { country: 'UK' }, { country: 'West Africa' }, { country: 'Indonesia' }, { country: 'Greece' }, { country: 'Other' }]}
                      label='Country'
                      variable='country'
                      colour='bg-deep_blue'
                      onSelectionChange={(e) => setCountryNewsFormCountry(e.country)}
                      placeholder='Select Country'
                      searchPlaceholder='Search Countries'
                      includeLabel={false}
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='image'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Image (optional)
                    </label>
                    <input
                      type='text'
                      id='image'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter a url to an image e.g. https://picsum.photos/200'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='title'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Title
                    </label>
                    <input
                      type='text'
                      id='title'
                      className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500'
                      placeholder='Enter title'
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='text'
                      className='block text-gray-700 text-sm font-bold mb-2 pl-3'
                    >
                      Text
                    </label>
                    <textarea id='text' placeholder='Enter text' name='text' rows={6} cols={87} className='w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500' />
                  </div>

                  <div className='col-span-2 flex justify-center'>
                    {/* <button
                    type="submit"
                    className="bg-deep_blue hover:scale-105 duration-200 text-white font-bold py-2 px-12 rounded-xl"
                  >
                    Submit
                  </button> */}
                    <FormSubmit errorMessage={countryNewsError_Message} warningMessage={countryNewsWarning_Message} submitted={countryNewsSubmitted} submitting={countryNewsSubmitting} warningSubmit={countryNewsWarningSubmit} />
                  </div>
                </form>
              </div>
            </div>
            <div onClick={() => setOpenCountryNewsForm(false)} className='fixed inset-0 backdrop-blur-sm backdrop-brightness-75 z-10' />
          </div>
        </div>
      )}
    </div>
  )
}

export default InCountryNews
