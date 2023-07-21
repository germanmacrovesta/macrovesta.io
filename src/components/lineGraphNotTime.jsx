import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineGraphNotTime = ({ data, monthsTicks = 4, xValue = "x", yValue = "y", graphWidth = 550, graphHeight = 400, xDomain1 = 0, xDomain2 = 17 }) => {
    const ref = useRef();


    useEffect(() => {
        d3.select(ref.current).selectAll("*").remove();
        if (data[0]?.data != undefined) {

            const margin = { top: 20, right: 30, bottom: 40, left: 60 },
                width = graphWidth - margin.left - margin.right,
                height = graphHeight - margin.top - margin.bottom;

            // const colors = d3.scaleOrdinal(d3.schemeCategory10);
            const colors = d3.scaleOrdinal().range(['#44B549', '#051D6D', '#3BBCAC', '#D060D6', '#051D38']);

            const svg = d3.select(ref.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            const x = d3.scaleLinear().range([0, width]);
            const y = d3.scaleLinear().range([height, 0]);

            const line = d3.line()
                .x(d => x(d[xValue]))
                .y(d => y(d[yValue]));

            const allData = data.reduce((acc, series) => acc.concat(series.data), []);

            const timeDomain = d3.extent(allData, d => d[xValue]);
            const timeRange = Math.abs(timeDomain[1] - timeDomain[0]);
            const timepadding = timeRange * 0.1; // 10% padding

            // Adjusted dates
            const minDate = timeDomain[0] - timepadding;
            const maxDate = timeDomain[1] + timepadding;

            const valueDomain = d3.extent(allData, d => parseFloat(d[yValue]));
            const valuepadding = Math.abs(parseFloat(valueDomain[1]) - parseFloat(valueDomain[0])) * 0.1; // 10% padding

            console.log("valueDomain", valueDomain, "valuepadding", valuepadding, data[0].name)

            x.domain([xDomain1, xDomain2]);
            y.domain([parseFloat(valueDomain[0]) - valuepadding, parseFloat(valueDomain[1]) + valuepadding]);

            console.log("y bottom", valueDomain[0] - valuepadding, "y top", valueDomain[1] + valuepadding, data[0].name)
            // x.domain(timeDomain);
            // y.domain(valueDomain);

            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

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
                let path = svg.append("path")
                    .datum(series.data)
                    .attr("fill", "none")
                    .attr("stroke", colors(i))
                    .attr("stroke-width", 1.5)
                    .attr("class", `line line-${i}`)
                    .attr("d", line);

                if (series.dottedLine) {
                    path.attr("stroke-dasharray", ("3, 3")) // this will create a dotted line
                } else if (series.noCircles) {

                } else {
                    series.data.forEach((d) => {
                        svg.append("circle")
                            .attr("class", "dot")
                            .attr("cx", x(d[xValue]))
                            .attr("cy", y(d[yValue]))
                            .attr("r", 7)
                            .style("fill", colors(i))
                            .on("mouseover", function (e) {
                                const pointTime = d[xValue];
                                // const dayOfMonth = pointTime.toLocaleString('default', { day: '2-digit' });
                                // const month = pointTime.toLocaleString('default', { month: 'long' });
                                // const year = pointTime.toLocaleString('default', { year: 'numeric' });
                                tooltip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                tooltip.html(`Month ${d[xValue]}: ${d[yValue]}`)
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


            // const monthFormat = d3.timeFormat("%B");
            // const yearFormat = d3.timeFormat("%Y");

            const xAxis = d3.axisBottom(x)
                .tickValues(d3.range(xDomain1, xDomain2 + 1));

            // svg.append("g")
            //     .attr("transform", `translate(0, ${height})`)
            //     .call(xAxis);

            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            svg.append("g")
                .call(d3.axisLeft(y));

            // svg.append("g")
            //     .call(d3.axisBottom(x));

        }
    }, [data, xValue, yValue]);

    return (
        <div id='lineGraph' className='-mb-10'>
            <svg ref={ref} />
        </div>
    );
};

export default LineGraphNotTime;
