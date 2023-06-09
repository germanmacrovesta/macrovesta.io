import React from "react";
import { useRouter } from 'next/router'
import Link from "next/link";
// import DropdownMenu from "./sortByDropdownMenu";
import { useSession } from "next-auth/react";

const Sidebar = (props) => {
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const [newVenue, setNewVenue] = React.useState(null);
    const [venueArray, setVenueArray] = React.useState(null);
    const [selectedVenue, setSelectedVenue] = React.useState(null);

    const { data: session } = useSession();

    const router = useRouter()
    const urlPath = router.asPath;
    const splitPath = urlPath.split('/');
    const root = '/' + splitPath[1] + '/' + splitPath[2] + '/' + splitPath[3];
    let active = [];
    if (splitPath.length >= 4) {
        active = ['/' + splitPath[splitPath.length - 1], '/' + splitPath[splitPath.length - 2], '/' + splitPath[splitPath.length - 3], '/' + splitPath[splitPath.length - 4]];
    } else if (splitPath.length >= 3) {
        active = ['/' + splitPath[splitPath.length - 1], '/' + splitPath[splitPath.length - 2], '/' + splitPath[splitPath.length - 3], '/' + splitPath[splitPath.length - 3]];
    }

    // const handleClick = (e, href) => {
    //     e.preventDefault()
    //     router.push(href)
    // }

    const activeVenue = 'ApplePop'

    // async function changeVenue(venue) {

    //     setNewVenue(venue)

    //     // Get data from the form.
    //     const data = {
    //         id: session.user.id,
    //         venue: venue
    //     }

    //     console.log(data);

    //     // Send the data to the server in JSON format.
    //     const JSONdata = JSON.stringify(data)

    //     // API endpoint where we send form data.
    //     const endpoint = '/api/changeVenue'

    //     // Form the request for sending data to the server.
    //     const options = {
    //         // The method is POST because we are sending data.
    //         method: 'POST',
    //         // Tell the server we're sending JSON.
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         // Body of the request is the JSON data we created above.
    //         body: JSONdata,
    //     }

    //     // Send the form data to our forms API on Vercel and get a response.
    //     const response = await fetch(endpoint, options)

    //     // Get the response data from server as JSON.
    //     // If server returns the name submitted, that means the form works.
    //     const result = await response.json()
    //     // alert(result)
    // }

    // React.useEffect(() => {
    //     if (!session) return;
    //     if (session) {
    //         console.log(session.user.venue_list)
    //         const array = session.user.venue_list.split(',')
    //         setVenueArray(array);
    //         setSelectedVenue(session.user.selected_venue);
    //         console.log(selectedVenue)
    //         console.log(`venueArray is: ${venueArray}`)
    //     }
    // }, [session])

    // let VenueOptions = () => {
    //     return (
    //         <>
    //             {venueArray && venueArray.map((venue, index) => (
    //                 <div key={venue} onClick={() => { changeVenue(venue); setOpenDropdown(false) }} className=" text-center py-1 hover:bg-secondarygrey bg-white">
    //                     {venue}

    //                 </div>
    //             ))}
    //         </>
    //     );
    // };

    return (
        <div className="fixed print:hidden h-screen text-md">
            <div className="flex flex-col justify-between bg-gradient-to-br from-navy to-deep_blue w-40 h-full px-4 ">
                <div>
                    <div className="flex justify-center p-4 pb-8">
                        <Link href={{ pathname: `${root}/home` }} >
                            <img className="" width="100%" src="/Portal_Icon.png" />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3 justify-center text-white -mx-4 px-4 pb-4">

                        <div className="relative flex items-center">
                            <img height="20px" className="h-[20px] z-20" src={"favicon.ico"} />
                            <img className={'absolute h-[35px] z-10 -left-[7px]'} src="/Active_Underlay.png" />
                            <Link href={{ pathname: `/Home` }} >
                                <p className={'pl-2 rounded-lg bg-gradient-to-r from-secondary to-primary pr-2'}  >{"Home"}</p>
                            </Link>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col border-t-2 border-grey-700 -mx-4 px-4 pb-3 pt-1">
                    <button className="bg-white text-black px-2 mt-2 text-[10px] w-full rounded-md font-semibold">I Need Some Help</button>
                    <div className="flex justify-between  mt-2">
                        <div className="text-[10px] text-white leading-[12px]">
                            Powered by The Rubbish Portal
                        </div>
                        <div>
                            <Link href={{ pathname: '/about' }} >
                                <img className="w-[48px] aspect-square" src="/Portal_Icon.png" />
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className="relative ">
                    <div>
                        <button
                            className="flex w-full items-center justify-center bg-grey-700 rounded-lg text-white px-2 py-1 hover:text-black"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            {selectedVenue != null && !newVenue && (
                                <>
                                    {selectedVenue}
                                </>
                            )}
                            {newVenue && (
                                <>
                                    {newVenue}
                                </>
                            )}
                            {!selectedVenue && !newVenue && (
                                <>
                                    Venue
                                </>
                            )}
                        </button>
                        {openDropdown && (
                            <div className="absolute cursor-pointer z-50 w-full  text-black shadow-lg">
                                
                                {venueArray && venueArray.map((venue, index) => (
                                    <div key={venue} onClick={() => { changeVenue(venue); setOpenDropdown(false) }} className=" text-center py-1 hover:bg-secondarygrey bg-white first:rounded-t-xl last:rounded-b-xl">
                                        {venue}

                                    </div>
                                ))}
                                
                            </div>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Sidebar;