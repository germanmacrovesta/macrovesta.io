import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        d3.select(ref.current).selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 60 },
            width = 550 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // const colors = d3.scaleOrdinal(d3.schemeCategory10);
        const colors = d3.scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549']);

        const svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const line = d3.line()
            .x(d => x(new Date(d.time)))
            .y(d => y(d.value));

        const allData = data.reduce((acc, series) => acc.concat(series.data), []);

        const timeDomain = d3.extent(allData, d => new Date(d.time));
        const timeRange = timeDomain[1] - timeDomain[0];
        const timepadding = timeRange * 0.1; // 10% padding

        // Adjusted dates
        const minDate = new Date(timeDomain[0].getTime() - timepadding);
        const maxDate = new Date(timeDomain[1].getTime() + timepadding);

        const valueDomain = d3.extent(allData, d => d.value);
        const valuepadding = Math.abs(valueDomain[1] - valueDomain[0]) * 0.1; // 10% padding

        x.domain([minDate, maxDate]);
        y.domain([valueDomain[0] - valuepadding, valueDomain[1] + valuepadding]);
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
            } else {
                series.data.forEach((d) => {
                    svg.append("circle")
                        .attr("class", "dot")
                        .attr("cx", x(new Date(d.time)))
                        .attr("cy", y(d.value))
                        .attr("r", 7)
                        .style("fill", colors(i))
                        .on("mouseover", function (e) {
                            const pointTime = new Date(d.time);
                            const month = pointTime.toLocaleString('default', { month: 'long' });
                            const year = pointTime.toLocaleString('default', { year: 'numeric' });
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip.html(`${month} ${year}: ${d.value}`)
                                .style("left", (e.pageX - 65) + "px")
                                .style("top", (e.pageY - 35) + "px");
                        })
                        .on("mouseout", function (e) {
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                });
            }
        });


        const monthFormat = d3.timeFormat("%B");
        const yearFormat = d3.timeFormat("%Y");

        const xAxis = d3.axisBottom(x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d => `${monthFormat(d)}${d.getMonth() === 0 ? ` ${yearFormat(d)}` : ""}`);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // svg.append("g")
        //     .attr("transform", `translate(0, ${height})`)
        //     .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));

    }, [data]);

    return (
        <div id='lineGraph' className='-mb-10'>
            <svg ref={ref} />
        </div>
    );
};

export default LineGraph;
