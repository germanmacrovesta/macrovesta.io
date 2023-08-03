// // // import React, { useState, useRef, useEffect } from 'react';
// // // // import './multipleSelectDropdown.css';

// // // const MultipleSelectDropdown = ({
// // //     options,
// // //     variable,
// // //     label,
// // //     onSelectionChange,
// // //     placeholder = 'Select Products',
// // //     searchPlaceholder = 'Search Products',
// // //     theme = 'default',
// // // }) => {
// // //     const [isOpen, setIsOpen] = useState(false);
// // //     const [isTooltipVisible, setIsTooltipVisible] = useState(false);
// // //     const [selectedOptions, setSelectedOptions] = useState([]);
// // //     const [searchText, setSearchText] = useState('');
// // //     const [filteredOptions, setFilteredOptions] = useState(options);
// // //     const wrapperRef = useRef(null);

// // //     useEffect(() => {
// // //         setFilteredOptions(
// // //             options.filter((option) =>
// // //                 option[`${variable}`].toLowerCase().includes(searchText.toLowerCase()),
// // //             ),
// // //         );
// // //     }, [options, searchText]);

// // //     useEffect(() => {
// // //         function handleClickOutside(event) {
// // //             if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
// // //                 setIsOpen(false);
// // //                 setSearchText('');
// // //             }
// // //         }

// // //         document.addEventListener('mousedown', handleClickOutside);
// // //         return () => {
// // //             document.removeEventListener('mousedown', handleClickOutside);
// // //         };
// // //     }, [wrapperRef]);

// // //     const handleOptionClick = (option) => {
// // //         if (selectedOptions.some((selected) => selected[`${variable}`] === option[`${variable}`])) {
// // //             setSelectedOptions((prevSelected) =>
// // //                 prevSelected.filter((selected) => selected[`${variable}`] !== option[`${variable}`]),
// // //             );
// // //         } else {
// // //             setSelectedOptions((prevSelected) => [...prevSelected, option]);
// // //         }
// // //         // onSelectionChange(selectedOptions);
// // //     };

// // //     const handleSearchChange = (event) => {
// // //         setSearchText(event.target.value);
// // //     };

// // //     const getDisplayText = () => {
// // //         const displayText = selectedOptions.map((option) => option[`${variable}`]).join(', ');

// // //         return displayText.length > 20 ? `${displayText.slice(0, 20)}...` : displayText;
// // //     };

// // //     useEffect(() => {
// // //         onSelectionChange(selectedOptions);
// // //     }, [selectedOptions, onSelectionChange]);

// // //     return (
// // //         <>
// // //             <div className="relative inline-block mr-16" ref={wrapperRef}>
// // //                 <div className='flex my-3  justify-between rounded-lg shadow-[inset_0_0px_8px_0px_#f6f6f6]'>
// // //                     <div className='px-8 py-2'>
// // //                         <label htmlFor={label}>{label}</label>
// // //                     </div>
// // //                     <div className='relative grid place-content-center min-w-[300px] rounded-lg shadow-[inset_0_0px_8px_0px_#f6f6f6]'>
// // //                         <button type='button'
// // //                             onClick={() => setIsOpen(!isOpen)}
// // //                             onMouseEnter={() => setIsTooltipVisible(true)}
// // //                             onMouseLeave={() => setIsTooltipVisible(false)}
// // //                             className="capitalize w-[300px]"
// // //                         >
// // //                             {selectedOptions.length === 0 ? placeholder : getDisplayText()}
// // //                         </button>
// // //                         {isTooltipVisible && selectedOptions.length != 0 && (
// // //                             <div className="capitalize absolute z-20 top-full w-[300px] text-center left-0 mt-1 p-2 bg-black bg-opacity-80 text-white text-xs rounded">
// // //                                 {selectedOptions.map((option) => option[`${variable}`]).join(', ')}
// // //                             </div>
// // //                         )}
// // //                         {isOpen && (
// // //                             <div className="absolute top-full -translate-y-2 z-50 mt-2 bg-[#f6f6f6] text-black w-[300px] rounded-lg shadow-lg">
// // //                                 <input
// // //                                     type="text"
// // //                                     placeholder={searchPlaceholder}
// // //                                     value={searchText}
// // //                                     onChange={handleSearchChange}
// // //                                     className="text-center bg-[#f6f6f6] border-b border-grey w-full px-3 py-2 rounded-t-lg"
// // //                                 />
// // //                                 <ul className="max-h-60 overflow-y-auto">
// // //                                     {filteredOptions.map((option) => (
// // //                                         <li
// // //                                             key={option[`${variable}`]}
// // //                                             onClick={() => handleOptionClick(option)}
// // //                                             className={`text-center capitalize px-3 cursor-pointer ${selectedOptions.some((selected) => selected[`${variable}`] === option[`${variable}`])
// // //                                                 ? 'bg-[#7571e1] text-white'
// // //                                                 : ''
// // //                                                 }`}
// // //                                         >
// // //                                             {option[`${variable}`]}
// // //                                         </li>
// // //                                     ))}
// // //                                 </ul>
// // //                             </div>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //         </>
// // //     );
// // // };

// // // export default MultipleSelectDropdown;

import React, { useState, useRef, useEffect } from 'react';

const defaultFunction = (e) => {

}

const MultipleSelectDropdown = ({
    options,
    variable,
    label,
    onSelectionChange = defaultFunction,
    placeholder = 'Select Products',
    searchPlaceholder = 'Search Products',
    router = undefined,
    urlPath = undefined,
    addButton = false,
    theme = 'default',
    includeLabel = true,
    addLabel = `Add ${label}`,
    colour = 'bg-green',
    defaultValue = "Default Value", // Add the defaultValue prop
    textCenter = true,
    textColour = "text-white",
    border = false,
    borderStyle = "border border-grey"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setFilteredOptions(
            options.filter((option) =>
                option[`${variable}`]?.toLowerCase().includes(searchText.toLowerCase()),
            ),
        );
        console.log("A")
    }, [options, searchText]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchText('');
            }
        }
        console.log("B")
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleOptionClick = (option) => {
        if (selectedOptions.some((selected) => selected[`${variable}`] === option[`${variable}`])) {
            setSelectedOptions((prevSelected) =>
                prevSelected.filter((selected) => selected[`${variable}`] !== option[`${variable}`]),
            );
        } else {
            setSelectedOptions((prevSelected) => [...prevSelected, option]);
        }
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    const getDisplayText = () => {
        const displayText = selectedOptions.map((option) => option[`${variable}`]).join(', ');

        return displayText.length > 20 ? `${displayText.slice(0, 20)}...` : displayText;
    };

    const prevSelectedOptionsRef = useRef();

    useEffect(() => {
        // onSelectionChange(selectedOptions);
        if (selectedOptions && prevSelectedOptionsRef.current !== selectedOptions) {
            onSelectionChange(selectedOptions);
        }
        prevSelectedOptionsRef.current = selectedOptions;
        console.log("C")
    }, [selectedOptions, onSelectionChange]);

    return (
        <>
            <div className={`relative flex w-full ${includeLabel ? 'mr-16' : ''}`} ref={wrapperRef}>
                {addButton && includeLabel && router != undefined && urlPath != undefined && (
                    <button type='button' onClick={() => router.push(urlPath)} className=" bg-white px-4 my-3 py-2 text-black rounded-lg text-xs mr-4">{addLabel}</button>
                )}
                <div className={`flex ${colour} w-full justify-between rounded-lg `}>
                    {includeLabel && (
                        <div className='px-8 py-2'>
                            <label htmlFor={label}>{label}</label>
                        </div>
                    )}
                    <div className={`relative w-full rounded-lg `}>
                        <button type='button'
                            onClick={() => setIsOpen(!isOpen)}
                            onMouseEnter={() => setIsTooltipVisible(true)}
                            onMouseLeave={() => setIsTooltipVisible(false)}
                            className={`w-full h-full capitalize truncate ${textColour} font-semibold ${border ? `${borderStyle}` : ``} ${includeLabel ? '' : ` py-2 ${textCenter ? 'text-center px-4' : 'text-left px-3'} appearance-none`}`}
                        >
                            {selectedOptions.length === 0 ? placeholder : selectedOptions.map((option) => option[`${variable}`]).join(', ')}
                        </button>
                        {isTooltipVisible && selectedOptions.length != 0 && (
                            <div className="capitalize absolute z-20 top-full text-center left-0 mt-1 p-2 bg-black bg-opacity-80 text-white text-xs rounded">
                                {selectedOptions.map((option) => option[`${variable}`]).join(', ')}
                            </div>
                        )}
                        {isOpen && (
                            <div className="absolute top-full -translate-y-2 z-50 mt-2 bg-[#f6f6f6] text-black w-full rounded-lg shadow-lg">
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchText}
                                    onChange={handleSearchChange}
                                    className="text-center bg-[#f6f6f6] border-b border-grey w-full px-3 py-2 rounded-t-lg"
                                />
                                <ul className="max-h-60 overflow-y-auto">
                                    {filteredOptions.map((option) => (
                                        <li
                                            key={option[`${variable}`]}
                                            onClick={() => handleOptionClick(option)}
                                            className={`select-none text-center capitalize px-3 cursor-pointer ${selectedOptions.some((selected) => selected[`${variable}`] === option[`${variable}`])
                                                ? 'bg-[#7571e1] text-white'
                                                : ''
                                                }`}
                                        >
                                            {option[`${variable}`]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MultipleSelectDropdown;

// import React, { useState, useRef, useEffect } from 'react';

// const MultipleSelectDropdown = ({
//     options,
//     variable,
//     label,
//     onSelectionChange,
//     placeholder = 'Select Products',
//     searchPlaceholder = 'Search Products',
//     theme = 'default',
//     includeLabel = true,
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isTooltipVisible, setIsTooltipVisible] = useState(false);
//     const [selectedOptions, setSelectedOptions] = useState([]);
//     const [searchText, setSearchText] = useState('');
//     const [filteredOptions, setFilteredOptions] = useState(options);
//     const wrapperRef = useRef(null);

//     useEffect(() => {
//         setFilteredOptions(
//             options.filter((option) =>
//                 option[`${variable}`].toLowerCase().includes(searchText.toLowerCase()),
//             ),
//         );
//     }, [options, searchText]);

//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//                 setIsOpen(false);
//                 setSearchText('');
//             }
//         }

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [wrapperRef]);

//     const handleOptionClick = (option) => {
//         if (selectedOptions.some((selected) => selected[`${variable}`] === option[`${variable}`])) {
//             setSelectedOptions((prevSelected) =>
//                 prevSelected.filter((selected) => selected[`${variable}`] !== option[`${variable}`]),
//             );
//         } else {
//             setSelectedOptions((prevSelected) => [...prevSelected, option]);
//         }
//     };

//     const handleSearchChange = (event) => {
//         setSearchText(event.target.value);
//     };

//     const getDisplayText = () => {
//         const displayText = selectedOptions.map((option) => option[`${variable}`]).join(', ');

//         return displayText.length > 20 ? `${displayText.slice(0, 20)}...` : displayText;
//     };

//     useEffect(() => {
//         onSelectionChange(selectedOptions);
//     }, [selectedOptions, onSelectionChange]);

//     return (
//         <>
//             <div className={`relative inline-block mr-16 ${includeLabel ? '' : 'my-2'}`} ref={wrapperRef}>
//                 {includeLabel && (
//                     <div className='flex my-3 justify-between rounded-lg shadow-[inset_0_0px_8px_0px_#f6f6f6]'>
//                         <div className='px-8 py-2'>
//                             <label htmlFor={label}>{label}</label>
//                         </div>
//                     </div>
//                 )}
//                 <div
//                     className={`relative grid place-content-center min-w-[300px] rounded-lg ${includeLabel ? 'shadow-[inset_0_0px_8px_0px_#f6f6f6]' : 'shadow-[inset_0_0px_4px_0px_#B2B2B2]'
//                         }`}
//                 >
//                     <button
//                         type='button'
//                         onClick={() => setIsOpen(!isOpen)}
//                         onMouseEnter={() => setIsTooltipVisible(true)}
//                         onMouseLeave={() => setIsTooltipVisible(false)}
//                         className={`capitalize w-[300px] ${includeLabel ? '' : 'bg-transparent h-full px-4 py-4 text-left appearance-none'}`}
//                     >
//                         {selectedOptions.length === 0 ? placeholder : getDisplayText()}
//                     </button>
//                     {isTooltipVisible && selectedOptions.length != 0 && (
//                         <div className="capitalize absolute z-20 top-full w-[300px] text-center left-0 mt-1 p-2 bg-black bg-opacity-80 text-white text-xs rounded">
//                             {selectedOptions.map((option) => option[`${variable}`]).join(', ')}
//                         </div>
//                     )}
//                     {isOpen && (
//                         <div className="absolute top-full -translate-y-2 z-50 mt-2 bg-[#f6f6f6] text-black w-[300px] rounded-lg shadow-lg">
//                             <input
//                                 type="text"
//                                 placeholder={searchPlaceholder}
//                                 value={searchText}
//                                 onChange={handleSearchChange}
//                                 className="text-center bg-[#f6f6f6] border-b border-grey w-full px-3 py-2 rounded-t-lg"
//                             />
//                             <ul className="max-h-60 overflow-y-auto">
//                                 {filteredOptions.map((option) => (
//                                     <li
//                                         key={option[`${variable}`]}
//                                         onClick={() => handleOptionClick(option)}
//                                         className={`text-center capitalize px-3 cursor-pointer ${selectedOptions.some((selected) => selected[`${variable}`] === option[`${variable}`],) ? 'bg-[#7571e1] text-white' : ''}`}
//                                     >
//                                         {option[`${variable}`]}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>
//             </div >
//         </>
//     );
// };

// export default MultipleSelectDropdown;
