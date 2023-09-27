import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';
// Selection
import { select, pointer } from 'd3-selection';

// Scales
import { scaleOrdinal, scaleTime, scaleLinear } from 'd3-scale';

// Line generator
import { line } from 'd3-shape';

// Extent and bisector
import { extent, bisector } from 'd3-array';

// Pointer for interaction
// import { pointer } from 'd3-selection-multi';

// Time formatting
import { timeFormat } from 'd3-time-format';

// Axes
import { axisBottom, axisLeft } from 'd3-axis';


const capitalizeText = (text) => {
    const firstLetter = text.slice(0, 1).toUpperCase()
    const rest = text.slice(1)
    return `${firstLetter}${rest}`
}

function weekNumber(date) {
    // Compute the day-of-year number
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Compute week number
    return Math.ceil((dayOfYear + (start.getDay() + 1)) / 7);
}


const LineGraph = ({ data, monthsTicks = 4, xValue = "time", yValue = "value", graphWidth = 550, graphHeight = 400, weekNumberTicks = false, xAxisTitle = "", yAxisTitle = "", verticalTooltip = true, lineLimit = 4, showPositiveSign = false, decimalPlaces = 2 }) => {
    let tooltipTimeout;
    const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

    const ref = useRef();

    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (!Array.isArray(entries)) return;
            if (!entries.length) return;

            const entry = entries[0];

            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        });

        resizeObserver.observe(ref.current);

        return () => resizeObserver.disconnect();
    }, [ref]);


    useEffect(() => {
        if (!ref.current) return;
        if (dimensions.width === 0 || dimensions.height === 0) return;

        select(ref.current).selectAll("*").remove();
        if (data[0]?.data != undefined) {

            const margin = { top: 20, right: 30, bottom: 40, left: 60 },
                width = dimensions.width - margin.left - margin.right,
                height = dimensions.height - margin.top - margin.bottom;
            // width = graphWidth - margin.left - margin.right,
            // height = graphHeight - margin.top - margin.bottom;

            // const colors = scaleOrdinal(schemeCategory10);
            const colors = scaleOrdinal().range(['#051D6D', '#44B549', '#3BBCAC', '#D060D6']);

            const svg = select(ref.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const x = scaleTime().range([0, width]);
            const y = scaleLinear().range([height, 0]);

            const graphLine = line()
                .x(d => x(new Date(d[xValue])))
                .y(d => y(d[yValue]));

            const allData = data.reduce((acc, series) => acc.concat(series.data), []);

            const timeDomain = extent(allData, d => new Date(d[xValue]));
            const timeRange = timeDomain[1] - timeDomain[0];
            const timepadding = timeRange * 0.1; // 10% padding

            // Adjusted dates
            const minDate = new Date(timeDomain[0].getTime() - timepadding);
            const maxDate = new Date(timeDomain[1].getTime() + timepadding);

            const valueDomain = extent(allData, d => d[yValue]);
            const valuepadding = Math.abs(valueDomain[1] - valueDomain[0]) * 0.1; // 10% padding

            console.log("valueDomain", valueDomain, "valuepadding", valuepadding, data[0].name)

            x.domain([minDate, maxDate]);
            y.domain([parseFloat(valueDomain[0]) - valuepadding, parseFloat(valueDomain[1]) + valuepadding]);

            console.log("y bottom", valueDomain[0] - valuepadding, "y top", valueDomain[1] + valuepadding, data[0].name)
            // x.domain(timeDomain);
            // y.domain(valueDomain);

            const tooltip = select("body").append("div")
                .attr("id", tooltipId)
                .attr("class", "tooltip")
                .style("opacity", 0);

            // Create a tooltip div that is hidden by default:
            var newTooltip = select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            if (verticalTooltip == true && data.length < lineLimit) {

                const overlay = svg.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('fill', 'none')
                    .attr('pointer-events', 'all');

                const verticalLine = svg.append('line')
                    .attr('stroke', '#aaa')
                    .attr('y1', 0)
                    .attr('y2', height)
                    .attr('x', 10)
                    // .attr('x2', 0)
                    .attr('opacity', 0);

                overlay.on('mousemove', function (event) {
                    // clearTimeout(tooltipTimeout);
                    const [mx] = pointer(event);

                    // tooltipTimeout = setTimeout(() => {
                    // Place your tooltip update logic here

                    const date = x.invert(mx);

                    // We will get the nearest x-value for each series 
                    // and store the respective y-values along with series names
                    const tooltipData = [];

                    // const overallClosestDate = data.reduce((acc, obj) => {
                    //     if (new Date(obj[xValue]) > acc) {
                    //         acc = new Date(obj[xValue])
                    //     }
                    //     return acc;
                    // }, new Date('1800-01-01T00:00:00'))

                    data.forEach(series => {
                        const bisectDate = bisector(d => new Date(d[xValue])).left;
                        let idx = bisectDate(series.data, date);

                        if (idx == 0) {
                            const bisectDate2 = bisector(d => new Date(d[xValue])).right;
                            idx = bisectDate2(series.data, date);

                        }

                        console.log("idx", idx)

                        const d0 = series.data[idx - 1];
                        const d1 = series.data[idx];
                        const d = !d1 ? d0 : (!d0 ? d1 : (date - new Date(d0[xValue]) > new Date(d1[xValue]) - date ? d1 : d0));

                        if (d0 != undefined) {
                            tooltipData.push({
                                name: series.name,
                                value: d0[yValue],
                                time: d0[xValue]
                            });
                        } else {
                            tooltipData.push({
                                name: series.name,
                                value: d1[yValue],
                                time: d1[xValue]
                            });
                        }
                    });

                    const overallClosestDate = tooltipData.reduce((acc, obj) => {
                        if (new Date(obj.time) > acc) {
                            acc = new Date(obj.time)
                        }
                        return acc;
                    }, new Date('1800-01-01T00:00:00'))

                    const filteredTooltipData = tooltipData.filter((tooltip) => new Date(tooltip.time).getDate() == overallClosestDate.getDate())

                    console.log("overallClosestDate", overallClosestDate)
                    console.log("filteredTooltipData", filteredTooltipData)

                    // Setting position for vertical line based on nearest x-point
                    const closestX = filteredTooltipData[0] && filteredTooltipData[0].time;

                    console.log("Mouse X:", mx);
                    console.log("Closest Data X:", closestX);
                    console.log("Mapped X:", x(closestX));

                    verticalLine
                        .attr('x1', x(new Date(closestX)))
                        .attr('x2', x(new Date(closestX)))
                        .attr('opacity', 1);

                    // Constructing tooltip content
                    const closestDate = new Date(closestX)
                    const closestDateString = `${closestDate.getDate()}-${closestDate.getMonth() + 1}-${closestDate.getFullYear()}`
                    let tooltipX = `${closestDateString}<br/>`
                    let tooltipY = filteredTooltipData.map(item => item.name != "" ? `${item.name}: ${showPositiveSign ? parseFloat(item.value) > 0 ? "+" : "" : ""}${Number(item.value).toFixed(decimalPlaces)}` : `${Number(item.value).toFixed(decimalPlaces)}`).join('<br/>');
                    let tooltipContent = tooltipX + tooltipY

                    tooltip
                        .html(tooltipContent)
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 28) + 'px')
                        .style('opacity', 1);
                    // }, 0);

                });

                svg.on('mouseleave', function () {
                    tooltip.style('opacity', 0);
                    verticalLine.attr('opacity', 0);
                });
            }


            // Define a mousemove event for the SVG canvas
            // svg.on("mousemove", function (event) {
            //     // Get mouse coordinates in SVG-space
            //     var mouse = pointer(event);

            //     // Convert those coordinates into your graph's domain
            //     var x0 = x.invert(mouse[0]),
            //         y0 = y.invert(mouse[1]);

            //     // Update the newTooltip position and value
            //     newTooltip.style("left", (event.pageX - 65) + "px")
            //         .style("top", (event.pageY - 35) + "px")
            //         .style("opacity", 1)
            //         .html("y: " + y0);
            // });

            // // Hide newTooltip when mouse leaves the SVG canvas
            // svg.on("mouseleave", function (event) {
            //     newTooltip.style("opacity", 0);
            // });

            // data.forEach((series, i) => {
            //     svg.append("path")
            //         .datum(series.data)
            //         .attr("fill", "none")
            //         .attr("stroke", colors(i))
            //         .attr("stroke-width", 1.5)
            //         .attr("class", `line line-${i}`)
            //         .attr("d", line);

            //     series.data.forEach((d) => {
            //         svg.append("circle")
            //             .attr("class", "dot")
            //             .attr("cx", x(new Date(d.time)))
            //             .attr("cy", y(d.value))
            //             .attr("r", 7)
            //             .style("fill", colors(i))
            //             .on("mouseover", function (e) {
            //                 const pointTime = new Date(d.time);
            //                 const month = pointTime.toLocaleString('default', { month: 'long' });
            //                 const year = pointTime.toLocaleString('default', { year: 'numeric' });
            //                 tooltip.transition()
            //                     .duration(200)
            //                     .style("opacity", .9);
            //                 tooltip.html(`${month} ${year}: ${d.value}`)
            //                     // .style("left", (x(new Date(d.time))) + "px")
            //                     // .style("top", (y(d.value)) + "px");
            //                     .style("left", (e.pageX - 65) + "px")
            //                     .style("top", (e.pageY - 35) + "px");
            //             })
            //             .on("mouseout", function (e) {
            //                 tooltip.transition()
            //                     .duration(500)
            //                     .style("opacity", 0);
            //             });
            //     });
            // });

            data.forEach((series, i) => {
                let visiblePath = svg.append("path")
                    .datum(series.data)
                    .attr("fill", "none")
                    .attr("stroke", colors(i))
                    .attr("stroke-width", 1.5)
                    .attr("class", `line line-${i}`)
                    .attr("d", graphLine);
                let invisiblePath = svg.append("path")
                    .datum(series.data)
                    .attr("fill", "none")
                    .attr("stroke", colors(i))
                    .attr("stroke-width", 10)
                    .attr("stroke-opacity", 0)
                    .attr("class", `line line-${i}`)
                    .attr("d", graphLine);

                if (series.dottedLine) {
                    visiblePath.attr("stroke-dasharray", ("3, 3")) // this will create a dotted line
                } else if (verticalTooltip) {
                    if (data.length < lineLimit) {

                    } else {
                        const verticalLine = svg.append('line')
                            .attr('stroke', '#aaa')
                            .attr('y1', 0)
                            .attr('y2', height)
                            .attr('x', 10)
                            // .attr('x2', 0)
                            .attr('opacity', 0);

                        invisiblePath.on('mousemove', function (event) {
                            // clearTimeout(tooltipTimeout);
                            const [mx] = pointer(event);

                            // this.parentNode.appendChild(this);
                            // select(this).transition()
                            //     .duration(200)
                            //     .attr("stroke-width", 6);

                            // tooltipTimeout = setTimeout(() => {
                            // Place your tooltip update logic here

                            const date = x.invert(mx);

                            // We will get the nearest x-value for each series 
                            // and store the respective y-values along with series names
                            const tooltipData = [];


                            const bisectDate = bisector(d => new Date(d[xValue])).left;
                            const idx = bisectDate(series.data, date);

                            const d0 = series.data[idx - 1];
                            const d1 = series.data[idx];
                            const d = !d1 ? d0 : (!d0 ? d1 : (date - new Date(d0[xValue]) > new Date(d1[xValue]) - date ? d1 : d0));

                            tooltipData.push({
                                name: series.name,
                                value: d[yValue],
                                time: d[xValue]
                            });


                            // Setting position for vertical line based on nearest x-point
                            const closestX = tooltipData[0] && tooltipData[0].time;

                            console.log("Mouse X:", mx);
                            console.log("Closest Data X:", closestX);
                            console.log("Mapped X:", x(closestX));

                            verticalLine
                                .attr('x1', x(new Date(closestX)))
                                .attr('x2', x(new Date(closestX)))
                                .attr('opacity', 1);

                            // Constructing tooltip content
                            let closestDate = new Date();
                            let closestDateString;
                            if (weekNumberTicks) {
                                closestDateString = weekNumber(new Date(closestX))
                            } else {
                                closestDate = new Date(closestX)
                                closestDateString = `${closestDate.getDate()}-${closestDate.getMonth() + 1}-${closestDate.getFullYear()}`
                            }
                            let tooltipX = `${closestDateString}<br/>`
                            let tooltipY = tooltipData.map(item => `${item.name}: ${showPositiveSign ? parseFloat(item.value) > 0 ? "+" : "" : ""}${(item.value)}`).join('<br/>');
                            let tooltipContent = tooltipX + tooltipY

                            tooltip
                                .html(tooltipContent)
                                .style('left', (event.pageX + 15) + 'px')
                                .style('top', (event.pageY - 28) + 'px')
                                .style('opacity', 1);
                            // }, 0);

                        })
                            .on('mouseleave', function () {
                                // select(this).transition()
                                //     .duration(200)
                                //     .attr("stroke-width", 1.5);
                                tooltip.style('opacity', 0);
                                verticalLine.attr('opacity', 0);
                            });
                    }
                } else if (series.noCircles) {
                    if (series.noHover) {
                        invisiblePath.on("mousemove", function (event) {
                            // Get mouse coordinates in SVG-space
                            var mouse = pointer(event);

                            // Convert those coordinates into your graph's domain
                            var x0 = x.invert(mouse[0]),
                                y0 = y.invert(mouse[1]);

                            // Update the newTooltip position and value
                            newTooltip.style("left", (event.pageX - 65) + "px")
                                .style("top", (event.pageY - 35) + "px")
                                .style("opacity", 1)
                                .html("y: " + (y0).toFixed(2));
                        })
                            .on("mouseleave", function (event) {
                                newTooltip.style("opacity", 0);
                            });
                        // path.on("mouseover", function (e, d) {
                        //     tooltip.transition()
                        //         .duration(200)
                        //         .style("opacity", .9);
                        //     tooltip.html(`${y(e.pageY)}`)
                        //         .style("left", (e.pageX - 65) + "px")
                        //         .style("top", (e.pageY - 35) + "px")
                        //         .style("padding",);
                        // })
                        //     .on("mouseout", function (e) {
                        //         select(this).transition()
                        //             .duration(200)
                        //             .attr("stroke-width", 1.5);
                        //         tooltip.transition()
                        //             .duration(500)
                        //             .style("opacity", 0);
                        //     });
                    } else {
                        invisiblePath.on("mouseover", function (event, d) {
                            var mouse = pointer(event);

                            // Convert those coordinates into your graph's domain
                            var x0 = x.invert(mouse[0]),
                                y0 = y.invert(mouse[1]);

                            this.parentNode.appendChild(this);
                            select(this).transition()
                                .duration(200)
                                .attr("stroke-width", 6);
                            // tooltip.transition()
                            //     .duration(200)
                            //     .style("opacity", .9);
                            // tooltip.html(`${capitalizeText(series.name)}<br/>${(y0).toFixed(0)}`)
                            //     .style("left", (e.pageX - 65) + "px")
                            //     .style("top", (e.pageY - 35) + "px")
                            //     .style("padding",);
                        })
                            .on("mouseout", function (e) {
                                select(this).transition()
                                    .duration(200)
                                    .attr("stroke-width", 1.5);
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });
                    }
                } else {
                    invisiblePath.on("mouseover", function (e, d) {
                        select(this).transition()
                            .duration(200)
                            .attr("stroke-width", 6);
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(`${capitalizeText(series.name)}`)
                            .style("left", (e.pageX - 65) + "px")
                            .style("top", (e.pageY - 35) + "px")
                            .style("padding",);
                    })
                        .on("mouseout", function (e) {
                            select(this).transition()
                                .duration(200)
                                .attr("stroke-width", 1.5);
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                    series.data.forEach((d) => {
                        svg.append("circle")
                            .attr("class", "dot")
                            .attr("cx", x(new Date(d[xValue])))
                            .attr("cy", y(d[yValue]))
                            .attr("r", 7)
                            .style("fill", colors(i))
                            .on("mouseover", function (e) {
                                const pointTime = new Date(d[xValue]);
                                const dayOfMonth = pointTime.toLocaleString('default', { day: '2-digit' });
                                const month = pointTime.toLocaleString('default', { month: 'long' });
                                const year = pointTime.toLocaleString('default', { year: 'numeric' });
                                tooltip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                tooltip.html(`${dayOfMonth} ${month} ${year}: ${(d[yValue]).toFixed(2)}`)
                                    .style("left", (e.pageX - 65) + "px")
                                    .style("top", (e.pageY - 35) + "px")
                                    .style("padding",);
                            })
                            .on("mouseout", function (e) {
                                tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });
                    });
                }
            });

            const monthFormat = timeFormat("%B");
            const yearFormat = timeFormat("%Y");

            if (weekNumberTicks) {
                const xAxis = axisBottom(x)
                    .ticks(10)
                    // .ticks(timeMonday)
                    .tickFormat(d => weekNumber(d));

                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis);
            } else {
                const xAxis = axisBottom(x)
                    .ticks(4)
                    .tickFormat(d => `${monthFormat(d)}${d.getMonth() === 0 ? ` ${yearFormat(d)}` : ""}`);

                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis);
            }



            // svg.append("g")
            //     .attr("transform", `translate(0, ${height})`)
            //     .call(axisBottom(x));

            svg.append("g")
                .call(axisLeft(y));

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(yAxisTitle);

            svg.append("text")
                .attr("transform",
                    "translate(" + (width / 2) + " ," +
                    (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text(xAxisTitle);

        }
        return () => {
            select(`#${tooltipId}`).remove();
        }
    }, [data, xValue, yValue, dimensions]);

    return (
        // <div id='lineGraph' className='-mb-10'>
        <div id='lineGraph' className='relative w-full h-[400px] px-4'>
            <div className='absolute pointer-events-none inset-0 grid place-content-center'>
                <img src='/macrovesta_watermark.png' className='w-[200px]' />
            </div>
            <svg className="w-full h-full -mb-7" ref={ref} style={{ width: '100%', maxHeight: '450px' }} />
        </div>
    );
};

export default LineGraph;
