// import React from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const items = [
//   { id: 'item1', content: 'Item 1' },
//   { id: 'item2', content: 'Item 2' },
//   { id: 'item3', content: 'Item 3' },
// ];

// function App() {
//   const handleDragEnd = (result) => {
//     // Handle drag end as needed
//   };

//   return (
//     <div className="App">
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="droppable">
//           {(provided) => (
//             <div ref={provided.innerRef} {...provided.droppableProps}>
//               {items.map((item, index) => (
//                 <Draggable key={item.id} draggableId={item.id} index={index}>
//   {(provided) => (
//     <div
//       ref={provided.innerRef}
//       style={{
//         userSelect: 'none',
//         padding: 16,
//         margin: '0 0 8px 0',
//         backgroundColor: 'white',
//         ...provided.draggableProps.style,
//       }}
//     >
//       <div
//         {...provided.draggableProps}
//         {...provided.dragHandleProps}
//       >
//         {item.content}
//       </div>
//     </div>
//   )}
// </Draggable>

//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// }

// export default App;










// import React from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SingleSelectDropdown from './singleSelectDropdown';
import DateField from './dateField';
import { parseDate } from '@internationalized/date';
import { useDateFormatter, useLocale } from 'react-aria';
import { useSession } from 'next-auth/react';


const defaultFunction = (e) => {

}

const CustomSingleSelectDropdown = ({
  options,
  variable,
  label,
  colour,
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
  textColour = 'text-white',
  textCenter = false,
  textPadding = true,
  widthStyles = "min-w-[300px]",
  shadow = ""
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

  const deleteTemplate = async (option) => {
    console.log("option", option)
    let newDeleting = deleting;
    let newDeleted = deleted;
    newDeleting.push(option?.record_id)
    newDeleted.push(option?.record_id)
    setDeleting((prevDeleting) => [...prevDeleting, option?.record_id])

    const data = {
      record_id: option.record_id
    }

    console.log(data);

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/delete-template'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json().then((res) => { setDeleted((prevDeleted) => [...prevDeleted, option?.record_id]) })
  }

  const [deleting, setDeleting] = React.useState([])
  const [deleted, setDeleted] = React.useState([])

  return (
    <div className={`relative flex ${includeLabel ? 'mr-16' : ''}`} ref={wrapperRef}>
      {/* {JSON.stringify(deleting)}
      {JSON.stringify(deleted)} */}
      {addButton && includeLabel && router != undefined && urlPath != undefined && (
        <button type='button' onClick={() => router.push(urlPath)} className=" bg-white px-4 my-3 py-2 text-black rounded-lg text-xs mr-4">{addLabel}</button>
      )}
      <div className={`flex my-3 justify-between rounded-lg ${shadow} ${colour ? colour : "shadow-[inset_0_0px_8px_0px_#f6f6f6]"} ${includeLabel ? '' : 'flex-col'}`}>
        {includeLabel && (
          <div className='px-8 py-2'>
            <label htmlFor={label}>{label}</label>
          </div>
        )}
        <div className={`relative grid place-content-center ${widthStyles} rounded-lg ${colour ? colour : "shadow-[inset_0_0px_8px_0px_#f6f6f6]"} ${includeLabel ? '' : shadow != "" ? '' : 'shadow-[inset_0_0px_4px_0px_#B2B2B2]'}`}>
          <button type='button'
            onClick={() => setIsOpen(!isOpen)}
            className={`capitalize flex items-center ${widthStyles} ${includeLabel ? '' : `bg-transparent h-full ${textCenter ? "text-center" : "text-left"} ${textPadding ? "px-4 py-4" : "px-2 py-2"} appearance-none`}`}
          >
            <div className='grow'>
              {selectedOption ? selectedOption[`${variable}`] : placeholder}
            </div>
            {/* <div>
              <img className={`w-[15px] duration-300 ${isOpen ? "-scale-y-100" : ""}`} src="/ArrowDown_B_SQ.png" />
            </div> */}
            <div className='group-hover:hidden'>
              <img className={`w-[15px] duration-300 ${isOpen ? "-scale-y-100" : ""}`} src="/ArrowDown_B_SQ.png" />
            </div>
            <div className='hidden group-hover:block'>
              <img className={`w-[15px] duration-300 ${isOpen ? "-scale-y-100" : ""}`} src="/ArrowDown_W_SQ.png" />
            </div>
          </button>
          {isOpen && (
            <div className={`absolute top-full -translate-y-2 z-50 mt-2 bg-[#f6f6f6] text-black ${widthStyles} rounded-lg shadow-lg`}>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchText}
                onChange={handleSearchChange}
                className="text-center bg-[#f6f6f6] border-b border-gray w-full px-3 py-2 rounded-t-lg"
              />
              <ul className="max-h-60 overflow-y-auto">
                <li
                  key={"placeholder"}
                  onClick={() => handleOptionClick({ [variable]: `${placeholder}` })}
                  className={`text-center capitalize px-3 cursor-pointer`}
                >
                  {placeholder}
                </li>
                {filteredOptions.map((option) => (
                  <>
                    {!deleted.includes(option.record_id) && (
                      <li
                        key={option[`${variable}`]}
                        onClick={() => handleOptionClick(option)}
                        className={`flex w-full justify-center items-center text-center capitalize px-3 cursor-pointer ${selectedOption && selectedOption[`${variable}`] === option[`${variable}`]
                          ? 'bg-[#7571e1] text-white'
                          : ''
                          }`}
                      >
                        <div className='ml-auto'>
                          {option[`${variable}`]}
                        </div>
                        {!deleting.includes(option?.record_id) && (
                          <>
                            <img className='ml-auto w-[20px] h-[20px] bg-gradient-to-r from-accent to-red rounded-full p-[2px] hover:scale-125 duration-500' src='/Delete_W_SQ.png' onClick={(e) => { e.stopPropagation(); deleteTemplate(option) }} />
                          </>
                        )}
                        {deleting.includes(option?.record_id) && (
                          <>
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="#666666" stroke-width="4"></circle>
                              <path class="opacity-75" fill="#222222" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </>
                        )}
                      </li>
                    )}
                  </>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const DashboardDragDrop = (props) => {
  const { data: session } = useSession();

  const snapPoints = [{ x: 50, y: 100 }, { x: 250, y: 200 } /* Define more snap points as needed */];

  const initialLibraryItems = [
    // { library: ["Products", "All"], subLibrary: ["All", "Full"], id: 'item1', title: 'Products Text', imageUrl: '/full_width_products_text.png', width: 4, height: 95, printHeight: 40 },
    // { library: ["All"], subLibrary: ["All", "Full"], id: 'item2', title: 'Waste Lifecycle', imageUrl: '/full_width_waste_lifecycle.png', width: 2, height: 150, printHeight: 66 },
    // { library: ["All"], subLibrary: ["All", "Half"], id: 'item3', title: 'General Streams Info', imageUrl: '/half_width_general_streams_info.png', width: 1, height: 195, printHeight: 95 },
    // { library: ["All"], subLibrary: ["All", "Half"], id: 'item4', title: 'Capture Rate Donut', imageUrl: '/half_width_product_capture_rate_donut.png', width: 1, height: 195, printHeight: 95 },
    // { library: ["All"], subLibrary: ["All", "Half"], id: 'item5', title: 'Recycling Recovery Donut', imageUrl: '/half_width_recycling_recovery_donut.png', width: 1, height: 195, printHeight: 95 },
    // { library: ["All"], subLibrary: ["All", "Half"], id: 'item6', title: 'Streams Donut', imageUrl: '/half_width_streams_donut.png', width: 1, height: 195, printHeight: 95 },
    // { library: ["All"], subLibrary: ["All", "Full"], id: 'item7', title: 'Table', imageUrl: '/full_width_table.png', width: 2, height: undefined, printHeight: undefined, length: 46, start: 0, end: undefined, type: "table" },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item1', title: 'Macrovesta Index', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item2', title: 'Conclusion Of Market Report', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item3', title: 'Cotton Contracts', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item4', title: 'Domestic Prices', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item5', title: 'Market Sentiment', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item6', title: 'News Snapshot', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item7', title: 'Basis Cost', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item8', title: 'US Export Sales', imageUrl: '/Report_Modules_Products-18.jpg', width: 2, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item9', title: 'In Country News', imageUrl: '/Report_Modules_Products-18.jpg', width: 2, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item10', title: 'Cotton On Call', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item11', title: 'Commitment Of Traders', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item12', title: 'Supply And Demand', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item13', title: 'Future Contracts', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item14', title: 'V4', imageUrl: '/Report_Modules_Products-18.jpg', width: 4, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item2', title: 'Delivery Text', imageUrl: '/Report_Modules_Products-21.jpg', width: 4, height: 33, printHeight: 50, timePeriod: { start: undefined, end: undefined } },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item3', title: 'Stock Check Text', imageUrl: '/Report_Modules_Products-22.jpg', width: 4, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item14', title: 'Products Used', imageUrl: '/Report_Modules_Products-08.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item15', title: 'Products Delivered', imageUrl: '/Report_Modules_Products-09.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item16', title: 'Total Products', imageUrl: '/Report_Modules_Products-10.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item17', title: 'Deliveries', imageUrl: '/Report_Modules_Products-11.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item18', title: 'Product Carbon', imageUrl: '/Report_Modules_Products-12.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item19', title: 'Delivery Carbon', imageUrl: '/Report_Modules_Products-13.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item20', title: 'Current Stock', imageUrl: '/Report_Modules_Products-14.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Products", "Full"], subLibrary: ["All Sizes", "Half"], id: 'item21', title: 'Product Capture Rate', imageUrl: '/Report_Modules_Products-15.jpg', width: 4, height: 66, printHeight: 100 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item4', title: 'Stream Text', imageUrl: '/Report_Modules_Streams-33.jpg', width: 4, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item5', title: 'Collection Text', imageUrl: '/Report_Modules_Streams-37.jpg', width: 4, height: 36, printHeight: 55 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Full"], id: 'item6', title: 'Sorting Text', imageUrl: '/Report_Modules_Streams-38.jpg', width: 4, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item7', title: 'Weight Collected', imageUrl: '/Report_Modules_Streams-23.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item8', title: 'Waste Collections', imageUrl: '/Report_Modules_Streams-24.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item9', title: 'Total Streams', imageUrl: '/Report_Modules_Streams-25.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item10', title: 'Percentage Sorted', imageUrl: '/Report_Modules_Streams-26.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item11', title: 'Contamination', imageUrl: '/Report_Modules_Streams-27.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item12', title: 'Collection Carbon', imageUrl: '/Report_Modules_Streams-28.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Quarter"], id: 'item13', title: 'Closed Loop Carbon Saving', imageUrl: '/Report_Modules_Streams-29.jpg', width: 2, height: 33, printHeight: 50 },
    // { library: ["Streams", "Full"], subLibrary: ["All Sizes", "Half"], id: 'item22', title: 'Stream Capture Rate', imageUrl: '/Report_Modules_Streams-30.jpg', width: 4, height: 66, printHeight: 100 },

    // Add more draggable items
  ];
  const initialTemplateItems = [
    // Add more draggable items
  ];
  const [libraryItems, setLibraryItems] = React.useState(initialLibraryItems)
  const [templateItems, setTemplateItems] = React.useState(initialTemplateItems)

  const [selectedLibrary, setSelectedLibrary] = React.useState("Full")
  const [selectedSubLibrary, setSelectedSubLibrary] = React.useState("All Sizes")

  const [state, setState] = React.useState([initialLibraryItems, initialTemplateItems]);
  const [startEndPageIndices, setStartEndPageIndices] = React.useState([{ start: 0, end: undefined }])

  const reorderSame = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const reorderDifferent = (oldList, newList, startIndex, endIndex) => {
    const oldArray = Array.from(oldList);
    const newArray = Array.from(newList);
    const [removed] = oldArray.splice(startIndex, 1);
    newArray.splice(endIndex, 0, removed);

    return [oldArray, newArray];
  };

  const handleDragEnd = (result) => {
    // Handle drag end as needed
    const { destination, source, draggableId } = result;
    console.log("destination", destination)
    console.log("source", source)
    // if (source?.droppableId == destination?.droppableId) return;
    if (source?.index == destination?.index && source?.droppableId == destination?.droppableId) return;
    if (source?.droppableId == destination?.droppableId) {
      if (destination?.droppableId == "library-row") {
        const items = reorderSame(libraryItems, source?.index, destination?.index)
        console.log("items", items)
        setLibraryItems(items)
      }
      if (destination?.droppableId == "template-row") {
        const items = reorderSame(templateItems, source?.index, destination?.index)
        console.log("items", items)
        setTemplateItems(items)
      }
    } else {
      if (destination?.droppableId == "library-row") {
        const items = reorderSame(templateItems, libraryItems, source?.index, destination?.index)
        console.log("items", items)
        setTemplateItems(items[0])
        setLibraryItems(items[1])
      }
      if (destination?.droppableId == "template-row") {
        const items = reorderSame(libraryItems, templateItems, source?.index, destination?.index)
        console.log("items", items)
        setLibraryItems(items[0])
        setTemplateItems(items[1])
      }
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    console.log("list", list)
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const newReorder = (templateArray, startIndex, endIndex) => {
    const result = Array.from(templateArray);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
    if (source != undefined && destination != undefined) {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);

      destClone.splice(droppableDestination.index, 0, removed);

      const result = {};
      result[droppableSource.droppableId] = sourceClone;
      result[droppableDestination.droppableId] = destClone;

      return result;
    }
  };

  const deleteMove = (templateArray, droppableSource) => {
    if (templateArray != undefined) {
      const clone = Array.from(templateArray);
      clone.splice(droppableSource.index, 1);

      const result = clone;

      return result;
    }
  };

  const addMove = (sourceArray, destinationArray, droppableSource, droppableDestination) => {
    if (sourceArray != undefined && destinationArray != undefined) {
      const sourceClone = Array.from(sourceArray);
      const destinationClone = Array.from(destinationArray);
      const [removed] = sourceClone.splice(droppableSource.index, 1);

      // if (removed.type == "table") {

      // }

      destinationClone.splice(droppableDestination.index, 0, removed);

      const result = [sourceClone, destinationClone];

      return result;
    }
  };

  const newMove = (templateArray, droppableSource, droppableDestination) => {
    if (templateArray != undefined) {
      const clone = Array.from(templateArray);
      const [removed] = clone.splice(droppableSource.index, 1);

      clone.splice(droppableDestination.index, 0, removed);

      const result = clone;

      return result;
    }
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    console.log("source", source)
    console.log("destination", destination)

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    let newState = [...state];

    if (sInd != 0) {
      if (dInd != 0) {
        if (sInd == dInd) { // moving within a template page
          const items = newReorder(state[1], source.index, destination.index);
          // const newState = [...state];
          newState[1] = items;
          setState(newState);
        } else { // moving between template pages
          const result = newMove(state[1], source, destination);
          console.log("result", result)
          // const newState = [...state];
          newState[1] = result;

          setState(newState);
        }
      } else { // moving from template to library
        const result = addMove(state[1], state[0], source, destination)
        // const newState = [...state];
        newState[0] = result[1];
        newState[1] = result[0];

        setState(newState)
        // const result = deleteMove(state[1], source)
        // // const newState = [...state];
        // newState[1] = result;

        // setState(newState)
      }
    } else {
      if (dInd != 0) { // moving from library to template
        const result = addMove(state[0], state[1], source, destination)
        // const newState = [...state];
        newState[0] = result[0];
        newState[1] = result[1];

        setState(newState)
      } else { // moving within library
        const items = reorder(state[sInd], source.index, destination.index);
        // const newState = [...state];
        newState[sInd] = items;
        setState(newState);
      }
    }

    let i = 0;
    let currentHeightTotal = 0;
    let currentPage = 0;
    let newStartEndPageIndices = [{ start: 0, end: undefined }]
    let offset = 1;
    let needNewPage = false;
    while (i < newState[1].length) {
      needNewPage = false;
      offset = 1;
      if (newState[1][i]?.printHeight == undefined) {
        if (currentHeightTotal > 400) {
          currentHeightTotal += 66;
          needNewPage = true
          // currentHeightTotal = undefined;
        } else {
          // const remainingHeight = 500 - currentHeightTotal;
          // work out size of first part and save start and end indices for data and also save currentPage so you can use slice to add all extra table pages inbetween current page and next page
          currentHeightTotal = undefined;
        }
        i += 1;
      } else if (newState[1][i]?.width == 4) {
        currentHeightTotal += newState[1][i]?.printHeight;
        i += 1;
      } else if (newState[1][i]?.width == 2) {
        if (i < newState[1].length - 2) {
          if (newState[1][i + 1]?.width == 2) {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 2;
            offset = 2
          } else if (newState[1][i + 1]?.width == 1) {
            if (newState[1][i + 2]?.width == 1) {
              currentHeightTotal += newState[1][i]?.printHeight;
              i += 3;
              offset = 3
            } else {
              currentHeightTotal += newState[1][i]?.printHeight;
              i += 2;
              offset = 2
            }
          } else {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 1;
            offset = 1
          }

        } else if (i < newState[1].length - 1) {
          if (newState[1][i + 1]?.width == 2 || newState[1][i + 1]?.width == 1) {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 2;
            offset = 2
          } else {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 1;
          }
        } else {
          currentHeightTotal += newState[1][i]?.printHeight;
          i += 1;
        }
      } else if (newState[1][i]?.width == 1) {
        if (i < newState[1].length - 3) {
          if (newState[1][i + 1]?.width == 2) {
            if (newState[1][i + 2]?.width == 1) {
              currentHeightTotal += newState[1][i + 1]?.printHeight;
              i += 3;
              offset = 3
            } else {
              currentHeightTotal += newState[1][i + 1]?.printHeight;
              i += 2;
              offset = 2
            }
          } else if (newState[1][i + 1]?.width == 1) {
            if (newState[1][i + 2]?.width == 2) {
              currentHeightTotal += newState[1][i + 2]?.printHeight;
              i += 3;
              offset = 3
            } else if (newState[1][i + 2]?.width == 1) {
              if (newState[1][i + 3]?.width == 1) {
                currentHeightTotal += newState[1][i]?.printHeight;
                i += 4;
                offset = 4
              } else {
                currentHeightTotal += newState[1][i]?.printHeight;
                i += 3;
                offset = 3
              }

            } else {
              currentHeightTotal += newState[1][i]?.printHeight;
              i += 2;
              offset = 2;
            }
          } else {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 1;
            offset = 1
          }
        } else if (i < newState[1].length - 2) {
          if (newState[1][i + 1]?.width == 2) {
            if (newState[1][i + 2]?.width == 1) {
              currentHeightTotal += newState[1][i + 1]?.printHeight;
              i += 3;
              offset = 3
            } else {
              currentHeightTotal += newState[1][i + 1]?.printHeight;
              i += 2;
              offset = 2
            }
          } else if (newState[1][i + 1]?.width == 1) {
            if (newState[1][i + 2]?.width == 2) {
              currentHeightTotal += newState[1][i + 2]?.printHeight;
              i += 3;
              offset = 3
            } else if (newState[1][i + 2]?.width == 1) {
              currentHeightTotal += newState[1][i]?.printHeight;
              i += 3;
              offset = 3

            } else {
              currentHeightTotal += newState[1][i]?.printHeight;
              i += 2;
              offset = 2;
            }
          } else {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 1;
            offset = 1
          }
        } else if (i < newState[1].length - 1) {
          if (newState[1][i + 1]?.width == 1) {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 2;
            offset = 2
          } else {
            currentHeightTotal += newState[1][i]?.printHeight;
            i += 1;
            offset = 1
          }
        } else {
          currentHeightTotal += newState[1][i]?.printHeight;
          i += 1;
          offset = 1
        }
      }
      // else if (i < newState[1].length - 1) {
      //   if (newState[1][i + 1]?.width == 2) {
      //     currentHeightTotal += newState[1][i]?.printHeight;
      //     i += 2;
      //     offset = 2
      //   } else {
      //     currentHeightTotal += newState[1][i]?.printHeight;
      //     i += 1;
      //   }
      // } 
      else {
        currentHeightTotal += newState[1][i]?.printHeight;
        i += 1;
      }

      console.log("currentHeightTotal", currentHeightTotal)

      if (currentHeightTotal == undefined) {
        if (i < newState[1].length - 1 + offset) {
          newStartEndPageIndices[currentPage].end = i;
          currentPage += 1;
          currentHeightTotal = 0;
          newStartEndPageIndices[currentPage] = { start: i, end: undefined }
        } else {
          newStartEndPageIndices[currentPage].end = i;
          currentPage += 1;
          currentHeightTotal = 0;
          // newStartEndPageIndices[currentPage] = { start: i, end: undefined }
        }
      } else if (currentHeightTotal > 213) {
        if (!needNewPage) {
          newStartEndPageIndices[currentPage].end = i - offset;
          currentPage += 1;
          currentHeightTotal = newState[1][i - offset]?.printHeight;
          newStartEndPageIndices[currentPage] = { start: i - offset, end: undefined }
        } else {
          if (i < newState[1].length - 1 + offset) {
            newStartEndPageIndices[currentPage].end = i - offset;
            currentPage += 1;
            currentHeightTotal = newState[1][i - offset]?.printHeight;
            newStartEndPageIndices[currentPage] = { start: i - offset, end: i - offset + 1 }
            currentPage += 1;
            newStartEndPageIndices[currentPage] = { start: i - offset + 1, end: undefined }
          } else {
            newStartEndPageIndices[currentPage].end = i - offset;
            currentPage += 1;
            currentHeightTotal = newState[1][i - offset]?.printHeight;
            // newStartEndPageIndices[currentPage] = { start: i, end: undefined }
          }
        }
      } else {
        console.log(`${i}: ${currentHeightTotal}`)
      }
    }

    // setStartEndPageIndices(newStartEndPageIndices)

    // if (sInd == dInd) {
    //   const items = reorder(state[sInd], source.index, destination.index);
    //   const newState = [...state];
    //   newState[sInd] = items;
    //   setState(newState);
    // } else {
    //   const result = move(state[sInd], state[dInd], source, destination);
    //   console.log("result", result)
    //   const newState = [...state];
    //   newState[sInd] = result[sInd];
    //   newState[dInd] = result[dInd];

    //   setState(newState);
    // }
  }

  const handleCreateReport = async () => {
    setGeneratedReport(false)
    setGeneratingReport(true)

    const data = {
      templateArray: state[1],
      pageIndices: startEndPageIndices,
      venue: session?.company,
      // record_id: record_id
    }

    console.log(data);

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/save-custom-dashboard'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json().then((res) => { setGeneratingReport(false); setGeneratedReport(true) })
  }

  const [reportURL, setReportURL] = React.useState("")
  const [generatingReport, setGeneratingReport] = React.useState(false)
  const [generatedReport, setGeneratedReport] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState(undefined)

  const [generatingTemplate, setGeneratingTemplate] = React.useState(false)
  const [generatedTemplate, setGeneratedTemplate] = React.useState(false)
  const [addingNewTemplate, setAddingNewTemplate] = React.useState(false)

  const changeTemplate = (e) => {
    if (e?.name != "Select Template") {
      const newState = [...state]

      const templateData = JSON.parse(e?.data)

      newState[1] = templateData?.templateArray

      newState[0] = [];

      initialLibraryItems.forEach((templateModule) => {
        if (newState[1].find((object) => object.id == templateModule.id) == undefined) {
          newState[0].push(templateModule)
        }
      })

      setState(newState)
      setStartEndPageIndices(templateData?.pageIndices)
      setSelectedTemplate(e?.name)
    }
  }

  React.useEffect(() => {
    if (props.templateData != undefined) {
      const newState = [...state]

      const templateData = JSON.parse(props.templateData)

      newState[1] = templateData?.templateArray

      newState[0] = [];

      initialLibraryItems.forEach((templateModule) => {
        if (newState[1]?.find((object) => object.id == templateModule.id) == undefined) {
          newState[0]?.push(templateModule)
        }
      })

      setState(newState)
      // setStartEndPageIndices(templateData?.pageIndices)
      // setSelectedTemplate(e?.name)
    }
  }, [])

  const handleCreateNewTemplate = async (e) => {
    e.preventDefault();
    setGeneratingReport(true)

    let name = e.target['name'].value;

    const data = {
      templateArray: state[1],
      pageIndices: startEndPageIndices,
      venue: session?.company,
      name
      // record_id: record_id
    }

    console.log(data);

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/add-new-template'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json().then((res) => { setGeneratingTemplate(false); setGeneratedTemplate(true); setAddingNewTemplate(false) })
  }

  const locale = useLocale();

  // const options = {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // };
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  };
  const formatter = new Intl.DateTimeFormat(locale, options);

  var temp = new Date();
  temp.setSeconds(0);
  var dd = String(temp.getDate()).padStart(2, '0');
  var mm = String(temp.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = temp.getFullYear();

  let todaysDate = `${yyyy}-${mm}-${dd}`;

  const [selectedStartDate, setSelectedStartDate] = useState(parseDate(todaysDate));
  const [selectedEndDate, setSelectedEndDate] = useState(parseDate(todaysDate));

  const [isUsingDateFilter, setIsUsingDateFilter] = useState(false)

  const parseDateString = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    if (isNaN(date)) {
      return undefined
    } else {
      return `${day}-${month}-${year}`;
    }

  };


  return (
    <div className="w-full ">
      {/* {JSON.stringify(state[1])}
      {JSON.stringify(startEndPageIndices)} */}
      {/* {selectedStartDate.toDate().toISOString()} */}
      {/* {JSON.stringify({ templateArray: state[1], pageIndices: startEndPageIndices, venue: "Example Venue" })} */}
      {/* Draggable items */}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className='w-full relative flex'>

          <div className='relative flex flex-col w-full items-center mb-36'>
            <div className='col-span-2 pt-4  flex flex-col text-lg text-black text-center'>
              <div className='w-[140mm] text-sm'>
                Below, you can design your own dashboard from our premade <b>modules</b> for your <b>My Dashboard</b> page.
              </div>
              <div className='w-[140mm] text-sm mt-2'>
                Drag <b>modules</b> from the library on the right onto the template page on the left, then click <b>save changes</b> below.
              </div>
              {/* <div className='flex justify-between text-sm items-center w-[140mm]'>
                <CustomSingleSelectDropdown
                  options={JSON.parse(props.templatesData)}
                  label="Tempalate"
                  variable="name"
                  onSelectionChange={changeTemplate}
                  placeholder="Select Template"
                  searchPlaceholder="Search Templates"
                  includeLabel={false}
                  textCenter={true}
                  textPadding={false}
                  colour="bg-white text-black hover:bg-deep_blue hover:text-white duration-300 group"
                  widthStyles='w-[250px]'
                  shadow='shadow-lg'
                />
                <div className='group bg-white hover:bg-deep_blue hover:text-white duration-300 flex items-center rounded-lg shadow-lg text-black h-fit w-[250px] px-4 py-2 cursor-pointer' onClick={() => setAddingNewTemplate(true)}>

                  <div className='grow'>
                    Save As New Template
                  </div>
                  <div className='group-hover:hidden'>
                    <img className={`w-[15px]`} src="/Save_B_SQ.png" />
                  </div>
                  <div className='hidden group-hover:block'>
                    <img className={`w-[15px]`} src="/Save_W_SQ.png" />
                  </div>
                </div>
              </div> */}
              {/* {addingNewTemplate && (
                <>
                  <form className='flex gap-8 justify-between items-center' onSubmit={handleCreateNewTemplate}>

                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="Enter Template Name"
                      required
                    />
                    <button type='submit' className='bg-deep_blue rounded-lg shadow-lg text-white h-fit w-[150px] px-4 py-2 cursor-pointer'>
                      Add
                    </button>
                  </form>
                </>
              )} */}
              {/* <div className='flex gap-4'>
                <label className='select-none' for="dateFilter">Date Filter</label>
                <input onChange={(e) => setIsUsingDateFilter(e.target.checked)} type="checkbox" id="dateFilter" name="dateFilter" />
              </div>
              {isUsingDateFilter && (
                <>
                  <div className='flex gap-4'>
                    <DateField includeLabel={false} parentPadding='' backgroundStyles='bg-deep_blue text-white' label='Start Date' setDate={setSelectedStartDate} date={selectedStartDate} formatter={formatter} />
                    <DateField includeLabel={false} parentPadding='' backgroundStyles='bg-deep_blue text-white' label='End Date' setDate={setSelectedEndDate} date={selectedEndDate} formatter={formatter} />
                  </div>
                </>
              )} */}
            </div>
            {/* <div className="col-span-2 pt-8 font-semibold text-lg text-black text-center">Report Pages</div> */}
            <div className="col-span-2 pb-2 pt-6 font-semibold text-black text-left w-[140mm]">Custom Dashboard</div>
            {startEndPageIndices.length > 0 && startEndPageIndices.map((pageIndices, pageNumber) => (
              <>
                {/* <div className="col-span-2 pb-2 pt-6 font-semibold text-black text-left w-[140mm]">Page {pageNumber + 1}</div> */}
                <div  >
                  <Droppable droppableId={`${pageNumber + 1}`} direction="vertical">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-white box-content relative border-[3px] border-deep_blue rounded-md shadow-lg border-dashed grid grid-cols-4 gap-2 p-2 auto-rows-min place-items-center w-[140mm] min-h-[400px]`}
                      >
                        {/* <div className='w-full h-[35mm] col-span-4'></div> */}
                        {/* <img className='absolute inset-0' src='/Template.jpg' /> */}
                        {/* <div className='absolute left-0 top-0 pl-[6mm] h-[66px] w-[400px] text-white text-base font-semibold grid place-content-center'>
                          <div>
                            {`Example Venue Waste Impact Report`}
                            <span className="whitespace-nowrap text-xs font-normal">&nbsp;&nbsp;{parseDateString(new Date().toISOString())}</span>
                          </div>
                        </div> */}
                        {/* <div className='absolute top-0 w-full bg-deep_blue h-[50px] col-span-2'></div> */}
                        {state[1]?.slice(pageIndices.start, pageIndices.end).map((item, index) => (
                          <Draggable key={`${item.id}`} draggableId={`${item.id}`} index={pageIndices.start + index} id={`${item.id}`}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${`col-span-${item.width}`} w-full h-fit border-2 border-black rounded-lg cursor-move relative select-none box-border`}
                              >
                                <div className='grid place-content-center w-full h-[100px]'>
                                  <div>{item.title}</div>
                                  {/* <img src={item.imageUrl} alt={item.title} style={{ height: `${item?.height}mm` }} className={`h-[${item?.height ?? "66"}mm] w-full`} /> */}
                                </div>
                                {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                  <div className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded-md">{item.title}</div>
                                </div> */}
                              </div>
                            )}
                          </Draggable>


                        ))}
                        {/* <div className='w-full mt-4 z-50 border-2 border-black h-[18mm] col-span-4'></div> */}
                        {/* <div className='absolute bottom-0 w-full bg-deep_blue h-[50px] col-span-2'></div> */}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </>
            ))}
            {!generatingReport && (
              <div className="col-span-2 mt-8 font-semibold text-lg bg-deep_blue text-white cursor-pointer rounded-xl shadow-lg px-2 py-1 text-center" onClick={handleCreateReport}>Save Changes

              </div>
            )}
            {generatingReport && !generatedReport && (
              <>
                <div className="col-span-2 mt-8 font-semibold text-lg text-black  px-2 py-1 text-center">Saving Dashboard Now
                  <div className='grid place-content-center pl-[12px]'>
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="#666666" stroke-width="4"></circle>
                      <path class="opacity-75" fill="#222222" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                {/* <div className="col-span-2 mt-8 text-black px-2 py-1 text-center">Please wait, this may take up to 20 seconds</div> */}
              </>
            )}
            {generatedReport && (
              <>
                <div className="col-span-2 mt-8 font-semibold text-lg text-black px-2 py-1 text-center">Dashboard Saved</div>
                {/* <div className="col-span-2 mt-8 text-black px-2 py-1 text-center mx-24">The report can be viewed by clicking the button below. This link expires in 10 minutes for your data security. If expired you can view the report here [url to tracker/reports]</div> */}
              </>
            )}
            {/* {reportURL != "" && (
              <>
                <div className="bg-deep_blue px-4 py-1 mt-4 mb-4 w-fit text-center rounded-lg cursor-pointer text-white" onClick={() => window.open(reportURL, '_blank')}>
                  View Report
                </div>
              </>
            )} */}

          </div>

          <div className=' relative'>
            {/* <div className='z-50 flex justify-end'>
            <div className='z-0'>
              <div className="relative mt-6 z-50 overflow-visible">
                <div className='z-50 flex cursor-pointer group bg-gray-200 p-6 rounded-l-xl w-80 translate-x-52 hover:-translate-x-0 shadow-center-xl  hover:bg-gradient-to-tr hover:from-deep_blue hover:to-navy duration-1000'>
                  <img className='z-50 h-20 w-20 group-hover:scale-125 duration-1000' src='/Waste_Iso.png'></img>
                  <div className='z-50 flex-1 flex flex-col items-center justify-center text-lg text-white-100 font-bold px-6'>
                    All Report Components
                  </div>
                </div>
                <div className='flex cursor-pointer group bg-gray-200  p-6 -mt-6 rounded-l-xl w-80 translate-x-52 hover:-translate-x-0 shadow-center-xl hover:bg-gradient-to-tr hover:from-deep_blue hover:to-navy duration-1000'>
                  <img className='h-20 w-20 group-hover:scale-125 duration-1000' src='/Streams_Iso.png'></img>
                  <div className='flex-1 flex flex-col items-center justify-center text-lg text-white-100 font-bold px-6'>
                    Stream Components
                  </div>
                </div>
                <div className='flex cursor-pointer group bg-gray-200  p-6 -mt-6 rounded-l-xl w-80 translate-x-52 hover:-translate-x-0 shadow-center-xl  hover:bg-gradient-to-tr hover:from-deep_blue hover:to-navy duration-1000'>
                  <img className='h-20 w-20 group-hover:scale-125 duration-1000' src='/Products_Iso.png'></img>
                  <div className='flex-1 flex flex-col items-center justify-center text-lg font-bold text-white-100 px-6'>
                    Product Components
                  </div>
                </div>

              </div>
            </div> */}
            <Droppable droppableId={`${0}`} direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={` sticky z-10 top-0 right-0 w-96`}

                >
                  {/* <div className="absolute left-0 bottom-1/4 -z-10 overflow-visible">
                    <div onClick={() => setSelectedLibrary("Full")} className={`flex cursor-pointer group ${selectedLibrary == "Full" ? "bg-gradient-to-tr from-deep_blue to-navy" : "bg-gradient-to-tr from-gray-200 to-gray-200"} p-6 rounded-l-xl w-80 -translate-x-20 hover:-translate-x-72 shadow-center-xl  hover:bg-gradient-to-tr hover:from-deep_blue hover:to-navy duration-1000`}>
                      <img className='h-12 w-12 group-hover:scale-125 duration-1000' src='/Waste_Iso.png'></img>
                      <div className='flex-1 flex flex-col items-center justify-center text-sm leading-tight text-white-100 font-bold px-6'>
                        All Report Components
                      </div>
                    </div>
                    <div onClick={() => setSelectedLibrary("Streams")} className={`flex cursor-pointer group ${selectedLibrary == "Streams" ? "bg-gradient-to-tr from-deep_blue to-navy" : "bg-gradient-to-tr from-gray-200 to-gray-200"}  p-6 -mt-6 rounded-l-xl w-80 -translate-x-20 hover:-translate-x-72 shadow-center-xl hover:bg-gradient-to-tr hover:from-deep_blue hover:to-navy duration-1000`}>
                      <img className='h-12 w-12 group-hover:scale-125 duration-1000' src='/Streams_Iso.png'></img>
                      <div className='flex-1 flex flex-col items-center justify-center text-sm leading-tight text-white-100 font-bold px-6'>
                        Stream Components
                      </div>
                    </div>
                    <div onClick={() => setSelectedLibrary("Products")} className={`flex cursor-pointer group ${selectedLibrary == "Products" ? "bg-gradient-to-tr from-deep_blue to-navy" : "bg-gradient-to-tr from-gray-200 to-gray-200"}  p-6 -mt-6 rounded-l-xl w-80 -translate-x-20 hover:-translate-x-72 shadow-center-xl  hover:bg-gradient-to-tr hover:from-deep_blue hover:to-navy duration-1000`}>
                      <img className='h-12 w-12 group-hover:scale-125 duration-1000' src='/Products_Iso.png'></img>
                      <div className='flex-1 flex flex-col items-center justify-center text-sm leading-tight font-bold text-white-100 px-6'>
                        Product Components
                      </div>
                    </div>

                  </div> */}
                  <div className='bg-gradient-to-tr from-gray-300 to-gray-300 z-50 h-screen overflow-y-auto overflow-x-clip'>
                    {/* <div className='bg-navy z-50 h-screen overflow-y-auto overflow-x-clip'> */}

                    <div className="z-50 col-span-2 h-fit py-8 font-semibold text-lg text-black">
                      <div className='text-center'>
                        {`Module Library`}
                      </div>
                      {/* <div className=' grid place-content-center h-fit'>
                      <SingleSelectDropdown
                        options={[{ name: "All" }, { name: "Products" }]}
                        label="Library"
                        variable="name"
                        onSelectionChange={(e) => setSelectedLibrary(e.name)}
                        placeholder="Select Library"
                        searchPlaceholder="Search Libraries"
                        includeLabel={false}
                        defaultValue={"All"}
                        textCenter={true}
                        textPadding={false}
                      />
                    </div> */}
                      {/* <div className=' grid place-content-center h-fit font-normal'>
                        <SingleSelectDropdown
                          options={[{ name: "All Sizes" }, { name: "Full" }, { name: "Half" }, { name: "Quarter" }]}
                          label="Sub-Library"
                          variable="name"
                          onSelectionChange={(e) => setSelectedSubLibrary(e.name)}
                          placeholder="Select Sub-Library"
                          searchPlaceholder="Search Sub-Libraries"
                          includeLabel={false}
                          defaultValue={"All Sizes"}
                          textCenter={true}
                          textPadding={false}
                          colour={"bg-white text-black text-sm"}
                          includePlaceholder={false}
                          includeSearch={false}
                          arrowURL='/ArrowDown_B_SQ.png'
                          shadow='shadow-lg'
                        />
                      </div> */}
                    </div>
                    <div className='z-50 grid grid-cols-4 gap-4 px-4 place-items-center'>
                      {state[0].filter((libraryModule) => libraryModule?.library.includes(selectedLibrary) && libraryModule?.subLibrary.includes(selectedSubLibrary)).map((item, index) => (
                        <Draggable key={`${item.id}`} draggableId={`${item.id}`} index={index} id={`${item.id}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={` ${`col-span-${item.width}`} w-full h-fit  border-2 border-black text-black  rounded-lg cursor-move select-none relative box-border`}
                            >
                              <div className='grid place-content-center h-[30px]'>
                                <div>{item.title}</div>
                                {/* <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-lg" /> */}
                              </div>
                              {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <div className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded-md">{item.title}</div>
                              </div> */}
                            </div>
                          )}
                        </Draggable>

                      ))}
                    </div>
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

        </div>
      </DragDropContext>

    </div>
  );
};

export default DashboardDragDrop;
