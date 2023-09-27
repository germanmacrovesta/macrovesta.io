import React from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";

const Footer = () => {
    return (

        <footer className="bg-gray-200">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0 flex items-center">
                        <a href="https://rubbishportal.com" className="flex items-center">
                            {/* <img src="/Full_Logo.svg" className="h-28 mr-3 invert -hue-rotate-90" alt="Rubbish Portal Logo" /> */}
                            <img src={"/Logo File-13.png"} className="h-28 object-fill" />
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase ">Connect</h2>
                            <ul className="text-gray-500  font-medium">
                                <li className="mb-4">
                                    <a href="https://eapconsult.com/" className="hover:underline ">EAP Consult</a>
                                </li>
                                {/* <li>
                                    <a href="/contact" className="hover:underline">Contact Us</a>
                                </li> */}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase ">Resources</h2>
                            <ul className="text-gray-500  font-medium">
                                {/* <li className="mb-4">
                                    <a href="/services" className="hover:underline">Services</a>
                                </li> */}
                                <li className="mb-4">
                                    <a href="/about" className="hover:underline">About Us</a>
                                </li>
                                {/* <li className="mb-4">
                                    <a href="/signup" className="hover:underline">Sign Up</a>
                                </li> */}
                                <li className='block sm:hidden'>
                                    <a href="/api/auth/signin" className=" items-center text-center text-gray-600 py-2 hover:cursor-pointer px-4 rounded bg-gradient-to-r from-primary to-tertiary hover:shadow-lg">
                                        Login
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase ">Legal</h2>
                            <ul className="text-gray-500  font-medium">
                                <li className="mb-4">
                                    <a href="/Privacy_Policy.pdf" className="hover:underline">Privacy Policy</a>
                                </li>
                                <li className="mb-4">
                                    <a href="/Terms_and_Conditions.pdf" className="hover:underline">Terms &amp; Conditions</a>
                                </li>
                                <li>
                                    <a href="/Acceptable_Use_Policy.pdf" className="hover:underline">Acceptable Use Policy</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center ">© 2023 <a href="https://macrovesta.ai" className="hover:underline">Macrovesta®</a> All Rights Reserved. Macrovesta is a website owned and operated by Earlam & Partners Ltd.
                    </span>
                    <a href="/api/auth/signin" className="ml-4 hidden sm:block items-center text-center py-2 hover:cursor-pointer px-4 rounded text-white bg-deep_blue hover:shadow-lg">
                        Login
                    </a>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
