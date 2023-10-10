import Image from 'next/image'

export default function FeaturesBlocks () {
  return (
        <section className=" relative overflow-hidden">

            {/* <div className="-z-10 absolute top-1/3  left-0 right-0">
                <div className="overflow-hidden h-1/2">

                <img src="Rubbish_Border_Reverse.svg" alt="Complex Shape Divider" />
                </div>
            </div> */}

            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-12 px-4">
                <h1 className="h2 text-xl mb-4">Increase revenue and reduce risk regardless of market conditions</h1>
                <p className="text-m text-gray-600">Macrovesta is more than price forecasting, it is price science. Designed to deliver insights and trading expertise in the context of the global commodity markets. Together with our research and analysis partners, we are modelling market patterns to provide real-time, actionable insights and risk management strategies.</p>
            </div>
            <div className="relative z-10 w-full bg-deep_blue pointer-events-none py-4" aria-hidden="true">
                {/* <div className="absolute bottom-full translate-y-1 z-50 left-0 right-0">
                    <div className="">
                        <img style={{ height: '200px', width: '100%' }} className="object-cover" src="/Wave_Navy.svg" />
                    </div>
                </div> */}
                {/* <div className="relative z-10 px-4 sm:px-6 grid grid-cols-[auto_800px]"> */}
                <div className="relative z-10 px-4 sm:px-6 flex flex-col">
                    {/* <div className="relative w-full">
                        <Image fill={true} src={"/Isometric Macrovesta Images_AI Market Prediction.svg"} alt="macrovesta board meeting image" />
                        <img className="object-fill" src={"/Isometric Macrovesta Images_AI Market Prediction.svg"} alt="macrovesta board meeting image" />
                    </div> */}
                    <div className="md:py-20 w-full xl:w-full self-center">
                        {/* Section header */}

                        {/* Items */}
                        <div className="w-full xl:w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-start">
                            <div className="h-[210px] lg:h-[230px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 text-center ">
                                {/* <div>
                                <img className="h-[100px] w-[100px]" src="/SortingTick_ISO.png" alt="Emissions Saving Icon" />
                            </div> */}
                                <Image width={100} height={100} src={'/ICONS_Live Market Forecasting.svg'} alt="macrovesta board meeting image" />
                                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Live AI market forecasting, insights and alerts</h4>
                                {/* <p className="text-gray-600 text-center">Download reports and recycling certificates for compliance and marketing</p> */}
                            </div>
                            {/* 1st item */}
                            <div className="h-[210px] lg:h-[230px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 text-center ">
                                {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Sorted_Iso.png" alt="Waste Icon" />
                            </div> */}
                                <Image width={100} height={100} src={'/ICONS_Multilingual.svg'} alt="macrovesta board meeting image" />
                                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Multilingual Deep Learning AI translated platform</h4>
                                {/* <p className="text-gray-600 text-center">Get traceability on your product or material waste streams and their recycling </p> */}
                            </div>

                            {/* 2nd item */}
                            <div className="h-[210px] lg:h-[230px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 text-center ">
                                {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Emissions_Iso.png" alt="Emissions Icon" />
                            </div> */}
                                <Image width={100} height={100} src={'/ICONS_Expert Reports.svg'} alt="macrovesta board meeting image" />
                                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Leading industry expert reports</h4>
                                {/* <p className="text-gray-600 text-center">Measure the carbon emissions of your product consumption and waste </p> */}
                            </div>

                            {/* 3rd item */}
                            <div className="h-[210px] lg:h-[230px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 text-center ">
                                {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Emissions_Saving_Iso.png" alt="Emissions Saving Icon" />
                            </div> */}
                                <Image width={100} height={100} src={'/ICONS_Position Management.svg'} alt="macrovesta board meeting image" />
                                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Position management consultations</h4>
                                {/* <p className="text-gray-600 text-center">Get help to improve your recycling rates and reduce your carbon footprint</p> */}
                            </div>

                            {/* 4th item */}
                            <div className="h-[210px] lg:h-[230px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 text-center ">
                                {/* <div>
                                <img className=" h-[100px] p-3" src="/hero-image.png" alt="Emissions Saving Icon" />
                            </div> */}
                                <Image width={100} height={100} src={'/ICONS_Analysis Tools.svg'} alt="macrovesta board meeting image" />
                                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Analysis & reporting tools for independent research</h4>
                                {/* <p className="text-gray-600 text-center">See your impact in real time, monitor your improvement and set company goals </p> */}
                            </div>

                            {/* 5th item */}
                            <div className="h-[210px] lg:h-[230px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 text-center ">
                                {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Upload_ISO_SQ.png" alt="Emissions Saving Icon" />
                            </div> */}
                                <Image width={100} height={100} src={'/ICONS_Learning Tools Icon.svg'} alt="macrovesta board meeting image" />
                                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Library of learning tools and deep-dive studies</h4>
                                {/* <p className="text-gray-600 text-center">Use our easy forms, or simplify your waste tracking with automated API data submission</p> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
  )
}
