import { useCalendar, useCalendarGrid, useCalendarCell, useLocale } from 'react-aria';
import { useCalendarState } from 'react-stately';
import { createCalendar, getWeeksInMonth } from '@internationalized/date';
import * as React from 'react';
import Button from '../components/button';

// Reuse the Button from your component library. See below for details.

export default function Calendar({ setIsOpen, ...props }) {
    let { locale } = useLocale();
    let state = useCalendarState({
        ...props,
        locale,
        createCalendar
    });

    let ref = React.useRef();
    let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
        props,
        state,
        ref
    );

    return (
        <div {...calendarProps} ref={ref} className="border shadow-lg bg-white w-full h-fit rounded-xl">
            <div className="p-2 bg-secondarywhite text-black text-center rounded-t-xl">
                <div className='flex justify-between'>
                    <Button {...prevButtonProps}>&lt;</Button>
                    <h2>{title}</h2>
                    <Button {...nextButtonProps}>&gt;</Button>
                </div>
            </div>
            <CalendarGrid state={state} setIsOpen={setIsOpen} />
        </div>
    );
}


function CalendarGrid({ state, setIsOpen, ...props }) {
    let { locale } = useLocale();
    let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

    return (
        <table className=' bg-secondarywhite w-full rounded-b-xl' {...gridProps}>
            <thead {...headerProps}>
                <tr>
                    {weekDays.map((day, index) => <th className="text-primary" key={index}>{day}</th>)}
                </tr>
            </thead>
            <tbody>
                {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
                    <tr key={weekIndex}>
                        {state.getDatesInWeek(weekIndex).map((date, i) => (
                            date
                                ? (
                                    <CalendarCell
                                        key={i}
                                        state={state}
                                        date={date}
                                        setIsOpen={setIsOpen}

                                    />
                                )
                                : <td key={i} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


function CalendarCell({ state, date, setIsOpen }) {
    let ref = React.useRef();
    let {
        cellProps,
        buttonProps,
        isSelected,
        isOutsideVisibleRange,
        isDisabled,
        isUnavailable,
        formattedDate
    } = useCalendarCell({ date }, state, ref);

    let { onClick: onClickProp, ...restOfButtonProps } = buttonProps

    let newformattedDate = <div className='text-center'>{formattedDate}</div>

    return (
        <td {...cellProps}>
            <div
                {...restOfButtonProps}
                onClick={() => { setIsOpen(false); onClickProp }}
                ref={ref}
                hidden={isOutsideVisibleRange}
                className={`cell p-1 rounded-xl text-black font-semibold ${isDisabled ? 'text-gray-400' : 'hover:bg-gray-300'
                    } ${isUnavailable ? 'text-red-500' : ''} ${isSelected ? 'text-white bg-black hover:bg-black' : ''}`}
            >
                {newformattedDate}
            </div>
        </td>
    );
}