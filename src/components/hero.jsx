import Image from 'next/image'
import AnimatedHeadline from './animatedHeadline'
// import DemoModal from './demoModal';
import Counter from './counter'
// import EndOfLifeDonut from './endOfLifeDonut';
// import DonutProgress from './donutProgress';
import React, { useState } from 'react'
import { useRouter } from 'next/router'

const Hero = ({ setIsModalOpen }) => {
  const router = useRouter()
  const customdynamicText = ['Processors ', 'Farmers', 'Merchants', 'Retailers']
  const customstaticText = 'AI-Powered Cotton Trading for'
  // const [isModalOpen, setIsModalOpen] = useState(router.query.demo == "true" ? true : false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
        <section className="relative w-full overflow-clip z-20 pt-20">
            <div className="relative mx-auto w-full">

                {/* Hero content */}
                <div className="relative z-20 pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Section header */}
                    <div className="pb-12 text-center md:pb-16 pr-8 pl-8">
                        {/* Pass customdynamicText and customDelay as props */}
                        <AnimatedHeadline dynamicText={customdynamicText} staticText={customstaticText} />
                        <div className="mx-auto max-w-3xl">
                            <p
                                className="mb-8 text-xl"
                                data-aos="zoom-y-out"
                                data-aos-delay="150"
                            >
                                Welcome to Macrovesta, your digital assistant for tailored market analysis services.
                            </p>
                            <div
                                className="mx-auto max-w-xs flex flex-col sm:flex-row sm:max-w-none sm:justify-center"
                                data-aos="zoom-y-out"
                                data-aos-delay="300"
                            >

                                {/* <a
                                    className="btn mb-4 w-full rounded-xl bg-deep_blue p-4 text-white hover:bg-gray-800 sm:mb-0 sm:w-auto"
                                    href="/services#rubbish-portal"
                                >
                                    How it works
                                </a> */}

                                <a
                                    className="btn w-full rounded-xl bg-deep_blue p-4 text-white hover:bg-gray-800 sm:ml-4 sm:w-auto"
                                    href="/contact"
                                >
                                    Get in touch
                                </a>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Illustration behind hero content */}
                <div className='z-10 relative'>
                    <div
                        className="relative mb-20 flex justify-center "
                        data-aos="zoom-y-out"
                        data-aos-delay="450"
                    >
                        <div className="grid place-content-center">
                            <div className="pointer-events-none absolute -top-[150%] -bottom-[150%] left-0 right-0  grid place-content-center overflow-clip">
                                <div className="flex">
                                    {/* <img
                                        src="/Logo_Colour.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-bottomleft"
                                    />
                                    <img
                                        src="/Logo_Colour.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-bottomright"
                                    /> */}
                                    <img
                                        src="/ICONS_Live Market Forecasting.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-topleft"
                                    />
                                    <img
                                        src="/ICONS_Multilingual.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-left"
                                    />
                                    <img
                                        src="/ICONS_Expert Reports.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-insideright"
                                    />
                                    <img
                                        src="/ICONS_Position Management.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-right"
                                    />
                                    <img
                                        src="/ICONS_Analysis Tools.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-topright"
                                    />
                                    <img
                                        src="/ICONS_Learning Tools Icon.svg"
                                        width="50px"
                                        height="50px"
                                        className="animate-insideleft"
                                    />

                                </div>
                            </div>
                            {/* laptop image here */}
                            <Image className="animate-contract"
                                src="/Isometric Macrovesta Images_AI Market Prediction.png"
                                width={768}
                                height={432}
                                alt="Modal video thumbnail"
                            />

                        </div>
                        <div id="demo" className="">
                            <button
                                className="group absolute left-1/2 bottom-2 transform -translate-x-1/2 bg-white p-4 text-sm md:text-base font-medium animation duration-200 hover:scale-110 shadow-md flex items-center rounded-full space-x-3"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <svg
                                    className="h-6 w-6 fill-current text-gray-400 group-hover:text-blue-600 mr-2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
                                    <path d="M10 17l6-5-6-5z" />
                                </svg>
                                <span>Book a demo</span>
                            </button>

                            {/* Pass the triggerButton prop to DemoModal */}
                            {/* <DemoModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              /> */}
                        </div>
                    </div>
                </div>

                {/* second illustration */}
                {/* <div className='-z-10 pointer-events-none hidden sm:block relative '>

                    <div className="opacity-0 absolute w-[200px] h-[200px] pointer-events-none animate-fade-grow-l bottom-[125px] left-56 mt-8 ml-8 @container order-2 group/delivered flex flex-col place-content-center border bg-white rounded-2xl shadow-lg p-4 ">
                        <img className="self-center w-[100px] animate-grow group-hover/delivered:scale-110 duration-300" src="/ProductsCollected_Iso.png" />
                        <div className="flex justify-center gap-4">
                            <div className='flex flex-col @[18rem]:flex-row @[18rem]:items-end justify-center text-center'>
                                <div>
                                    <Counter className=' text-3xl' targetValue={95} duration={25000} />
                                    <span className="text-1xl font-semibold">&nbsp;%</span>
                                    <span className="@[18rem]:inline hidden">&nbsp;</span>
                                </div>
                                <span className="text-1xl order-first @[18rem]:-order-first font-semibold text-center">{"Product Capture"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-0 absolute w-[200px] h-[200px] pointer-events-none animate-fade-grow-l bottom-[425px] left-56 mt-8 ml-8 @container order-2 group/delivered flex flex-col place-content-center border bg-white rounded-2xl shadow-lg p-4 ">
                        <img className="self-center w-[100px] animate-grow group-hover/collected:scale-110 duration-300" src="/Waste_Iso.png" />
                        <div className="flex justify-center gap-4">
                            <div className='flex flex-col @[18rem]:flex-row @[18rem]:items-end justify-center text-center'>
                                <div>
                                    <Counter className='self-center text-3xl' targetValue={9900} duration={90000} />
                                    <span className="text-1xl font-semibold">&nbsp;kg</span>
                                    <span className="@[18rem]:inline hidden">&nbsp;</span>
                                </div>
                                <span className="text-1xl order-first @[18rem]:-order-first font-semibold text-center">{"Waste Collected"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-0 absolute w-[200px] h-[200px] pointer-events-none animate-fade-grow-r bottom-[425px] right-56 mt-8 ml-8 @container order-2 group/delivered flex flex-col place-content-center border bg-white rounded-2xl shadow-lg p-4 ">
                        <img className="self-center w-[100px] animate-grow group-hover/sorted:scale-110 duration-300" src="/Sorting_Iso.png" />
                        <div className="flex justify-center gap-4">
                            <div className='flex flex-col @[18rem]:flex-row @[18rem]:items-end justify-center text-center'>
                                <div>
                                    <Counter className='self-center text-3xl' targetValue={90205} duration={90000} />
                                    <span className="text-1xl font-semibold">&nbsp;kg</span>
                                    <span className="@[18rem]:inline hidden">&nbsp;</span>
                                </div>
                                <span className="text-1xl order-first @[18rem]:-order-first font-semibold text-center">{"Waste Sorted"}</span>
                            </div>
                        </div>
                    </div>

                </div> */}

            </div>

        </section>
  )
}

export default Hero
