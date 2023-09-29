import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../server/db";
import { useRouter } from "next/router";
import Counter from "../components/counter";
import { createPortal } from "react-dom";
import React from "react";

const tableData = [{ name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }, { name: "Nick", weight_used: 200 }, { name: "Jack", weight_used: 100 }]

// const rootRef = React.useRef()
const PuppeteerCustomReportGenerator = (props) => {
    const [isClient, setIsClient] = React.useState(false)

    const nFormat = new Intl.NumberFormat();

    React.useEffect(() => {
        setIsClient(true)
    }, [])

    const router = useRouter()

    const TemplateModule = ({ module, pageIndex, mapIndex }) => {

        switch (module.title) {

            case "Waste Lifecycle":
                return (
                    <>
                        <div className={`col-span-${module.width} h-[150px] text-center`}>{module.title}</div>
                    </>
                )

                break;

            case "General Streams Info":
                return (
                    <>
                        <div className={`col-span-${module.width} h-[90mm] grid grid-cols-2`}>
                            <div className='relative flex flex-col place-content-center w-full h-full'>
                                <img className="self-center w-[20mm] animate-grow duration-300" src="/Products_Iso.png" />
                                <div className="flex justify-center gap-4">
                                    <div className='flex flex-col  place-content-center'>
                                        <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_products)} duration={750} />
                                        <span className="text-1xl self-end font-semibold">&nbsp;{t("products")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='relative flex flex-col place-content-center w-full h-full'>
                                <img className="self-center w-[20mm] animate-grow duration-300" src="/Streams_Iso.png" />
                                <div className="flex justify-center gap-4">
                                    <div className='flex flex-col place-content-center'>
                                        <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_streams)} duration={750} />
                                        <span className="text-1xl self-end font-semibold">&nbsp;{t("streams")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='relative flex flex-col place-content-center w-full h-full'>
                                <img className="self-center w-[20mm] animate-grow duration-300" src="/Products_Iso.png" />
                                <div className="flex justify-center gap-4">
                                    <div className='flex flex-col  place-content-center'>
                                        <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_products)} duration={750} />
                                        <span className="text-1xl self-end font-semibold">&nbsp;{t("products")}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='relative flex flex-col place-content-center w-full h-full'>
                                <img className="self-center w-[20mm] animate-grow duration-300" src="/Streams_Iso.png" />
                                <div className="flex justify-center gap-4">
                                    <div className='flex flex-col place-content-center'>
                                        <Counter className='self-center text-3xl' targetValue={parseInt(JSON.parse(props.venueData).number_of_streams)} duration={750} />
                                        <span className="text-1xl self-end font-semibold">&nbsp;{t("streams")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )

                break;

            case "Stream Text":
                return (
                    <>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Streams</div>
                            <div className="text-left">{`All products are grouped into streams which indicate how they will enter the circular economy. Waste streams are collected by waste managers, and go through sorting and reprocessing to discover the final recycling statistics. ${router.query?.venue} has a total of ${JSON.parse(props.streamsData).length} Streams, and has had ${JSON.parse(props.collectionsData).length} collections over the reporting period.`}</div>
                        </div>
                    </>
                )

            case "Collection Text":
                return (
                    <>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[55mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Collections</div>
                            <div className="text-left">{`Waste collections provide data on the quantity of material removed from site, which is a good early indicator of product capture rates, but cannot be used for this until sorting has occured. ${router.query?.venue} has had ${JSON.parse(props.collectionsData).length} waste collections over the reporting period and has had collections for ${JSON.parse(props.streamsData).reduce((acc, obj) => { if (obj?.number_of_waste_collections > 0) { acc++ } return acc; }, 0)} of ${JSON.parse(props.streamsData).length} streams. Collection distances are calculated and carbon associated from this journey is calculated in line with the GHG protocol.`}</div>
                        </div>
                    </>
                )
            case "Sorting Text":
                return (
                    <>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[45mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Sorting</div>
                            <div className="text-left">{`Waste sorting occurs after waste collections have been made. ${router.query?.venue}'s waste streams are being sorting by percentage single, meaning sampling of their waste streams is being used to determine the contamination rate, which is applied to their waste collection.`}</div>
                        </div>
                    </>
                )
            case "Product Text":
                return (
                    <>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Products</div>
                            <div className="text-left">{`The Rubbish Portal gathers product data including the material and weight to aid in the tracking process. ${router.query?.venue} has a total of ${JSON.parse(props.productsData)?.length} products, and has had a total of ${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_delivered != null) { acc += parseInt(obj?.number_of_products_delivered) } return acc; }, 0))} products delivered during this reporting period. Product carbon impact is calculated using the embodied carbon of the material and the quantity consumed.`}</div>
                        </div>
                    </>
                )
            case "Delivery Text":
                const timePeriod = JSON.parse(JSON.parse(props.templateData))?.timePeriod
                let deliveries = JSON.parse(props.deliveriesData)
                if (timePeriod?.start != undefined && timePeriod?.end != undefined) {
                    deliveries = JSON.parse(props.deliveriesData)?.filter((delivery) => delivery?.date < timePeriod?.end && delivery?.date > timePeriod?.start)
                }

                return (
                    <>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Deliveries</div>
                            <div className="text-left">{`For any product being tracked, every delivery made to the venue should be logged. ${router.query?.venue} has logged ${deliveries?.length} deliveries during this reporting period, totalling ${nFormat.format(deliveries?.reduce((acc, obj) => { if (obj?.number_of_products_delivered != null) { acc += parseInt(obj?.number_of_products_delivered) } return acc; }, 0))} products delivered. Delivery distances are calculated and carbon associated from this journey is calculated in line with the GHG protocol.`}</div>
                        </div>
                    </>
                )

            case "Stock Check Text":
                return (
                    <>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[45mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Stock Checks</div>
                            <div className="text-left">{`Stock checks are vital for calculating the actual consumption figures for products. Within this reporting period, ${router.query?.venue} has completed ${JSON.parse(props.stocksData)?.length} stock checks, allowing The Portal to calculate a consumption figure of ${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_used != null) { acc += parseInt(obj?.number_of_products_used) } return acc; }, 0))} products.`}</div>
                        </div>
                    </>
                )

            case "Weight Collected":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Waste_Iso.png" />
                                    <div>
                                        Weight Collected
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.collectionsData)?.reduce((acc, obj) => { if (obj?.weight_collected != null) { acc += parseInt(obj?.weight_collected) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Waste Collections":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Collection_Iso.png" />
                                    <div>
                                        Waste Collections
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.collectionsData)?.length)}`}
                                    {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Total Streams":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Streams_Iso.png" />
                                    <div>
                                        Total Streams
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.streamsData)?.length)}`}
                                    {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Percentage Sorted":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Sorting_Iso.png" />
                                    <div>
                                        Percentage Sorted
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.collectionsData)?.reduce((acc, obj) => { if (obj?.weight_sorted != null) { acc += parseInt(obj?.weight_sorted) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Contamination":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Contamination_Iso.png" />
                                    <div>
                                        Contamination
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.venueData)[0]?.contamination_rate * 100)}`}&nbsp;<span className="text-base font-semibold">%</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Collection Carbon":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Emissions_Iso.png" />
                                    <div className="font-bold text-xl">
                                        {`${nFormat.format(JSON.parse(props.collectionsData)?.reduce((acc, obj) => { if (obj?.transport_carbon_emissions != null) { acc += parseInt(obj?.transport_carbon_emissions) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                    </div>
                                </div>
                                <div>
                                    Collection Carbon
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Closed Loop Carbon Saving":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Emissions_Saving_Iso.png" />
                                    <div className="font-bold text-xl">
                                        {`${nFormat.format(JSON.parse(props.streamsData)?.reduce((acc, obj) => { if (obj?.carbon_savings != null) { acc += parseInt(obj?.carbon_savings) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                    </div>
                                </div>
                                <div>
                                    Closed Loop Carbon Saving
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Products Used":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Used_Iso.png" />
                                    <div>
                                        Products Used
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_used != null) { acc += parseInt(obj?.number_of_products_used) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Products Delivered":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Used_Iso.png" />
                                    <div>
                                        Products Delivered
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.number_of_products_delivered != null) { acc += parseInt(obj?.number_of_products_delivered) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Total Products":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Products_Iso.png" />
                                    <div>
                                        Total Products
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.productsData)?.length)}`}
                                    {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Deliveries":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Deliveries_Iso.png" />
                                    <div>
                                        Deliveries
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.deliveriesData)?.length)}`}
                                    {/* &nbsp;<span className="text-base font-semibold">kg</span> */}
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Product Carbon":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Product_Emissions_Iso.png" />
                                    <div>
                                        Product Carbon
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.product_carbon_impact != null) { acc += parseInt(obj?.product_carbon_impact) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Delivery Carbon":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Emissions_Iso.png" />
                                    <div>
                                        Delivery Carbon
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.deliveriesData)?.reduce((acc, obj) => { if (obj?.transport_carbon_emissions != null) { acc += parseInt(obj?.transport_carbon_emissions) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            case "Current Stock":
                return (
                    <>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Deliveries_Iso.png" />
                                    <div>
                                        Current Stock
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    {`${nFormat.format(JSON.parse(props.productsData)?.reduce((acc, obj) => { if (obj?.stock_remaining != null) { acc += parseInt(obj?.stock_remaining) } return acc; }, 0))}`}&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                    </>
                )

            default:
                return (
                    <></>
                )
                break;
        }
    }

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

        <>
            <main id="root" className="flex flex-col" >
                {JSON.parse(JSON.parse(props.templateData))?.pageIndices?.map((pageIndex, mapIndex) => (
                    <>
                        <div className={`relative w-[210mm] h-[297mm] order-${mapIndex + 1}`}>
                            <img className="absolute -z-10 w-[210mm] h-[297mm]" src="/Template.jpg" />
                            <div className="absolute z-20 left-0 top-0 pl-[8mm] h-[100px] w-[600px] text-white text-2xl font-semibold grid place-content-center">
                                <div>
                                    {`${JSON.parse(props.venueData)[0]?.name} Waste Impact Report`}
                                    <span className="whitespace-nowrap text-base font-normal">&nbsp;&nbsp;{parseDateString(new Date().toISOString())}</span>
                                    Hello World
                                </div>
                            </div>
                            {/* <div className="grid grid-cols-2 h-full pt-[180px] pb-[140px]"> */}
                            <div className="z-20 grid grid-cols-4 h-fit pt-[180px] px-[8mm] pb-[140px] place-items-center">
                                {JSON.parse(JSON.parse(props.templateData))?.templateArray?.slice(pageIndex.start, pageIndex.end)?.map((templateModule, moduleIndex) => (
                                    <TemplateModule module={templateModule} pageIndex={pageIndex} moduleIndex={moduleIndex} mapIndex={mapIndex} />
                                ))}
                            </div>
                        </div>
                    </>
                ))}
                {/* <div className={`relative w-[210mm] h-[297mm] order-${1 + 1}`}>
                    <img className="absolute -z-10 w-[210mm] h-[297mm]" src="/template.jpg" />
                    <div className="grid grid-cols-4 h-fit pt-[180px] px-[8mm] pb-[140px] place-items-center">
                        


                        <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Streams</div>
                            <div className="text-left">{`All products are grouped into streams which indicate how they will enter the circular economy. Waste streams are collected by waste managers, and go through sorting and reprocessing to discover the final recycling statistics. ${router.query?.venue} has a total of 5 Streams, and has had 15 collections over the reporting period.`}</div>
                        </div>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[55mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Collections</div>
                            <div className="text-left">{`Waste collections provide data on the quantity of material removed from site, which is a good early indicator of product capture rates, but cannot be used for this until sorting has occured. ${router.query?.venue} has had 15 waste collections over the reporting period and has had collections for 4 of 5 streams. Collection distances are calculated and carbon associated from this journey is calculated in line with the GHG protocol.`}</div>
                        </div>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[45mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Sorting</div>
                            <div className="text-left">{`Waste sorting occurs after waste collections have been made. ${router.query?.venue}'s waste streams are being sorting by percentage single, meaning sampling of their waste streams is being used to determine the contamination rate, which is applied to their waste collection.`}</div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Waste_Iso.png" />
                                    <div>
                                        Weight Collected
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Collection_Iso.png" />
                                    <div>
                                        Waste Collections
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Streams_Iso.png" />
                                    <div>
                                        Total Streams
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Sorting_Iso.png" />
                                    <div>
                                        Percentage Sorted
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Contamination_Iso.png" />
                                    <div>
                                        Contamination
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Collection_Carbon_Iso.png" />
                                    <div className="font-bold text-xl">
                                        2360&nbsp;<span className="text-base font-semibold">kg</span>
                                    </div>
                                </div>
                                <div>
                                    Collection Carbon
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Emissions_Saving_Iso.png" />
                                    <div className="font-bold text-xl">
                                        2360&nbsp;<span className="text-base font-semibold">kg</span>
                                    </div>
                                </div>
                                <div>
                                    Closed Loop Carbon Saving
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-2 text-center w-[100mm] h-[100mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[100mm] gap-y-6 py-[5mm] items-center">
                                <div className="font-semibold text-lg">
                                    Stream Capture Rate
                                </div>
                                <div>
                                    <DonutProgress data={parseFloat("0.77") * 100} duration={0} colour="#49cc73" backgroundColour="#ececec" size={250} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className={`relative w-[210mm] h-[297mm] order-${1 + 1}`}>
                    <img className="absolute -z-10 w-[210mm] h-[297mm]" src="/template.jpg" />

                    <div className="grid grid-cols-4 h-fit pt-[180px] px-[8mm] pb-[140px] place-items-center">
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Products</div>
                            <div className="text-left">{`The Rubbish Portal gathers product data including the material and weight to aid in the tracking process. ${router.query?.venue} has a total of 2 products, and has had a total of 200,000 products delivered during this reporting period. Product carbon impact is calculated using the embodied carbon of the material and the quantity consumed.`}</div>
                        </div>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[50mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Deliveries</div>
                            <div className="text-left">{`For any product being tracked, every delivery made to the venue should be logged. ${router.query?.venue} has logged 3 deliveries during this reporting period, totalling 200,000 products delivered. Delivery distances are calculated and carbon associated from this journey is calculated in line with the GHG protocol.`}</div>
                        </div>
                        <div className={`col-span-4 flex flex-col items-center justify-start h-[45mm] gap-y-4`}>
                            <div className="text-3xl text-left w-full font-semibold">Stock Checks</div>
                            <div className="text-left">{`Stock checks are vital for calculating the actual consumption figures for products. Within this reporting period, ${router.query?.venue} has completed 2 stock checks, allowing The Portal to calculate a consumption figure of 150,000 products.`}</div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Used_Iso.png" />
                                    <div>
                                        Products Used
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Delivered_Iso.png" />
                                    <div>
                                        Products Delivered
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Products_Iso.png" />
                                    <div>
                                        Total Products
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Delivery_Iso.png" />
                                    <div>
                                        Deliveries
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Product_Emissions_Iso.png" />
                                    <div>
                                        Product Carbon
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Delivery_Carbon_Iso.png" />
                                    <div>
                                        Delivery Carbon
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Deliveries_Iso.png" />
                                    <div>
                                        Current Stock
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-1 text-center w-[50mm] h-[50mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[50mm] gap-y-2 items-center">
                                <div className="flex flex-col items-center">
                                    <img className="w-[30mm]" src="/Deliveries_Iso.png" />
                                    <div>
                                        Current Stock
                                    </div>
                                </div>
                                <div className="font-bold text-xl">
                                    2360&nbsp;<span className="text-base font-semibold">kg</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-span-2 text-center w-[100mm] h-[100mm] grid grid-cols-1 place-content-center`}>
                            <div className="flex flex-col h-[100mm] gap-y-6 py-[5mm] items-center">
                                <div className="font-semibold text-lg">
                                    Product Capture Rate
                                </div>
                                <div>
                                    <DonutProgress data={parseFloat("0.77") * 100} duration={0} colour="#49cc73" backgroundColour="#ececec" size={250} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div> */}
            </main>
        </>

    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // const tempData = {
    //     templateArray: [{ "id": "item1", "title": "Products Text", "imageUrl": "/full_width_products_text.png", "width": 2, "height": 95, "printHeight": 40 }, { "id": "item3", "title": "General Streams Info", "imageUrl": "/half_width_general_streams_info.png", "width": 1, "height": 195, "printHeight": 95 }, { "id": "item6", "title": "Streams Donut", "imageUrl": "/half_width_streams_donut.png", "width": 1, "height": 195, "printHeight": 95 }, { "id": "item5", "title": "Recycling Recovery Donut", "imageUrl": "/half_width_recycling_recovery_donut.png", "width": 1, "height": 195, "printHeight": 95 }, { "id": "item4", "title": "Capture Rate Donut", "imageUrl": "/half_width_product_capture_rate_donut.png", "width": 1, "height": 195, "printHeight": 95 }, { "id": "item2", "title": "Waste Lifecycle", "imageUrl": "/full_width_waste_lifecycle.png", "width": 2, "height": 150, "printHeight": 66 }],
    //     pageIndices: [{ "start": 0, "end": 5 }, { "start": 5 }],
    //     venue: "Example Venue"
    // }

    const template = await prisma?.temporary_Storage.findFirst({
        where: {
            record_id: context.query.temp_id
        }
    })

    const templateData = JSON.stringify(template?.data)

    // const now = new Date()


    return {
        props: {
            templateData
        },
    };
};

export default PuppeteerCustomReportGenerator