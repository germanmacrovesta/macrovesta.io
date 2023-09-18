import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';

const Header = ({ textColour = "text-white", textHoverColour = "hover:text-white", bannerGradient = "bg-gradient-to-r from-deep_blue to-navy" }) => {
    const router = useRouter();

    const [mobileHeaderOpen, setMobileHeaderOpen] = React.useState(false)

    const [homeOpen, setHomeOpen] = React.useState(false)
    const [aboutOpen, setAboutOpen] = React.useState(false)
    const [servicesOpen, setServicesOpen] = React.useState(false)
    const [contactOpen, setContactOpen] = React.useState(false)

    const closeDropdowns = () => {
        setHomeOpen(false)
        setAboutOpen(false)
        setServicesOpen(false)
        setContactOpen(false)
    }

    return (
        <>
            {mobileHeaderOpen && (
                <>
                    <div className='z-[100] absolute inset-0 -bottom-[1000px] bg-gray-500 bg-opacity-20 backdrop-blur-sm' onClick={(e) => { e.stopPropagation(); setMobileHeaderOpen(false); }}>
                        <div className='absolute flex flex-col overflow-y-auto justify-between right-0 top-[112px] bottom-[1000px] left-8 bg-white text-black py-8 rounded-l-xl' onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col justify-center space-y-4 items-left pl-8">
                                <div onClick={(e) => { e.stopPropagation(); closeDropdowns(); setHomeOpen(!homeOpen); }} className="flex justify-between text-center cursor-pointer pr-10">
                                    <div className='mr-1 text-xl font-semibold text-gray-700' onClick={(e) => { e.stopPropagation(); router.push('/') }}>
                                        Home
                                    </div>
                                    {/* <img className={`w-[15px] opacity-40 duration-300 scale-x-150 ${homeOpen ? "-scale-y-100" : ""}`} src="/ArrowDown_B_SQ.png" /> */}

                                </div>
                                {homeOpen && (
                                    <>
                                        {/* <div className='flex flex-col gap-y-2 ml-4'>
                                        <Link href="/introduction">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    How it works
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Description Text
                                                </div>
                                            </div>
                                        </Link>
                                    </div> */}
                                    </>
                                )}
                                <div onClick={(e) => { e.stopPropagation(); closeDropdowns(); setAboutOpen(!aboutOpen); }} className="flex justify-between text-center cursor-pointer pr-10">
                                    <div className='mr-1 text-xl font-semibold text-gray-700' onClick={(e) => { e.stopPropagation(); router.push('/about') }}>
                                        About
                                    </div>
                                    {/* <img className={`w-[15px] opacity-40 duration-300 scale-x-150 ${aboutOpen ? "-scale-y-100" : ""}`} src="/ArrowDown_B_SQ.png" /> */}

                                </div>
                                {/* {aboutOpen && (
                                    <div className='flex flex-col gap-y-2 ml-4'>
                                        <Link href="/about#our-commitment">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    Our Commitment
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Description Text
                                                </div>
                                            </div>
                                        </Link>
                                        <Link href="/about#about">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    Who We Are
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Description Text
                                                </div>
                                            </div>
                                        </Link>
                                        <Link href="/about#features">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    Key Features & Benefits
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Description Text
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )} */}
                                {/* <div onClick={(e) => { e.stopPropagation(); closeDropdowns(); setServicesOpen(!servicesOpen); }} className="flex justify-between text-center cursor-pointer pr-10">
                                    <div className='mr-1 text-xl font-semibold text-gray-700' onClick={(e) => { e.stopPropagation(); router.push('/services') }}>
                                        Services
                                    </div>
                                    <img className={`w-[15px] opacity-40 duration-300 scale-x-150 ${servicesOpen ? "-scale-y-100" : ""}`} src="/ArrowDown_B_SQ.png" />

                                </div> */}
                                {servicesOpen && (
                                    <div className='flex flex-col gap-y-2 ml-4'>
                                        <Link href="/services#rubbish-portal">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    Rubbish Portal
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Learn more and sign up to be a part of The Rubbish Portal
                                                </div>
                                            </div>
                                        </Link>
                                        <Link href="/services#circular-system-design">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    Circular System Design
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Create better systems with our circular consultancy
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                {/* <div onClick={(e) => { e.stopPropagation(); closeDropdowns(); setContactOpen(!contactOpen); }} className="flex justify-between text-center cursor-pointer pr-10">
                                    <div className='mr-1 text-xl font-semibold text-gray-700' onClick={(e) => { e.stopPropagation(); router.push('/contact') }}>
                                        Contact
                                    </div>

                                </div> */}
                                {contactOpen && (
                                    <>
                                        {/* <div className='flex flex-col gap-y-2 ml-4'>
                                        <Link href="/introduction">
                                            <div className="flex flex-col text-gray-700 hover:text-indigo-600 text-md ">
                                                <div className='text-black leading-tight font-[450]'>
                                                    How it works
                                                </div>
                                                <div className='text-xs leading-tight'>
                                                    Description Text
                                                </div>
                                            </div>
                                        </Link>
                                    </div> */}
                                    </>
                                )}
                                {/* <Link href="/about">
                                                        <div className={`${textColour} hover:text-indigo-600 text-md `}>
                                                            About
                                                        </div>
                                                    </Link>
                                                    <Link href="/services">
                                                        <div className={`${textColour} hover:text-indigo-600 text-md `}>
                                                            Services
                                                        </div>
                                                    </Link>
                                                    <Link href="/contact">
                                                        <div className={`${textColour} hover:text-indigo-600 text-md `}>
                                                            Contact
                                                        </div>
                                                    </Link> */}
                            </div>

                            <div className="flex flex-col justify-center items-center space-y-4 pt-4">
                                {/* <a href='/signup' className="text-white w-[150px] text-xl text-center select-none bg-gradient-to-r from-primary to-tertiary active:bg-primary active:text-white shadow-lg border rounded-lg py-1 hover:cursor-pointer hover:text-indigo-600">
                                    Sign up
                                </a> */}
                                <a href='/api/auth/signin' className="text-gray-600 w-[150px] text-xl text-center select-none bg-white active:bg-primary active:text-white shadow-lg border rounded-lg py-1 hover:cursor-pointer hover:text-indigo-600">
                                    Login
                                </a>

                                {/* <a href="/signup" className="py-2 hover:cursor-pointer px-4 mx-4 rounded text-white bg-gradient-to-r from-primary to-tertiary hover:shadow-lg">
                                                Signup
                                            </a> */}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <header className='z-[100] relative bg-transparent'>
                {/* <div className={`absolute inset-0 -bottom-40 z-20 pointer-events-none bg-gradient-to-b ${bannerGradient} to-transparent`}></div> */}
                <div className={`absolute inset-0 z-20 rounded-b-2xl pointer-events-none ${bannerGradient}`}></div>
                {/* <div className={`absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-primary from-10% via-secondary via-40% to-tertiary to-80%`}></div> */}
                {/* <div className='absolute inset-0 -bottom-36 z-20 pointer-events-none bg-gradient-to-b from-[#00a2c380] from-[#00000040] to-transparent'></div> */}
                <div className="z-50">
                    <div className=" flex -mb-[112px] justify-between items-center py-6 px-10 container mx-auto">
                        <div className='z-50'>
                            {/* <img src={"Portal_Logo.png"} className="h-16" /> */}
                            <img src={"/Full_Logo.svg"} className="h-16" />
                        </div>
                        <div className='z-50'>
                            <div className="cursor-pointer sm:hidden" onClick={() => setMobileHeaderOpen(!mobileHeaderOpen)}>
                                <span className="h-1 rounded-full block w-8 mb-1 bg-white"></span>
                                <span className="h-1 rounded-full block w-8 mb-1 bg-white"></span>
                                <span className="h-1 rounded-full block w-8 mb-1 bg-white"></span>
                                {/* <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                            <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span>
                            <span className="h-1 rounded-full block w-8 mb-1 bg-gradient-to-tr from-indigo-600 to-green-600"></span> */}
                            </div>
                            <div className="hidden sm:flex items-center">
                                <ul className="sm:flex space-x-4 hidden items-center">
                                    <Link href="/introduction">
                                        <p className={`${textColour} ${textHoverColour} text-md `}>
                                            Home
                                        </p>
                                    </Link>
                                    <Link href="/about">
                                        <p className={`${textColour} ${textHoverColour} text-md `}>
                                            About
                                        </p>
                                    </Link>
                                    {/* <li>
                                        <a href="/services" className={`${textColour} ${textHoverColour} text-md `}>
                                            Services
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/contact" className={`${textColour} ${textHoverColour} text-md `}>
                                            Contact
                                        </a>
                                    </li> */}
                                </ul>

                                <div className="md:flex items-center hidden space-x-4 ml-8 lg:ml-12">
                                    <a href="/api/auth/signin" className={`py-2 hover:cursor-pointer px-4 shadow-md rounded text-white font-semibold bg-[#ffffff30] hover:shadow-lg`}>
                                        Login
                                    </a>
                                    {/* <a href="/api/auth/signin" className={`${textColour} py-2 hover:cursor-pointer ${textHoverColour}`}>
                                        Login
                                    </a>

                                    <a href="/signup" className="py-2 hover:cursor-pointer px-4 shadow-md rounded text-white font-semibold bg-[#ffffff30] hover:shadow-lg">
                                        Signup Today
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header >
        </>
    );
};

export default Header;
