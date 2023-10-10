import { useState, useRef, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
// import FeaturesBg from '../public/features-bg.png'
// import FeaturesElement from '../public/features-element.png'

export default function Features () {
  const [tab, setTab] = useState<number>(1)

  const tabs = useRef<HTMLDivElement>(null)

  const heightFix = () => {
    if (tabs.current && tabs.current.parentElement) tabs.current.parentElement.style.height = `${tabs.current.clientHeight}px`
  }

  useEffect(() => {
    heightFix()
  }, [])

  return (
        <section className="relative mb-8 lg:mb-0">

            {/* Section background (needs .relative class on parent and next sibling elements) */}
            <div className="absolute inset-0 bg-gray-100 pointer-events-none mb-16" aria-hidden="true"></div>
            <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-12 md:pt-20">

                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                        <h1 className="h2 text-xl mb-4">Explore the solutions</h1>
                        <p className="text-m text-gray-600">With our expertise and years of experience working with venues, manufacturers, distributors, and waste managers, we complete the lifecycle of materials and provide a comprehensive solution for your waste management needs.</p>
                    </div>

                    {/* Section content */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">

                        {/* Content */}
                        <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6" data-aos="fade-right">
                            {/* <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                <h3 className="h3 mb-3">Powerful suite of tools</h3>
                <p className="text-xl text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa.</p>
              </div> */}
                            {/* Tabs buttons */}
                            <div className="mb-8 md:mb-0">
                                <a
                                    className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 1 ? 'bg-white shadow-md border-gray-200 hover:shadow-lg' : 'bg-gray-200 border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(1) }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1">Streamline Waste Management Across Multiple Venues</div>
                                        <div className="text-gray-600">Efficiently manage waste across multiple venues with Rubbish Portal. Track, set targets, and optimise recycling and disposal processes for event organisers and facility managers.</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 2 ? 'bg-white shadow-md border-gray-200 hover:shadow-lg' : 'bg-gray-200 border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(2) }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1">Enhanced Waste Traceability for Distributors, Manufacturers, and Waste Managers</div>
                                        <div className="text-gray-600">Achieve end-to-end waste traceability with Rubbish Portal. Track waste from origin to disposal, ensuring compliance and optimizing waste reduction for distributors, manufacturers, and waste managers.</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z" fillRule="nonzero" />
                                        </svg>
                                    </div>
                                </a>
                                <a
                                    className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${tab !== 3 ? 'bg-white shadow-md border-gray-200 hover:shadow-lg' : 'bg-gray-200 border-transparent'}`}
                                    href="#0"
                                    onClick={(e) => { e.preventDefault(); setTab(3) }}
                                >
                                    <div>
                                        <div className="font-bold leading-snug tracking-tight mb-1">Foster Collaborative Waste Management Efforts</div>
                                        <div className="text-gray-600">Rubbish Portal facilitates collaboration among stakeholders, allowing seamless waste management across the supply chain. Connect with partners, share data, and collectively work towards sustainable waste reduction goals, driving positive environmental change together.</div>
                                    </div>
                                    <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z" fill="#191919" fillRule="nonzero" />
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Tabs items */}
                        <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1">
                            <div className="transition-all">
                                <div className="relative flex flex-col text-center lg:text-right" data-aos="zoom-y-out" ref={tabs}>
                                    {/* Item 1 */}
                                    <Transition
                                        show={tab === 1}
                                        appear={true}
                                        className="w-full"
                                        enter="transition ease-in-out duration-700 transform order-first"
                                        enterFrom="opacity-0 translate-y-16"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in-out duration-300 transform absolute"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 -translate-y-16"
                                        beforeEnter={() => heightFix()}
                                        unmount={false}
                                    >
                                        <div className="relative inline-flex flex-col">
                                            <Image className="md:max-w-none mx-auto rounded" src={'/Full_Logo.svg'} width={500} height="462" alt="Features" />
                                            <Image className="md:max-w-none absolute w-full left-0 transform animate-float" src={'/Full_Logo.svg'} width={500} height="44" alt="Element" style={{ top: '30%' }} />
                                            {/* <Image className="md:max-w-none absolute w-[250px] left-[125px] transform animate-float" src={"/Deliveries_Iso.png"} width={500} height="44" alt="Element" style={{ top: '50%' }} /> */}
                                        </div>
                                    </Transition>
                                    {/* Item 2 */}
                                    <Transition
                                        show={tab === 2}
                                        appear={true}
                                        className="w-full"
                                        enter="transition ease-in-out duration-700 transform order-first"
                                        enterFrom="opacity-0 translate-y-16"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in-out duration-300 transform absolute"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 -translate-y-16"
                                        beforeEnter={() => heightFix()}
                                        unmount={false}
                                    >
                                        <div className="relative inline-flex flex-col">
                                            <Image className="md:max-w-none mx-auto rounded" src={'/Full_Logo.svg'} width={500} height="462" alt="Features bg" />
                                            <Image className="md:max-w-none absolute w-full left-0 transform animate-float" src={'/Full_Logo.svg'} width={500} height="44" alt="Element" style={{ top: '30%' }} />
                                        </div>
                                    </Transition>
                                    {/* Item 3 */}
                                    <Transition
                                        show={tab === 3}
                                        appear={true}
                                        className="w-full"
                                        enter="transition ease-in-out duration-700 transform order-first"
                                        enterFrom="opacity-0 translate-y-16"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in-out duration-300 transform absolute"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 -translate-y-16"
                                        beforeEnter={() => heightFix()}
                                        unmount={false}
                                    >
                                        <div className="relative inline-flex flex-col">
                                            <Image className="md:max-w-none mx-auto rounded" src={'/Full_Logo.svg'} width={500} height="462" alt="Features bg" />
                                            <Image className="md:max-w-none absolute w-full left-0 transform animate-float" src={'/Full_Logo.svg'} width={500} height="44" alt="Element" style={{ top: '30%' }} />
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
  )
}
