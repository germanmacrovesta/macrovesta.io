import React, { useState, useRef, useEffect } from 'react';

const defaultFunction = (e) => {

}

const SingleSelectDropdown = ({
    options,
    variable,
    label,
    colour = 'bg-green',
    defaultValue = "Default Value", // Add the defaultValue prop
    onSelectionChange = defaultFunction,
    placeholder = `Select ${label}`,
    searchPlaceholder = `Search ${label}s`,
    addButton = false,
    includeLabel = true,
    addLabel = `Add ${label}`,
    urlPath = undefined,
    router = undefined,
    theme = 'default',
    textCenter = true,
    textColour = "text-white",
    border = false,
    borderStyle = "border border-grey"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef(null);



    // Set the default value in the component state
    useEffect(() => {
        // console.log("Dropdown", "Running Single Dropdown defaultValue, variable")
        if ((defaultValue !== undefined) && defaultValue !== "Default Value") {
            const defaultOption = options.find(option => option[`${variable}`] === defaultValue);
            // console.log("defaultOption", defaultOption);
            // console.log("selectedOption", selectedOption)
            if ((defaultOption !== selectedOption) && !(defaultOption === null && selectedOption === null)) {
                // console.log("Running")
                if (defaultOption != undefined) {
                    setSelectedOption(defaultOption);
                } else {
                    setSelectedOption(null);
                }
            }
        } else {
            // setSelectedOption(null);
        }
        // console.log(`${label} defaultValue`, defaultValue)
    }, [defaultValue, variable]);

    useEffect(() => {
        // console.log("Dropdown", "Running Single Dropdown options, searchText")
        setFilteredOptions(
            options.filter((option) =>
                option[`${variable}`]?.toLowerCase().includes(searchText.toLowerCase()),
            ),
        );
    }, [options, searchText]);

    useEffect(() => {
        // console.log("Dropdown", "Running Single Dropdown wrapperRef")
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchText('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearchText(event.target.value);
    };

    // useEffect(() => {
    //     if (selectedOption) {
    //         onSelectionChange(selectedOption);
    //     }
    // }, [selectedOption, onSelectionChange]);

    const prevSelectedOptionRef = useRef();

    useEffect(() => {
        // console.log("Dropdown", "Running Single Dropdown selectedOption, onSelectionChange")
        if (selectedOption && prevSelectedOptionRef.current !== selectedOption) {
            onSelectionChange(selectedOption);
        }
        prevSelectedOptionRef.current = selectedOption;
    }, [selectedOption, onSelectionChange]);

    const prevOptionsRef = useRef();

    useEffect(() => {
        // console.log("Dropdown", "Running Single Dropdown selectedOption, onSelectionChange")
        if ((defaultValue != null) && defaultValue != "Default Value") {
            // console.log(`${label} defaultValue is still ${defaultValue} even after checking it isn't null`)
            if (options && prevOptionsRef.current !== options) {
                const defaultOption = options.find(option => option[`${variable}`] === defaultValue);
                if (defaultOption == undefined) {
                    setSelectedOption(null)
                }
            }
        }
        prevOptionsRef.current = selectedOption;
    }, [options]);

    useEffect(() => {
        // console.log("Dropdown", "Running Single Dropdown options")
        if (selectedOption != null) {
            const optionExists = options.find((option) => option[`${variable}`] == selectedOption[`${variable}`]) !== undefined;
            const defaultOption = options.find(option => option[`${variable}`] === defaultValue);

            // if (!optionExists) {
            //     setSelectedOption(null);
            // } else if (defaultOption !== undefined && selectedOption[`${variable}`] !== defaultOption[`${variable}`]) {
            //     setSelectedOption(defaultOption);
            // }
        }
    }, [options]);

    // useEffect(() => {
    //     if (selectedOption != null) {
    //         if (options.find((option) => option[`${variable}`] == selectedOption[`${variable}`]) == undefined) {
    //             setSelectedOption(null)
    //         } else {
    //             const defaultOption = options.find(option => option[`${variable}`] === defaultValue);
    //             if (defaultOption != undefined && defaultOption != selectedOption) {
    //                 setSelectedOption(defaultOption);
    //             }
    //         }
    //     }
    // }, [options, selectedOption])

    return (
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
                        className={`w-full h-full capitalize ${textColour} font-semibold ${border ? `${borderStyle}` : ``} ${includeLabel ? '' : ` py-2 ${textCenter ? 'text-center' : 'text-left px-3'} appearance-none`}`}
                    >
                        {selectedOption ? selectedOption[`${variable}`] : placeholder}
                    </button>
                    {isOpen && (
                        <div className="absolute top-full -translate-y-2 z-50 mt-2 bg-[#f6f6f6] text-black w-full rounded-lg shadow-lg">
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchText}
                                onChange={handleSearchChange}
                                className={`${textCenter ? 'text-center' : 'text-left px-3'}} bg-[#f6f6f6] border-b border-grey w-full px-3 py-2 rounded-t-lg`}
                            />
                            <ul className="max-h-60 overflow-y-auto">
                                <li
                                    key={"placeholder"}
                                    onClick={() => handleOptionClick({ [variable]: `${placeholder}` })}
                                    className={`${textCenter ? 'text-center' : 'text-left px-3'}} capitalize px-3 cursor-pointer`}
                                >
                                    {placeholder}
                                </li>
                                {filteredOptions.map((option, index) => (
                                    <li
                                        key={option[`${variable}`]}
                                        onClick={() => handleOptionClick(option)}
                                        className={`${textCenter ? 'text-center' : 'text-left px-3'}} capitalize px-3 cursor-pointer ${selectedOption && selectedOption[`${variable}`] === option[`${variable}`] ? 'bg-[#7571e1] text-white' : ''} ${index == filteredOptions.length - 1 ? 'rounded-b-lg' : ''}`}
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
    );
};

export default SingleSelectDropdown
