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

// //         const x1 = scaleBand().padding(0.05);

// //         const y = scaleLinear().rangeRound([height, 0]);

// //         const z = scaleOrdinal().range(['#98abc5', '#8a89a6']);

// //         const keys = ['propertyOne', 'propertyTwo'];

// //         x0.domain(data.map((d) => d.name));
// //         x1.domain(keys).rangeRound([0, x0.bandwidth()]);
// //         y.domain([0, max(data, (d) => max(keys, (key) => d[key]))]).nice();

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
// //             .call(axisBottom(x0));

// //         svg
// //             .append('g')
// //             .attr('class', 'axis')
// //             .call(axisLeft(y))
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

//         const x1 = scaleBand().padding(0.05);

//         const y = scaleLinear().rangeRound([height, 0]);

//         const z = scaleOrdinal().range(['#051D6D', '#051D38']);

//         const keys = ['propertyOne', 'propertyTwo'];

//         x0.domain(data.map((d) => d.name));
//         x1.domain(keys).rangeRound([0, x0.bandwidth()]);
//         y.domain([0, max(data, (d) => max(keys, (key) => d[key]))]).nice();

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
//             .call(axisBottom(x0));

//         svg
//             .append('g')
//             .attr('class', 'axis')
//             .call(axisLeft(y))
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

import React, { useRef, useEffect } from 'react'
// import * as d3 from 'd3';

// Selection
import { select } from 'd3-selection'

// Scales
import { scaleOrdinal, scaleLinear, scaleBand } from 'd3-scale'

// Line generator
// import { line } from 'd3-shape';

// Extent and bisector
import { max } from 'd3-array'

// Pointer for interaction
// import { pointer } from 'd3-selection-multi';

// Time formatting
// import { timeFormat } from 'd3-time-format';

// Axes
import { axisBottom, axisLeft } from 'd3-axis'

// Format
// import { format } from 'd3-format';

function GroupedBarChart ({ data }) {
  const ref = useRef()

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const resizeObserver = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      })
    })

    resizeObserver.observe(ref.current)

    return () => resizeObserver.disconnect()
  }, [ref])

  useEffect(() => {
    if (!ref.current) return
    if (dimensions.width === 0 || dimensions.height === 0) return

    select(ref.current).selectAll('*').remove()

    if (data != undefined && data != null) {
      const margin = { top: 20, right: 30, bottom: 40, left: 60 }
      const width = dimensions.width - margin.left - margin.right
      const height = dimensions.height - margin.top - margin.bottom

      const svg = select(ref.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      const x0 = scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)

      const x1 = scaleBand().padding(0.05)

      const y = scaleLinear().rangeRound([height, 0])

      const z = scaleOrdinal().range(['#051D6D', '#3BBCAC'])

      const keys = ['CTZ23', 'CTZ24']

      x0.domain(data.map((d) => d.country))
      x1.domain(keys).rangeRound([0, x0.bandwidth()])
      y.domain([0, max(data, (d) => max(keys, (key) => d[key])) + 5]).nice()

      const bar = svg
        .append('g')
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', (d) => 'translate(' + x0(d.country) + ',0)')

      bar.selectAll('rect')
        .data((d) => keys.map((key) => ({ key, value: d[key] })))
        .enter()
        .append('rect')
        .attr('x', (d) => x1(d.key))
        .attr('y', (d) => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', (d) => height - y(d.value))
        .attr('fill', (d) => z(d.key))
        .on('mouseover', function (e, d) {
          const bartooltip = document.getElementById('bartooltip')
          bartooltip.innerHTML = '<strong>' + d.key + ': ' + d.value + '</strong><span >'
          bartooltip.style.visibility = 'visible'
        })
        .on('mouseout', function (e, d) {
          const bartooltip = document.getElementById('bartooltip')
          bartooltip.style.visibility = 'hidden'
        })

      // Adding labels
      bar.selectAll('text')
        .data((d) => keys.map((key) => ({ key, value: d[key] })))
        .enter()
        .append('text')
        .attr('x', (d) => x1(d.key) + x1.bandwidth() / 2)
        .attr('y', (d) => y(d.value) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text((d) => d.key)

      svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(axisBottom(x0))
        .selectAll('text')
        .style('font-size', '15px')

      svg
        .append('g')
        .attr('class', 'axis')
        .call(axisLeft(y))
        .append('text')
        .attr('x', 2)
        .attr('y', y(y.ticks().pop()) + 0.5)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
    }
  }, [data, dimensions])

  return (
        <div className="chart relative w-full h-[400px] px-4">
            {/* <div className='absolute inset-0 grid place-content-center'>
                <img src='/macrovesta_watermark.png' className='w-[200px]' />
            </div> */}
            <div id="bartooltip" className='-mb-8 text-center'>&nbsp;</div>
            <svg className="w-full h-full -mb-7" ref={ref} style={{ width: '100%', maxHeight: '450px' }} />
        </div>
  )
}

export default GroupedBarChart
