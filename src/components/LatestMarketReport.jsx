import InfoButton from './infoButton'

const LatestMarketReport = ({ conclusionData, cottonReportURLData, currentLang }) => {
  return (
    <div className='relative flex flex-col bg-[#ffffff] p-4 rounded-xl m-8 shadow-lg'>
      <InfoButton text='A quick shortcut to our latest market report as well as the conclusion of the report. ' />
      <div className='grid grid-cols-1'>
        <div className='relative flex flex-col gap-y-6 items-center px-8'>
          <div className='text-left font-semibold text-lg'>Conclusion of latest market report</div>
          <div>{JSON.parse(conclusionData)?.text}</div>
          <a href={JSON.parse(cottonReportURLData).find((report) => report.language === currentLang)?.url ?? JSON.parse(cottonReportURLData).find((report) => report.language === 'en')?.url} className='px-12 py-2 shadow-lg rounded-lg border text-center w-fit bg-deep_blue text-white cursor-pointer'>Cotton Market Report Link</a>
          {/* <div>{currentLang}</div> */}
        </div>
        {/* <div className="flex flex-col gap-4">
        <div className="px-3 py-2 shadow-lg rounded-lg border text-center">Cotton Market Report Link</div>
        <div className="grid place-content-center w-full">
        <img src="https://mcusercontent.com/672ff4ca3cd7768c1563b69f0/images/697840bb-da2a-35c5-28b6-237954d8b369.png" className="rounded-lg w-full" />
        </div>
      </div> */}
      </div>
    </div>
  )
}

export default LatestMarketReport
