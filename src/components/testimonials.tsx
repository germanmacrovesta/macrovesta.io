import Image from 'next/image'
import FadeInImage from './fadeInImage'
// import TestimonialImage from '../../public/Jordie-09.png'

export default function Testimonials () {
  return (
        <section className="relative">

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">

                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h2 className="h2 text-xl mb-4">Trusted by clients across the supply chain in 14 countries and 5 continents</h2>
                        <p className="text-m text-gray-600" data-aos="zoom-y-out">Over the last decade the Macrovesta team have delivered world-reknowned commodity market consultancy to some of the largest farms, mills and retailers in the world. Through Macrovesta we are making our expertise and crititcal analysis available to organisations of all sizes.</p>
                    </div>

                    <div className="h-fit  mx-auto relative">
                        <img className='absolute inset-0' src='/Maps_Map_Background.svg' />
                        <FadeInImage imageUrl={'/Maps_Map_Pins.svg'} hasShadow={false} />
                        {/* <img className='absolute inset-0 opacity-0' src='/Maps_Map_Pins.svg' /> */}

                        {/* <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Huhtamaki" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Budweiser" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="ABinBev" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500 opacity-75" src="/Logo_Colour.svg" width={150} height={112} alt="ISS" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Mojo" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500 opacity-75" src="/Logo_Colour.svg" width={150} height={112} alt="LOC7000" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="The One Project" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Indorama Ventures" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Weston Pride" />
                        </div>

                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Grist Environmental" />
                        </div> */}

                    </div>

                    {/* Testimonials */}
                    <div className="max-w-3xl mx-auto mt-20" data-aos="zoom-y-out">
                        <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">

                            {/* Testimonial */}
                            <div className="text-center px-4 md:px-12 py-8 pt-20 mx-4 md:mx-0">
                                {/* <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
                                    <Image className="relative rounded-full" src={"Logo_Colour.svg"} width={96} height={96} alt="Testimonial 01" />
                                </div> */}
                                <blockquote className="text-sm md:text-xl font-medium mb-4">
                                    “With so many reports available in the market place it is refreshing to find one place that tells all! If you need to understand what is going on in the cotton market, which direction prices are headed to next or an explanation of a report that you may not fully understand then there is really only one place to go. Statistical and Technical analysis can often be confusing and Macrovesta seem to make sense of it all! We love the new platform!”
                                </blockquote>
                                {/* <cite className="block font-bold text-lg not-italic mb-1">Jordie Brouwer</cite> */}
                                <div className="text-gray-600">
                                    <span>Cotton Spinner, Bangladesh</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
  )
}
