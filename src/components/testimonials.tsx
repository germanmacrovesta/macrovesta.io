import Image from 'next/image'
// import TestimonialImage from '../../public/Jordie-09.png'

export default function Testimonials() {
    return (
        <section className="relative">

            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">

                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h2 className="h2 text-xl mb-4">Trusted by venues and supply chain stakeholders all over the world</h2>
                        <p className="text-m text-gray-600" data-aos="zoom-y-out">We’re working with companies throughout the supply chain. From packaging manufacturers to drinks companies, from sports venues to festival organisers, from office buildings to train stations and from material suppliers to waste processors we are able to help with circular economy solutions.</p>
                    </div>

                    {/* Items */}
                    <div className="max-w-sm md:max-w-4xl mx-auto grid gap-2 grid-cols-4 md:grid-cols-5">

                        {/* Item 2*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Huhtamaki" />
                        </div>

                        {/* Item 3*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Budweiser" />
                        </div>

                        {/* Item 4*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="ABinBev" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500 opacity-75" src="/Logo_Colour.svg" width={150} height={112} alt="ISS" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Mojo" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500 opacity-75" src="/Logo_Colour.svg" width={150} height={112} alt="LOC7000" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="The One Project" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Indorama Ventures" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Weston Pride" />
                        </div>

                        {/* Item 5*/}
                        <div className="flex items-center justify-center py-2 col-span-2 md:col-auto">
                            <Image className="relative rounded-full hover:scale-105 animation duration-500" src="/Logo_Colour.svg" width={150} height={112} alt="Grist Environmental" />
                        </div>

                    </div>

                    {/* Testimonials */}
                    <div className="max-w-3xl mx-auto mt-20" data-aos="zoom-y-out">
                        <div className="relative flex items-start border-2 border-gray-200 rounded bg-white">

                            {/* Testimonial */}
                            <div className="text-center px-4 md:px-12 py-8 pt-20 mx-4 md:mx-0">
                                <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2">
                                    <Image className="relative rounded-full" src={"Logo_Colour.svg"} width={96} height={96} alt="Testimonial 01" />
                                </div>
                                <blockquote className="text-sm md:text-xl font-medium mb-4">
                                    “Amazing things happen by collaboration. Partnering with The Rubbish Project is an innovative journey how to redefine end of life with production in mind and stop treating things as waste but treat them as valuable raw material/building blocks for something new. Or as they say it, if we don’t end waste now we will have a rubbish future“
                                </blockquote>
                                <cite className="block font-bold text-lg not-italic mb-1">Jordie Brouwer</cite>
                                <div className="text-gray-600">
                                    <span>Business Development Manager</span> <a className="text-blue-600 hover:underline" href="https://www.huhtamaki.com/">@Huhtamaki</a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}