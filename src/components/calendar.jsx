import { useCalendar, useCalendarGrid, useCalendarCell, useDateFormatter, useLocale } from 'react-aria'
import { useCalendarState } from 'react-stately'
import { createCalendar, getWeeksInMonth, parseDateTime } from '@internationalized/date'
import * as React from 'react'
import Button from '../components/button'

// Reuse the Button from your component library. See below for details.

function formatDate (date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export default function Calendar ({ setIsOpen, yearOptions = [-43, 1], ...props }) {
  const { locale } = useLocale()
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar
  })

  const ref = React.useRef()
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state,
    ref
  )

  return (
        <div {...calendarProps} ref={ref} className="border shadow-lg bg-white w-full h-fit rounded-xl">
            <div className="p-2 bg-secondarywhite text-black text-center rounded-t-xl">
                <div className='flex justify-between'>
                    <Button {...prevButtonProps}>&lt;</Button>
                    {/* <h2>{title}</h2> */}
                    <div className={'flex text-sm'}>
                        <MonthDropdown state={state} />
                        <YearDropdown state={state} yearOptions={yearOptions} />
                    </div>
                    <Button {...nextButtonProps}>&gt;</Button>
                </div>
            </div>
            <CalendarGrid state={state} setIsOpen={setIsOpen} />
        </div>
  )
}

function MonthDropdown ({ state }) {
  const months = []
  const formatter = useDateFormatter({
    month: 'long',
    timeZone: state.timeZone
  })

  // Format the name of each month in the year according to the
  // current locale and calendar system. Note that in some calendar
  // systems, such as the Hebrew, the number of months may differ
  // between years.
  const numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate)
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i })
    months.push(formatter.format(date.toDate(state.timeZone)))
  }

  const onChange = (e) => {
    const value = Number(e.target.value)
    const date = state.focusedDate.set({ month: value })
    state.setFocusedDate(date)
  }

  return (
        <select
            aria-label="Month"
            onChange={onChange}
            className={'bg-white text-center py-2'}
        >
            {months.map((month, i) => (
                <>
                    {state.focusedDate.month == i + 1 && (
                        <>
                            <option className='text-center' key={i} value={i + 1} selected>
                                {month}
                            </option>
                        </>
                    )}
                    {state.focusedDate.month != i + 1 && (
                        <>
                            {/* {console.log("state.focusedDate", state.focusedDate)} */}
                            {/* {console.log("state.focusedDate", state.focusedDate)} */}
                            <option className='text-center' key={i} value={i + 1}>
                                {month}
                            </option>
                        </>
                    )}
                </>
            ))}
        </select>
  )
}

function YearDropdown ({ state, yearOptions }) {
  const years = []
  const formatter = useDateFormatter({
    year: 'numeric',
    timeZone: state.timeZone
  })

  // Format 20 years on each side of the current year according
  // to the current locale and calendar system.
  // for (let i = -20; i <= 20; i++) {
  const todaysDate = formatDate(new Date())
  const todaysCalendarDate = parseDateTime(todaysDate)
  for (let i = yearOptions[0]; i <= yearOptions[1]; i++) {
    const date = todaysCalendarDate.add({ years: i })
    years.push({
      value: date,
      formatted: formatter.format(date.toDate(state.timeZone))
    })
  }

  const onChange = (e) => {
    const index = Number(e.target.value)
    const date = years[index].value
    state.setFocusedDate((prevDate) => prevDate.set({ year: date.year }))
    // state.setFocusedDate(JSON.parse(e.target.value));
  }

  return (
        <select
            aria-label="Year"
            onChange={onChange}
            className={'bg-white text-center py-2'}
        >
            {years.map((year, i) => (
                // use the index as the value so we can retrieve the full
                // date object from the list in onChange. We cannot only
                // store the year number, because in some calendars, such
                // as the Japanese, the era may also change.
                <>
                    {year.value.year == state.focusedDate.year && (
                        <>
                            {/* {console.log("year.value", year.value)} */}
                            <option className='text-center' key={i} value={i} selected>
                                {/* <option key={i} value={JSON.stringify(year.value)} selected={year.formatted == state.focusedDate}> */}
                                {year.formatted}
                            </option>
                        </>
                    )}
                    {year.value.year != state.focusedDate.year && (
                        <>
                            {/* {console.log("year.value", year.value)}
                            {console.log("state.focusedDate", state.focusedDate)} */}
                            <option className='text-center' key={i} value={i}>
                                {/* <option key={i} value={JSON.stringify(year.value)} selected={year.formatted == state.focusedDate}> */}
                                {year.formatted}
                            </option>
                        </>
                    )}

                </>
            ))}
        </select>
  )
}

function CalendarGrid ({ state, setIsOpen, ...props }) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

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
  )
}

function CalendarCell ({ state, date, setIsOpen }) {
  const ref = React.useRef()
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref)

  const { onClick: onClickProp, ...restOfButtonProps } = buttonProps

  const newformattedDate = <div className='text-center'>{formattedDate}</div>

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
  )
}
