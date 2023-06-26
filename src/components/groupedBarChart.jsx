// // import React, { useRef, useEffect } from 'react';
// // import * as d3 from 'd3';

// // function GroupedBarChart({ data }) {
// //     const ref = useRef();

// //     useEffect(() => {
// //         const margin = { top: 20, right: 30, bottom: 40, left: 90 };
// //         const width = 960 - margin.left - margin.right;
// //         const height = 500 - margin.top - margin.bottom;

// //         const svg = d3
// //             .select(ref.current)
// //             .append('svg')
// //             .attr('width', width + margin.left + margin.right)
// //             .attr('height', height + margin.top + margin.bottom)
// //             .append('g')
// //             .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// //         const x0 = d3
// //             .scaleBand()
// //             .rangeRound([0, width])
// //             .paddingInner(0.1);

// //         const x1 = d3.scaleBand().padding(0.05);

// //         const y = d3.scaleLinear().rangeRound([height, 0]);

// //         const z = d3.scaleOrdinal().range(['#98abc5', '#8a89a6']);

// //         const keys = ['propertyOne', 'propertyTwo'];

// //         x0.domain(data.map((d) => d.name));
// //         x1.domain(keys).rangeRound([0, x0.bandwidth()]);
// //         y.domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key]))]).nice();

// //         svg
// //             .append('g')
// //             .selectAll('g')
// //             .data(data)
// //             .enter()
// //             .append('g')
// //             .attr('transform', (d) => 'translate(' + x0(d.name) + ',0)')
// //             .selectAll('rect')
// //             .data((d) => keys.map((key) => ({ key: key, value: d[key] })))
// //             .enter()
// //             .append('rect')
// //             .attr('x', (d) => x1(d.key))
// //             .attr('y', (d) => y(d.value))
// //             .attr('width', x1.bandwidth())
// //             .attr('height', (d) => height - y(d.value))
// //             .attr('fill', (d) => z(d.key));

// //         svg
// //             .append('g')
// //             .attr('class', 'axis')
// //             .attr('transform', 'translate(0,' + height + ')')
// //             .call(d3.axisBottom(x0));

// //         svg
// //             .append('g')
// //             .attr('class', 'axis')
// //             .call(d3.axisLeft(y))
// //             .append('text')
// //             .attr('x', 2)
// //             .attr('y', y(y.ticks().pop()) + 0.5)
// //             .attr('dy', '0.32em')
// //             .attr('fill', '#000')
// //             .attr('font-weight', 'bold')
// //             .attr('text-anchor', 'start');

// //     }, [data]);

// //     return (
// //         <div className="chart-container" ref={ref} ></div>
// //     );
// // }

// // export default GroupedBarChart;

// import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

// function GroupedBarChart({ data }) {
//     const ref = useRef();

//     useEffect(() => {
//         const margin = { top: 20, right: 30, bottom: 40, left: 90 };
//         const width = 960 - margin.left - margin.right;
//         const height = 500 - margin.top - margin.bottom;

//         const svg = d3
//             .select(ref.current)
//             .attr('width', width + margin.left + margin.right)
//             .attr('height', height + margin.top + margin.bottom)
//             .append('g')
//             .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//         const x0 = d3
//             .scaleBand()
//             .rangeRound([0, width])
//             .paddingInner(0.1);

//         const x1 = d3.scaleBand().padding(0.05);

//         const y = d3.scaleLinear().rangeRound([height, 0]);

//         const z = d3.scaleOrdinal().range(['#051D6D', '#051D38']);

//         const keys = ['propertyOne', 'propertyTwo'];

//         x0.domain(data.map((d) => d.name));
//         x1.domain(keys).rangeRound([0, x0.bandwidth()]);
//         y.domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key]))]).nice();

//         svg
//             .append('g')
//             .selectAll('g')
//             .data(data)
//             .enter()
//             .append('g')
//             .attr('transform', (d) => 'translate(' + x0(d.name) + ',0)')
//             .selectAll('rect')
//             .data((d) => keys.map((key) => ({ key: key, value: d[key] })))
//             .enter()
//             .append('rect')
//             .attr('x', (d) => x1(d.key))
//             .attr('y', (d) => y(d.value))
//             .attr('width', x1.bandwidth())
//             .attr('height', (d) => height - y(d.value))
//             .attr('fill', (d) => z(d.key));

//         svg
//             .append('g')
//             .attr('class', 'axis')
//             .attr('transform', 'translate(0,' + height + ')')
//             .call(d3.axisBottom(x0));

//         svg
//             .append('g')
//             .attr('class', 'axis')
//             .call(d3.axisLeft(y))
//             .append('text')
//             .attr('x', 2)
//             .attr('y', y(y.ticks().pop()) + 0.5)
//             .attr('dy', '0.32em')
//             .attr('fill', '#000')
//             .attr('font-weight', 'bold')
//             .attr('text-anchor', 'start');

//     }, [data]);

//     return (
//         <svg ref={ref} />
//     );
// }

// export default GroupedBarChart;

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function GroupedBarChart({ data }) {
    const ref = useRef();

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const width = 550 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select(ref.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const x0 = d3
            .scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.1);

        const x1 = d3.scaleBand().padding(0.05);

        const y = d3.scaleLinear().rangeRound([height, 0]);

        const z = d3.scaleOrdinal().range(['#051D6D', '#051D38']);

        const keys = ['CTZ23', 'CTZ24'];

        x0.domain(data.map((d) => d.name));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key])) + 5]).nice();

        const bar = svg
            .append('g')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', (d) => 'translate(' + x0(d.name) + ',0)');

        bar.selectAll('rect')
            .data((d) => keys.map((key) => ({ key: key, value: d[key] })))
            .enter()
            .append('rect')
            .attr('x', (d) => x1(d.key))
            .attr('y', (d) => y(d.value))
            .attr('width', x1.bandwidth())
            .attr('height', (d) => height - y(d.value))
            .attr('fill', (d) => z(d.key))
            .on('mouseover', function (e, d) {

                let bartooltip = document.getElementById('bartooltip');
                bartooltip.innerHTML = "<strong>" + d.key + ": " + d.value + "</strong><span >";
                bartooltip.style.visibility = 'visible';
            })
            .on('mouseout', function (e, d) {

                let bartooltip = document.getElementById('bartooltip');
                bartooltip.style.visibility = 'hidden';
            });;

        // Adding labels
        bar.selectAll('text')
            .data((d) => keys.map((key) => ({ key: key, value: d[key] })))
            .enter()
            .append('text')
            .attr('x', (d) => x1(d.key) + x1.bandwidth() / 2)
            .attr('y', (d) => y(d.value) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text((d) => d.key);

        svg
            .append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x0))
            .selectAll("text")
            .style("font-size", "15px");;

        svg
            .append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('x', 2)
            .attr('y', y(y.ticks().pop()) + 0.5)
            .attr('dy', '0.32em')
            .attr('fill', '#000')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')

    }, [data]);

    return (
        <div className="chart">
            <div id="bartooltip" className='-mb-8 text-center'>&nbsp;</div>
            <svg ref={ref}></svg>
        </div>
    );
}

export default GroupedBarChart;
