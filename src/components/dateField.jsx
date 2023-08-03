import { useEffect, useState } from "react";
import Calendar from '../components/calendar';
import { parseDate, getLocalTimeZone, today, isWeekend } from '@internationalized/date';
import { useDateFormatter, useLocale } from 'react-aria';

export default function DateField({ setDate, date, label, formatter }) {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    var temp = new Date();
    var dd = String(temp.getDate()).padStart(2, '0');
    var mm = String(temp.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = temp.getFullYear();

    let todaysDate = `${yyyy}-${mm}-${dd}`;

    // let [date, setDate] = useState(parseDate(todaysDate));
    // let formatter = useDateFormatter({ dateStyle: 'full' });

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const handleChange = (element) => {
        setDate(element)
        toggleMenu();
    }

    console.log(new Date())

    return (
        <>
            <div className='w-full flex'>
                <div className='flex w-full justify-between rounded-lg'>
                    {/* <div className='px-8 py-2'>
                        <label htmlFor={label}>{label}</label>
                    </div> */}
                    <div className='relative flex flex-col justify-center w-full rounded-lg bg-deep_blue text-white py-2'>
                        {/* <input autoComplete="off" className='b bg-transparent w-full h-full p-2 text-center appearance-none' type="text" name={props.label} placeholder={props.placeholder} /> */}
                        <button type="button" className="text-center w-full" onClick={toggleMenu}>
                            {date && (
                                <>
                                    {formatter.format(date.toDate(getLocalTimeZone()))}
                                    {/* {JSON.stringify(new Date(Date.UTC(2023, 3, 25, 12, 0, 0)))} */}
                                    {/* {getLocalTimeZone()} */}
                                    {/* {JSON.stringify(date.toDate("Europe/London"))} */}
                                    {/* {JSON.stringify(new Date())} */}
                                </>
                            )}
                        </button>
                        {isOpen && (
                            <div className="absolute top-10 w-full z-10 opacity-100">
                                <Calendar
                                    setIsOpen={toggleMenu}
                                    aria-label="Date (controlled)"
                                    value={date}
                                    onChange={
                                        setDate} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <div className="relative">
                <button type="button" className="t text-center w-full" onClick={toggleMenu}>{formatter.format(date.toDate(getLocalTimeZone()))}</button>
                {isOpen && (
                    <div className="absolute right-0 z-10 opacity-100 top-8">
                        <Calendar
                            setIsOpen={toggleMenu}
                            aria-label="Date (controlled)"
                            value={date}
                            onChange={
                                setDate} />
                    </div>
                )}
            </div> */}
        </>
    )
}