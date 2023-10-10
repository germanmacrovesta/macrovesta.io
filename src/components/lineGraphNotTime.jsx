import React, { useRef, useEffect } from 'react'
// import * as d3 from 'd3';
// Selection
import { select, pointer } from 'd3-selection'

// Scales
import { scaleOrdinal, scaleLinear } from 'd3-scale'

// Line generator
import { line } from 'd3-shape'

// Extent and bisector
import { extent, bisector } from 'd3-array'

// Pointer for interaction
// import { pointer } from 'd3-selection-multi';

// Time formatting
// import { timeFormat } from 'd3-time-format';

// Axes
import { axisBottom, axisLeft } from 'd3-axis'

// Format
import { format } from 'd3-format'

const capitalizeText = (text) => {
  const firstLetter = text.slice(0, 1).toUpperCase()
  const rest = text.slice(1)
  return `${firstLetter}${rest}`
}

const LineGraphNotTime = ({ data, monthsTicks = 4, xValue = 'x', yValue = 'y', graphWidth = 550, graphHeight = 400, xDomain1 = 0, xDomain2 = 17, xAxisTitle = '', yAxisTitle = '', tickNumber = 15, verticalTooltip = true, decimalPlaces = 2 }) => {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`

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
    if (data[0]?.data != undefined) {
      const margin = { top: 20, right: 30, bottom: 40, left: 60 }
      const width = dimensions.width - margin.left - margin.right
      const height = dimensions.height - margin.top - margin.bottom

      // const colors = scaleOrdinal(schemeCategory10);
      const colors = scaleOrdinal().range(['#44B549', '#051D6D', '#3BBCAC', '#D060D6', '#051D38'])

      const svg = select(ref.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

      const x = scaleLinear().range([0, width])
      const y = scaleLinear().range([height, 0])

      const graphLine = line()
        .x(d => x(d[xValue]))
        .y(d => y(d[yValue]))

      const allData = data.reduce((acc, series) => acc.concat(series.data), [])

      const timeDomain = extent(allData, d => d[xValue])
      const timeRange = Math.abs(timeDomain[1] - timeDomain[0])
      const timepadding = timeRange * 0.1 // 10% padding

      // Adjusted dates
      const minDate = timeDomain[0] - timepadding
      const maxDate = timeDomain[1] + timepadding

      const valueDomain = extent(allData, d => parseFloat(d[yValue]))
      const valuepadding = Math.abs(parseFloat(valueDomain[1]) - parseFloat(valueDomain[0])) * 0.1 // 10% padding

      console.log('valueDomain', valueDomain, 'valuepadding', valuepadding, data[0].name)

      x.domain([xDomain1, xDomain2])
      y.domain([parseFloat(valueDomain[0]) - valuepadding, parseFloat(valueDomain[1]) + valuepadding])

      console.log('y bottom', valueDomain[0] - valuepadding, 'y top', valueDomain[1] + valuepadding, data[0].name)
      // x.domain(timeDomain);
      // y.domain(valueDomain);

      const tooltip = select('body').append('div')
        .attr('id', tooltipId)
        .attr('class', 'tooltip')
        .style('opacity', 0)

      if (verticalTooltip == true && data.length < 4) {
        const overlay = svg.append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')

        const verticalLine = svg.append('line')
          .attr('stroke', '#aaa')
          .attr('y1', 0)
          .attr('y2', height)
          .attr('x', 10)
        // .attr('x2', 0)
          .attr('opacity', 0)

        overlay.on('mousemove', function (event) {
          // clearTimeout(tooltipTimeout);
          const [mx] = pointer(event)

          // tooltipTimeout = setTimeout(() => {
          // Place your tooltip update logic here

          const date = x.invert(mx)

          // We will get the nearest x-value for each series
          // and store the respective y-values along with series names
          const tooltipData = []

          data.forEach(series => {
            const bisectDate = bisector(d => d[xValue]).left
            const idx = bisectDate(series.data, date)

            const d0 = series.data[idx - 1]
            const d1 = series.data[idx]
            const d = !d1 ? d0 : (!d0 ? d1 : (date - d0[xValue] > d1[xValue] - date ? d1 : d0))

            tooltipData.push({
              name: series.name,
              value: d[yValue],
              time: d[xValue]
            })
          })

          // Setting position for vertical line based on nearest x-point
          const closestX = tooltipData[0] && tooltipData[0].time

          console.log('Mouse X:', mx)
          console.log('Closest Data X:', closestX)
          console.log('Mapped X:', x(closestX))

          verticalLine
            .attr('x1', x(closestX))
            .attr('x2', x(closestX))
            .attr('opacity', 1)

          // Constructing tooltip content
          const tooltipX = `${closestX}<br/>`
          const tooltipY = tooltipData.map(item => `${item.name}: ${(item.value)}`).join('<br/>')
          const tooltipContent = tooltipX + tooltipY

          tooltip
            .html(tooltipContent)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 28) + 'px')
            .style('opacity', 1)
          // }, 0);
        })

        svg.on('mouseleave', function () {
          tooltip.style('opacity', 0)
          verticalLine.attr('opacity', 0)
        })
      }

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
        const visiblepath = svg.append('path')
          .datum(series.data)
          .attr('fill', 'none')
          .attr('stroke', colors(i))
          .attr('stroke-width', 1.5)
          .attr('class', `line line-${i}`)
          .attr('d', graphLine)
        const invisiblePath = svg.append('path')
          .datum(series.data)
          .attr('fill', 'none')
          .attr('stroke', colors(i))
          .attr('stroke-width', 10)
          .attr('stroke-opacity', 0)
          .attr('class', `line line-${i}`)
          .attr('d', graphLine)

        if (series.dottedLine) {
          invisiblePath.attr('stroke-dasharray', ('3, 3')) // this will create a dotted line
        } else if (verticalTooltip) {
          if (data.length < 4) {

          } else {
            const verticalLine = svg.append('line')
              .attr('stroke', '#aaa')
              .attr('y1', 0)
              .attr('y2', height)
              .attr('x', 10)
            // .attr('x2', 0)
              .attr('opacity', 0)

            invisiblePath.on('mousemove', function (event) {
              // clearTimeout(tooltipTimeout);
              const [mx] = pointer(event)

              // this.parentNode.appendChild(this);
              // select(this).transition()
              //     .duration(200)
              //     .attr("stroke-width", 6);

              // tooltipTimeout = setTimeout(() => {
              // Place your tooltip update logic here

              const date = x.invert(mx)

              // We will get the nearest x-value for each series
              // and store the respective y-values along with series names
              const tooltipData = []

              const bisectDate = bisector(d => d[xValue]).left
              const idx = bisectDate(series.data, date)

              const d0 = series.data[idx - 1]
              const d1 = series.data[idx]
              const d = !d1 ? d0 : (!d0 ? d1 : (date - d0[xValue] > d1[xValue] - date ? d1 : d0))

              tooltipData.push({
                name: series.name,
                value: d[yValue],
                time: d[xValue]
              })

              // Setting position for vertical line based on nearest x-point
              const closestX = tooltipData[0] && tooltipData[0].time

              console.log('Mouse X:', mx)
              console.log('Closest Data X:', closestX)
              console.log('Mapped X:', x(closestX))

              verticalLine
                .attr('x1', x(closestX))
                .attr('x2', x(closestX))
                .attr('opacity', 1)

              // Constructing tooltip content
              const tooltipX = `${closestX}<br/>`
              const tooltipY = tooltipData.map(item => `${item.name}: ${(item.value)}`).join('<br/>')
              const tooltipContent = tooltipX + tooltipY

              tooltip
                .html(tooltipContent)
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 28) + 'px')
                .style('opacity', 1)
              // }, 0);
            })
              .on('mouseleave', function () {
                // select(this).transition()
                //     .duration(200)
                //     .attr("stroke-width", 1.5);
                tooltip.style('opacity', 0)
                verticalLine.attr('opacity', 0)
              })
          }
        } else if (series.noCircles) {
          invisiblePath.on('mouseover', function (e, d) {
            const mouse = pointer(e)

            // Convert those coordinates into your graph's domain
            const x0 = x.invert(mouse[0])
            const y0 = y.invert(mouse[1])
            this.parentNode.appendChild(this)
            select(this).transition()
              .duration(200)
              .attr('stroke-width', 6)
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9)
            tooltip.html(`${capitalizeText(series.name)}\n${(y0).toFixed(2)}`)
              .style('left', (e.pageX - 65) + 'px')
              .style('top', (e.pageY - 35) + 'px')
              .style('padding')
          })
            .on('mouseout', function (e) {
              select(this).transition()
                .duration(200)
                .attr('stroke-width', 3)
              tooltip.transition()
                .duration(500)
                .style('opacity', 0)
            })
        } else {
          invisiblePath.on('mouseover', function (e, d) {
            select(this).transition()
              .duration(200)
              .attr('stroke-width', 6)
            tooltip.transition()
              .duration(200)
              .style('opacity', 0.9)
            tooltip.html(`${capitalizeText(series.name)}`)
              .style('left', (e.pageX - 65) + 'px')
              .style('top', (e.pageY - 35) + 'px')
              .style('padding')
          })
            .on('mouseout', function (e) {
              select(this).transition()
                .duration(200)
                .attr('stroke-width', 3)
              tooltip.transition()
                .duration(500)
                .style('opacity', 0)
            })
          series.data.forEach((d) => {
            svg.append('circle')
              .attr('class', 'dot')
              .attr('cx', x(d[xValue]))
              .attr('cy', y(d[yValue]))
              .attr('r', 7)
              .style('fill', colors(i))
              .on('mouseover', function (e) {
                const pointTime = d[xValue]
                // const dayOfMonth = pointTime.toLocaleString('default', { day: '2-digit' });
                // const month = pointTime.toLocaleString('default', { month: 'long' });
                // const year = pointTime.toLocaleString('default', { year: 'numeric' });
                tooltip.transition()
                  .duration(200)
                  .style('opacity', 0.9)
                tooltip.html(`Month ${d[xValue]}: ${d[yValue]}`)
                  .style('left', (e.pageX - 65) + 'px')
                  .style('top', (e.pageY - 35) + 'px')
                  .style('padding')
              })
              .on('mouseout', function (e) {
                tooltip.transition()
                  .duration(500)
                  .style('opacity', 0)
              })
          })
        }
      })

      // const monthFormat = timeFormat("%B");
      // const yearFormat = timeFormat("%Y");

      const xAxis = axisBottom(x)
        .ticks(tickNumber)
      // .tickValues(range(xDomain1, xDomain2 + 1))
        .tickFormat(format('.0f'))

      // svg.append("g")
      //     .attr("transform", `translate(0, ${height})`)
      //     .call(xAxis);

      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

      svg.append('g')
        .call(axisLeft(y))

      // svg.append("g")
      //     .call(axisBottom(x));

      svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(yAxisTitle)

      svg.append('text')
        .attr('transform',
          'translate(' + (width / 2) + ' ,' +
                    (height + margin.top + 20) + ')')
        .style('text-anchor', 'middle')
        .text(xAxisTitle)
    }

    return () => {
      select(`#${tooltipId}`).remove()
    }
  }, [data, xValue, yValue, dimensions])

  return (
        // <div id='lineGraph' className='-mb-10'>
        //     <svg ref={ref} />
        // </div>
        <div id='lineGraph' className='relative w-full h-[400px] px-4'>
            <div className='absolute pointer-events-none inset-0 grid place-content-center'>
                <img src='/macrovesta_watermark.png' className='w-[200px]' />
            </div>
            <svg className="w-full h-full -mb-7" ref={ref} style={{ width: '100%', maxHeight: '450px' }} />
        </div>
  )
}

export default LineGraphNotTime
