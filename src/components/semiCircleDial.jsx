// import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// const SemiCircleDial = ({ value = 0 }) => {
//     const ref = useRef();

//     useEffect(() => {
//         const svg = select(ref.current);
//         const width = 200, height = 100;
//         svg.attr("width", width).attr("height", height);

//         // Create a scale to map values to angles
//         const scale = scaleLinear()
//             .domain([-100, 100])
//             .range([-90, 90]);

//         // Draw the semi-circle dial
//         const arc = arc()
//             .innerRadius(height - 70)
//             .outerRadius(height)
//             .startAngle(-Math.PI / 2)
//             .endAngle(Math.PI / 2);

//         const dial = svg.append("path")
//             .attr("d", arc)
//             .attr("transform", `translate(${width / 2},${height})`)
//             .style("fill", "#ccc");

//         // Draw additional arcs
//         const arcAngle = Math.PI / 5; // 36 degrees in radians
//         // const colors = scaleOrdinal(schemeCategory10); // colors for the arcs
//         const colors = scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549', '#3BBCAC', '#051D6D']);
//         const anglesArray = [[- Math.PI / 2, Math.PI / 4], [- Math.PI / 4, Math.PI / 6], [- Math.PI / 12, Math.PI / 6], [Math.PI / 4, - Math.PI / 6], [Math.PI / 2, - Math.PI / 4]]

//         const arcs = []; // keep track of the arcs

//         for (let i = 0; i < 5; i++) {
//             const startAngle = anglesArray[i][0];
//             const endAngle = startAngle + anglesArray[i][1];
//             const arcPath = arc()
//                 .innerRadius(height - 70)
//                 .outerRadius(height)
//                 .startAngle(startAngle)
//                 .endAngle(endAngle);

//             const arcElement = svg.append("path")
//                 .attr("d", arcPath())
//                 .attr("transform", `translate(${width / 2},${height})`)
//                 .style("fill", colors(i));

//             arcs.push({
//                 startAngle,
//                 endAngle,
//                 element: arcElement,
//             });
//         }
//         // const startAngle1 = - Math.PI / 2;
//         // const endAngle1 = startAngle1 + (Math.PI / 4);
//         // const arcPath1 = arc()
//         //     .innerRadius(height - 70)
//         //     .outerRadius(height)
//         //     .startAngle(startAngle1)
//         //     .endAngle(endAngle1);

//         // svg.append("path")
//         //     .attr("d", arcPath1())
//         //     .attr("transform", `translate(${width / 2},${height})`)
//         //     .style("fill", "#051D6D");

//         // const startAngle2 = Math.PI / 2
//         // const endAngle2 = startAngle2 - (Math.PI / 4);
//         // const arcPath2 = arc()
//         //     .innerRadius(height - 70)
//         //     .outerRadius(height)
//         //     .startAngle(startAngle2)
//         //     .endAngle(endAngle2);

//         // svg.append("path")
//         //     .attr("d", arcPath2())
//         //     .attr("transform", `translate(${width / 2},${height})`)
//         //     .style("fill", "#051D6D");

//         // The needle
//         const needle = svg.append("line")
//             .attr("x1", 0)
//             .attr("y1", - height)
//             .attr("x2", 0)
//             .attr("y2", 0)
//             .style("stroke", "#000")
//             .style("stroke-width", 8)
//             .raise();

//         // const transitionNeedle = (newValue) => {
//         //     needle.transition()
//         //         .duration(1000)
//         //         .attrTween("transform", () => {
//         //             const interpolate = interpolate(scale(0), scale(newValue));
//         //             return t => `translate(${width / 2},${height}) rotate(${interpolate(t)})`;
//         //         });
//         // };

//         // transitionNeedle(value);

//         const transitionNeedle = (newValue) => {
//             const targetAngle = scale(newValue);
//             needle.transition()
//                 .duration(1000)
//                 .attrTween("transform", () => {
//                     const interpolate = interpolate(scale(0), targetAngle);
//                     return t => {
//                         const currentAngle = interpolate(t);
//                         arcs.forEach(arc => {
//                             if (currentAngle >= arc.startAngle * 180 / Math.PI && currentAngle < arc.endAngle * 180 / Math.PI) {
//                                 arc.element.style("fill", "green");
//                             } else {
//                                 arc.element.style("fill", "#ccc");
//                             }
//                         });
//                         return `translate(${width / 2},${height}) rotate(${currentAngle})`;
//                     };
//                 });
//         };

//         transitionNeedle(value);

//     }, [value]);

//     return <svg ref={ref}></svg>;
// };

// export default SemiCircleDial;

///////////////////////////////////////////////////////////////////////////////////////////

// import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// const SemiCircleDial = ({ value = 0 }) => {
//     const ref = useRef();

//     useEffect(() => {
//         const svg = select(ref.current);
//         const width = 200, height = 100;
//         svg.attr("width", width).attr("height", height);

//         // Create a scale to map values to angles
//         const scale = scaleLinear()
//             .domain([-100, 100])
//             .range([-90, 90]);

//         // Draw the semi-circle dial
//         const arc = arc()
//             .innerRadius(height - 70)
//             .outerRadius(height)
//             .startAngle(-Math.PI / 2)
//             .endAngle(Math.PI / 2);

//         const dial = svg.append("path")
//             .attr("d", arc)
//             .attr("transform", `translate(${width / 2},${height})`)
//             .style("fill", "#ccc");

//         // Draw additional arcs
//         const arcAngle = Math.PI / 5; // 36 degrees in radians
//         const arcs = []; // keep track of the arcs

//         for (let i = 0; i < 5; i++) {
//             const startAngle = -Math.PI / 2 + arcAngle * i;
//             const endAngle = startAngle + arcAngle;
//             const arcPath = arc()
//                 .innerRadius(height - 70)
//                 .outerRadius(height)
//                 .startAngle(startAngle)
//                 .endAngle(endAngle);

//             const arcElement = svg.append("path")
//                 .attr("d", arcPath())
//                 .attr("transform", `translate(${width / 2},${height})`)
//                 .style("fill", "#ccc");

//             arcs.push({
//                 startAngle,
//                 endAngle,
//                 element: arcElement,
//             });
//         }

//         // The needle
//         const needle = svg.append("line")
//             .attr("x1", 0)
//             .attr("y1", - height)
//             .attr("x2", 0)
//             .attr("y2", 0)
//             .style("stroke", "#000")
//             .style("stroke-width", 3)
//             .attr("transform", `translate(${width / 2},${height})`)
//             .raise();

//         const transitionNeedle = (newValue) => {
//             const targetAngle = scale(newValue);
//             needle.transition()
//                 .duration(1000)
//                 .attrTween("transform", () => {
//                     const interpolate = interpolate(scale(0), targetAngle);
//                     return t => `translate(${width / 2},${height}) rotate(${interpolate(t)})`;
//                 })
//                 .on("end", () => {
//                     arcs.forEach(arc => {
//                         if (targetAngle >= arc.startAngle * 180 / Math.PI && targetAngle <= arc.endAngle * 180 / Math.PI) {
//                             arc.element.style("fill", "green");
//                         } else {
//                             arc.element.style("fill", "#ccc");
//                         }
//                     });
//                 });
//         };

//         transitionNeedle(value);

//     }, [value]);

//     return <svg ref={ref}></svg>;
// };

// export default SemiCircleDial;

////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// Selection
import { select } from 'd3-selection';

// Scales
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale';

// Line generator
import { arc } from 'd3-shape';

// Interpolate
import { interpolate } from 'd3-interpolate';

// Extent and bisector
import { max } from 'd3-array';

// Pointer for interaction
// import { pointer } from 'd3-selection-multi';

// Time formatting
// import { timeFormat } from 'd3-time-format';

// Axes
import { axisBottom, axisLeft } from 'd3-axis';

//Format
// import { format } from 'd3-format';


const SemiCircleDial = ({ value = 0, rangeStart = -100, rangeEnd = 100, arcAxisText = ["100", "60", "0", "60", "100"], leftText = "Inverse", rightText = "Non Inverse", decimals = 0 }) => {
    const random = `rid-${(Math.random() * 10000).toFixed(0)}`
    const ref = useRef();

    useEffect(() => {
        select(ref.current).selectAll("*").remove();

        const svg = select(ref.current);
        const width = 460, height = 230;
        const dialHeight = height - 60;
        const dialWidth = width - 120;
        const labelRadius = dialHeight - 85;
        svg.attr("width", width).attr("height", height);

        let g = svg.append("g")
            .attr("transform", "translate(60,10)");

        // Create a scale to map values to angles
        const scale = scaleLinear()
            .domain([rangeStart, rangeEnd])
            .range([-90, 90]);

        // Draw the semi-circle dial
        const graphArc = arc()
            .innerRadius(dialHeight - 70)
            .outerRadius(dialHeight)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2);

        // const dial = svg.append("path")
        //     .attr("d", arc)
        //     .attr("transform", `translate(${width / 2},${dialHeight})`)
        //     .style("fill", "#ccc");

        // Draw additional arcs
        const colors = scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549', '#3BBCAC', '#051D6D']);
        const arcAngle = Math.PI / 5; // 36 degrees in radians
        const arcs = []; // keep track of the arcs

        // const arcAxisText = ["5", "2.5", "0", "2.5", "5"]
        const arcLabelsText = ["Highly Likely", "Likely", "Neutral", "Likely", "Highly Likely"]

        for (let i = 0; i < 5; i++) {
            const startAngle = -Math.PI / 2 + arcAngle * i;
            const endAngle = startAngle + arcAngle;
            const arcPath = arc()
                .innerRadius(dialHeight - 70)
                .outerRadius(dialHeight)
                .startAngle(startAngle + (Math.PI / 256))
                .endAngle(endAngle - (Math.PI / 256));

            const arcElement = g.append("path")
                .attr("d", arcPath())
                .attr("id", `${random}-arc-${i}`)
                .attr("transform", `translate(${dialWidth / 2},${dialHeight})`)
                .style("fill", colors(i));

            arcs.push({
                index: i,
                startAngle,
                endAngle,
                element: arcElement,
            });

            const arcText = g.append("text")
                // .attr("transform", `translate(${arcPath.centroid()})`)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("font-size", "10px")
                .text(`${arcAxisText[i]}`)
                .attr("transform", () => {
                    // const c = arcPath.centroid();
                    // const x = c[0];
                    // const y = c[1];
                    // const rot = Math.atan2(y, x) * (180 / Math.PI);  // Convert radian to degree
                    // return `translate(${x}, ${y}) rotate(${rot})`;
                    const midAngle = -Math.PI / 2 + ((i == 0 || i == 1) ? -Math.PI / 12 : (i == 4 || i == 3) ? Math.PI / 12 : 0) + (startAngle + endAngle) / 2;
                    const x = Math.cos(midAngle) * labelRadius;
                    const y = Math.sin(midAngle) * labelRadius;
                    const rot = (midAngle * 180 / Math.PI) - 90;
                    const finalRotation = rot + (Math.abs(rot) > 90 ? 180 : 0);  // Adjust for labels on the left half
                    return `translate(${x + dialWidth / 2}, ${y + dialHeight}) `;
                });

            const arcLabels = g.append("text")
                // .attr("transform", `translate(${arcPath.centroid()})`)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("font-size", "12px")
                .style("fill", 'black')
                .attr("id", `${random}-arcLabel-${i}`)
                .text(`${arcLabelsText[i]}`)
                .attr("transform", () => {
                    // const c = arcPath.centroid();
                    // const x = c[0];
                    // const y = c[1];
                    // const rot = Math.atan2(y, x) * (180 / Math.PI);  // Convert radian to degree
                    // return `translate(${x}, ${y}) rotate(${rot})`;
                    const midAngle = -Math.PI / 2 + (startAngle + endAngle) / 2;
                    const x = Math.cos(midAngle) * (labelRadius + 55);
                    const y = Math.sin(midAngle) * (labelRadius + 55);
                    const rot = (midAngle * 180 / Math.PI) - 90;
                    const finalRotation = rot + (Math.abs(rot) > 90 ? 180 : 0);  // Adjust for labels on the left half
                    return `translate(${x + dialWidth / 2}, ${y + dialHeight}) rotate(${finalRotation})`;
                });
        }

        for (let i = 0; i < 21; i++) {
            const startAngle = -Math.PI / 2 + (Math.PI / 21) * i;
            const endAngle = startAngle + (Math.PI / 21);


            const arcText = g.append("circle")
                .attr("r", 1)    // radius of the circle
                .attr("fill", "black")  // fill color of the circle
                // .attr("stroke", "black")  // stroke color of the circle
                .attr("stroke-width", 1)
                // .attr("transform", `translate(${arcPath.centroid()})`)
                // .attr("dy", "0.35em")
                // .attr("text-anchor", "middle")
                // .attr("alignment-baseline", "middle")
                // .attr("font-size", "20px")
                // .text(`.`)
                .attr("transform", () => {
                    // const c = arcPath.centroid();
                    // const x = c[0];
                    // const y = c[1];
                    // const rot = Math.atan2(y, x) * (180 / Math.PI);  // Convert radian to degree
                    // return `translate(${x}, ${y}) rotate(${rot})`;
                    const midAngle = -Math.PI / 2 + (startAngle + endAngle) / 2;
                    const x = Math.cos(midAngle) * (labelRadius + 10);
                    const y = Math.sin(midAngle) * (labelRadius + 10);
                    const rot = (midAngle * 180 / Math.PI) - 90;
                    const finalRotation = rot + (Math.abs(rot) > 90 ? 180 : 0);  // Adjust for labels on the left half
                    return `translate(${x + dialWidth / 2}, ${y + dialHeight}) `;
                });
        }

        g.append("text")
            // .attr("transform", `translate(${arcPath.centroid()})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "700")
            .style("fill", 'black')
            .attr("class", `inverse`)
            .text(`${leftText}`)
            .attr("transform", `translate(35,180)`)

        g.append("text")
            // .attr("transform", `translate(${arcPath.centroid()})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "700")
            .style("fill", 'black')
            .attr("class", `inverse`)
            .text(`${rightText}`)
            .attr("transform", `translate(305,180)`)



        // Add text labels

        // const colors = scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549', '#3BBCAC', '#051D6D']);
        // const anglesArray = [[- Math.PI / 2, Math.PI / 4], [- Math.PI / 4, Math.PI / 6], [- Math.PI / 12, Math.PI / 6], [Math.PI / 4, - Math.PI / 6], [Math.PI / 2, - Math.PI / 4]]

        // const arcs = []; // keep track of the arcs

        // for (let i = 0; i < 5; i++) {
        //     const startAngle = anglesArray[i][0];
        //     const endAngle = startAngle + anglesArray[i][1];
        //     const arcPath = arc()
        //         .innerRadius(dialHeight - 70)
        //         .outerRadius(dialHeight)
        //         .startAngle(startAngle)
        //         .endAngle(endAngle);

        //     const arcElement = g.append("path")
        //         .attr("d", arcPath())
        //         .attr("transform", `translate(${dialWidth / 2},${dialHeight})`)
        //         .style("fill", colors(i));

        //     arcs.push({
        //         startAngle,
        //         endAngle,
        //         element: arcElement,
        //     });
        // }

        // The needle
        const needle = g.append("line")
            .attr("x1", 0)
            .attr("y1", - dialHeight + 50)
            .attr("x2", 0)
            .attr("y2", 0)
            .style("stroke", "#888888")
            .style("stroke-width", 2)
            .attr("transform", `translate(${dialWidth / 2},${dialHeight})`)
            .raise();

        const arcPath = arc()
            .innerRadius(0)
            .outerRadius(40)
            .startAngle(0)
            .endAngle(Math.PI);

        const arcElement = g.append("path")
            .attr("d", arcPath())
            // .attr("transform", 'rotate(90)')
            .attr("transform", `translate(${dialWidth / 2},${dialHeight + 1}) rotate(-90)`)
            .style("fill", '#f2f2f2')

        g.append("text")
            // .attr("transform", `translate(${arcPath.centroid()})`)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("font-size", "20px")
            // .attr("font-weight", "550")
            .style("fill", 'black')
            .text(`${Math.abs(Math.round(value * (Math.pow(10, decimals))) / (Math.pow(10, decimals)))}`)
            .attr("transform", `translate(170,150)`)

        // // Radial scale
        // const radialScale = scaleLinear()
        //     .domain([-100, 100])
        //     .range([-90, 90]);

        // const ticks = radialScale.ticks(5);

        // g.selectAll(".inner-tick")
        //     .data(ticks)
        //     .enter().append("circle")
        //     .attr("r", d => radialScale(d))
        //     .style("fill", "none")
        //     .style("stroke", "#ccc")
        //     .style("stroke-dasharray", "2,2");

        // g.selectAll(".inner-tick-label")
        //     .data(ticks)
        //     .enter().append("text")
        //     .attr("y", d => -radialScale(d))
        //     .attr("dy", "0.35em")
        //     .attr("text-anchor", "middle")
        //     .text(d => d);

        const transitionNeedle = (newValue) => {
            const targetAngle = scale(newValue);
            needle.transition()
                .duration(3000)
                .attrTween("transform", () => {
                    const graphInterpolate = interpolate(scale(0), targetAngle);
                    return t => {
                        const currentAngle = graphInterpolate(t);
                        arcs.forEach((arc, index) => {
                            // const currentLabel = select(`#${random}-arcLabel-4`)
                            // console.log("currentLabel", currentLabel)
                            if (currentAngle >= arc.startAngle * 180 / Math.PI && currentAngle <= arc.endAngle * 180 / Math.PI) {
                                arc.element.style("fill", colors(arc.index));
                                select(`#${random}-arcLabel-${index}`).style("fill", "white");
                                // currentLabel.style("fill", '#ffffff')
                            } else {
                                select(`#${random}-arcLabel-${index}`).style("fill", "black");
                                // currentLabel.style("fill", 'black')
                                arc.element.style("fill", "#f2f2f2");
                            }
                        });
                        return `translate(${dialWidth / 2},${dialHeight}) rotate(${currentAngle})`;
                    };
                });
        };

        transitionNeedle(value);


    }, [value]);

    return <svg ref={ref}></svg>;
};

export default SemiCircleDial;
