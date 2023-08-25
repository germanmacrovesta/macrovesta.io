// import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// const SemiCircleDial = ({ value = 0 }) => {
//     const ref = useRef();

//     useEffect(() => {
//         const svg = d3.select(ref.current);
//         const width = 200, height = 100;
//         svg.attr("width", width).attr("height", height);

//         // Create a scale to map values to angles
//         const scale = d3.scaleLinear()
//             .domain([-100, 100])
//             .range([-90, 90]);

//         // Draw the semi-circle dial
//         const arc = d3.arc()
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
//         // const colors = d3.scaleOrdinal(d3.schemeCategory10); // colors for the arcs
//         const colors = d3.scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549', '#3BBCAC', '#051D6D']);
//         const anglesArray = [[- Math.PI / 2, Math.PI / 4], [- Math.PI / 4, Math.PI / 6], [- Math.PI / 12, Math.PI / 6], [Math.PI / 4, - Math.PI / 6], [Math.PI / 2, - Math.PI / 4]]

//         const arcs = []; // keep track of the arcs

//         for (let i = 0; i < 5; i++) {
//             const startAngle = anglesArray[i][0];
//             const endAngle = startAngle + anglesArray[i][1];
//             const arcPath = d3.arc()
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
//         // const arcPath1 = d3.arc()
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
//         // const arcPath2 = d3.arc()
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
//         //             const interpolate = d3.interpolate(scale(0), scale(newValue));
//         //             return t => `translate(${width / 2},${height}) rotate(${interpolate(t)})`;
//         //         });
//         // };

//         // transitionNeedle(value);

//         const transitionNeedle = (newValue) => {
//             const targetAngle = scale(newValue);
//             needle.transition()
//                 .duration(1000)
//                 .attrTween("transform", () => {
//                     const interpolate = d3.interpolate(scale(0), targetAngle);
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
//         const svg = d3.select(ref.current);
//         const width = 200, height = 100;
//         svg.attr("width", width).attr("height", height);

//         // Create a scale to map values to angles
//         const scale = d3.scaleLinear()
//             .domain([-100, 100])
//             .range([-90, 90]);

//         // Draw the semi-circle dial
//         const arc = d3.arc()
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
//             const arcPath = d3.arc()
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
//                     const interpolate = d3.interpolate(scale(0), targetAngle);
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
import * as d3 from "d3";

const SemiCircleDial = ({ value = 0 }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        const width = 360, height = 180;
        const labelRadius = height - 85;
        svg.attr("width", width).attr("height", height);

        // Create a scale to map values to angles
        const scale = d3.scaleLinear()
            .domain([-100, 100])
            .range([-90, 90]);

        // Draw the semi-circle dial
        const arc = d3.arc()
            .innerRadius(height - 70)
            .outerRadius(height)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI / 2);

        const dial = svg.append("path")
            .attr("d", arc)
            .attr("transform", `translate(${width / 2},${height})`)
            .style("fill", "#ccc");

        // Draw additional arcs
        const colors = d3.scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549', '#3BBCAC', '#051D6D']);
        const arcAngle = Math.PI / 5; // 36 degrees in radians
        const arcs = []; // keep track of the arcs

        for (let i = 0; i < 5; i++) {
            const startAngle = -Math.PI / 2 + arcAngle * i;
            const endAngle = startAngle + arcAngle;
            const arcPath = d3.arc()
                .innerRadius(height - 70)
                .outerRadius(height)
                .startAngle(startAngle)
                .endAngle(endAngle);

            const arcElement = svg.append("path")
                .attr("d", arcPath())
                .attr("transform", `translate(${width / 2},${height})`)
                .style("fill", colors(i));

            arcs.push({
                index: i,
                startAngle,
                endAngle,
                element: arcElement,
            });

            const arcText = svg.append("text")
                .attr("transform", `translate(${arcPath.centroid()})`)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("font-size", "10px")
                .text(`${i}`)
                .attr("transform", () => {
                    // const c = arcPath.centroid();
                    // const x = c[0];
                    // const y = c[1];
                    // const rot = Math.atan2(y, x) * (180 / Math.PI);  // Convert radian to degree
                    // return `translate(${x}, ${y}) rotate(${rot})`;
                    const midAngle = -Math.PI / 2 + (startAngle + endAngle) / 2;
                    const x = Math.cos(midAngle) * labelRadius;
                    const y = Math.sin(midAngle) * labelRadius;
                    const rot = (midAngle * 180 / Math.PI) - 90;
                    const finalRotation = rot + (Math.abs(rot) > 90 ? 180 : 0);  // Adjust for labels on the left half
                    return `translate(${x + width / 2}, ${y + height}) rotate(${finalRotation})`;
                });
        }

        // Add text labels

        // const colors = d3.scaleOrdinal().range(['#051D6D', '#3BBCAC', '#44B549', '#3BBCAC', '#051D6D']);
        // const anglesArray = [[- Math.PI / 2, Math.PI / 4], [- Math.PI / 4, Math.PI / 6], [- Math.PI / 12, Math.PI / 6], [Math.PI / 4, - Math.PI / 6], [Math.PI / 2, - Math.PI / 4]]

        // const arcs = []; // keep track of the arcs

        // for (let i = 0; i < 5; i++) {
        //     const startAngle = anglesArray[i][0];
        //     const endAngle = startAngle + anglesArray[i][1];
        //     const arcPath = d3.arc()
        //         .innerRadius(height - 70)
        //         .outerRadius(height)
        //         .startAngle(startAngle)
        //         .endAngle(endAngle);

        //     const arcElement = svg.append("path")
        //         .attr("d", arcPath())
        //         .attr("transform", `translate(${width / 2},${height})`)
        //         .style("fill", colors(i));

        //     arcs.push({
        //         startAngle,
        //         endAngle,
        //         element: arcElement,
        //     });
        // }

        // The needle
        const needle = svg.append("line")
            .attr("x1", 0)
            .attr("y1", - height)
            .attr("x2", 0)
            .attr("y2", 0)
            .style("stroke", "#000")
            .style("stroke-width", 3)
            .attr("transform", `translate(${width / 2},${height})`)
            .raise();

        // // Radial scale
        // const radialScale = d3.scaleLinear()
        //     .domain([-100, 100])
        //     .range([-90, 90]);

        // const ticks = radialScale.ticks(5);

        // svg.selectAll(".inner-tick")
        //     .data(ticks)
        //     .enter().append("circle")
        //     .attr("r", d => radialScale(d))
        //     .style("fill", "none")
        //     .style("stroke", "#ccc")
        //     .style("stroke-dasharray", "2,2");

        // svg.selectAll(".inner-tick-label")
        //     .data(ticks)
        //     .enter().append("text")
        //     .attr("y", d => -radialScale(d))
        //     .attr("dy", "0.35em")
        //     .attr("text-anchor", "middle")
        //     .text(d => d);

        const transitionNeedle = (newValue) => {
            const targetAngle = scale(newValue);
            needle.transition()
                .duration(1000)
                .attrTween("transform", () => {
                    const interpolate = d3.interpolate(scale(0), targetAngle);
                    return t => {
                        const currentAngle = interpolate(t);
                        arcs.forEach(arc => {
                            if (currentAngle >= arc.startAngle * 180 / Math.PI && currentAngle < arc.endAngle * 180 / Math.PI) {
                                arc.element.style("fill", colors(arc.index));
                            } else {
                                arc.element.style("fill", "#ccc");
                            }
                        });
                        return `translate(${width / 2},${height}) rotate(${currentAngle})`;
                    };
                });
        };

        transitionNeedle(value);


    }, [value]);

    return <svg ref={ref}></svg>;
};

export default SemiCircleDial;
