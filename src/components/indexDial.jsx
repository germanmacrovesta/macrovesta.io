import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const IndexDial = ({ probability }) => {
  const ref = useRef()

  useEffect(() => {
    const svg = d3.select(ref.current)

    const width = 500
    const height = 500
    const margin = 10

    svg.attr('width', width).attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const scale = d3.scaleLinear()
      .domain([-100, 100])
      .range([-180, 0])

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(width / 2 - margin)
      .startAngle((d) => scale(d[0]))
      .endAngle((d) => scale(d[1]))

    g.selectAll('path')
      .data([[-100, 0], [0, 100]])
      .enter()
      .append('path')
      .attr('d', arc)
      .style('fill', (d, i) => (i === 0 ? 'green' : 'red'))
      .style('opacity', 0.5)

    g.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '3px')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -(width / 2 - margin))

    updateNeedle(probability)
  }, [])

  const updateNeedle = (prob) => {
    const svg = d3.select(ref.current)
    const g = svg.select('g')
    const scale = d3.scaleLinear()
      .domain([-100, 100])
      .range([-180, 0])

    g.selectAll('line')
      .transition()
      .duration(1000)
      .attrTween('transform', function () {
        const self = d3.select(this)
        let currentRotation = self.attr('transform')
        currentRotation = currentRotation ? Number(currentRotation.split('(')[1].split(')')[0]) : 0
        const interpolate = d3.interpolate(currentRotation, scale(prob))

        return function (t) {
          return `rotate(${interpolate(t)})`
        }
      })
  }

  useEffect(() => {
    updateNeedle(probability)
  }, [probability])

  return (
        <svg ref={ref} />
  )
}

export default IndexDial
