

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
                        <h1 className="h2 text-xl mb-4">Track Your Circular Journey</h1>
                        <p className="text-m text-gray-600">Embrace circularity effortlessly with The Rubbish Portal. Transitioning to a 100% circular model might seem daunting, but our innovative software paves the way for your business. Assess, enhance, and propel your journey with us.</p>
                    </div>

                    {/* Items */}
                    <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
                        {/* 1st item */}
                        <div className="h-[155px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Sorted_Iso.png" alt="Waste Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Measure Recycling Rates</h4>
                            <p className="text-gray-600 text-center">Get traceability on your product or material waste streams and their recycling </p>
                        </div>

                        {/* 2nd item */}
                        <div className="h-[155px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Emissions_Iso.png" alt="Emissions Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">GHG Carbon Tracking</h4>
                            <p className="text-gray-600 text-center">Measure the carbon emissions of your product consumption and waste </p>
                        </div>

                        {/* 3rd item */}
                        <div className="h-[155px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Emissions_Saving_Iso.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Expert Circularity Guidance</h4>
                            <p className="text-gray-600 text-center">Get help to improve your recycling rates and reduce your carbon footprint</p>
                        </div>

                        {/* 4th item */}
                        <div className="h-[155px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className=" h-[100px] p-3" src="/hero-image.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Live Results Dashboard</h4>
                            <p className="text-gray-600 text-center">See your impact in real time, monitor your improvement and set company goals </p>
                        </div>

                        {/* 5th item */}
                        <div className="h-[155px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/Upload_ISO_SQ.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Upload Data</h4>
                            <p className="text-gray-600 text-center">Use our easy forms, or simplify your waste tracking with automated API data submission</p>
                        </div>

                        {/* 6th item */}
                        <div className="h-[155px] relative flex flex-col items-center p-6 bg-white rounded shadow-xl border border-grey-100 hover:scale-105 duration-500 ">
                            {/* <div>
                                <img className="h-[100px] w-[100px]" src="/SortingTick_ISO.png" alt="Emissions Saving Icon" />
                            </div> */}
                            <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Certificates & Reports</h4>
                            <p className="text-gray-600 text-center">Download reports and recycling certificates for compliance and marketing</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
