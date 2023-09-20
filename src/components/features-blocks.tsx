

export default function FeaturesBlocks() {
    return (
        <section className=" relative overflow-hidden">
            <div className="-z-10 absolute inset-0 top-1/3 bg-gradient-to-r from-deep_blue to-navy pointer-events-none" aria-hidden="true"></div>


            {/* <div className="-z-10 absolute top-1/3  left-0 right-0">
                <div className="overflow-hidden h-1/2">

                    <img src="Rubbish_Border_Reverse.svg" alt="Complex Shape Divider" />
                </div>
            </div> */}

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="md:py-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h1 className="h2 text-xl mb-4">Increase revenue and reduce risk regardless of market conditions</h1>
                        {/* <p className="text-m text-gray-600">Macrovesta is more than price forecasting, it is price science. Designed to deliver insights and trading expertise in the context of the global commodity markets. Together with our research and analysis partners, we are modelling market patterns to provide real-time, actionable insights and risk management strategies.</p> */}
                    </div>

                    {/* Items */}
                    <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
                        <div className="h-fit relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/SortingTick_ISO.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Live AI market forecasting, insights and alerts</h4>
                            {/* <p className="text-gray-600 text-center">Download reports and recycling certificates for compliance and marketing</p> */}
                        </div>
                        {/* 1st item */}
                        <div className="h-fit relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Sorted_Iso.png" alt="Waste Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Multilingual Deep Learning AI translated platform</h4>
                            {/* <p className="text-gray-600 text-center">Get traceability on your product or material waste streams and their recycling </p> */}
                        </div>

                        {/* 2nd item */}
                        <div className="h-fit relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Emissions_Iso.png" alt="Emissions Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Leading industry expert reports</h4>
                            {/* <p className="text-gray-600 text-center">Measure the carbon emissions of your product consumption and waste </p> */}
                        </div>

                        {/* 3rd item */}
                        <div className="h-fit relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Emissions_Saving_Iso.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Position management consultations</h4>
                            {/* <p className="text-gray-600 text-center">Get help to improve your recycling rates and reduce your carbon footprint</p> */}
                        </div>

                        {/* 4th item */}
                        <div className="h-fit relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className=" h-[100px] p-3" src="/hero-image.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Analysis & reporting tools for independent research</h4>
                            {/* <p className="text-gray-600 text-center">See your impact in real time, monitor your improvement and set company goals </p> */}
                        </div>

                        {/* 5th item */}
                        <div className="h-fit relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Upload_ISO_SQ.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Library of learning tools and deep-dive studies</h4>
                            {/* <p className="text-gray-600 text-center">Use our easy forms, or simplify your waste tracking with automated API data submission</p> */}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
