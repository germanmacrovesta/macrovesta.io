import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BullishBearishDonut({ Bullish, Bearish }) {
    const ref = useRef();

    useEffect(() => {
        const data = [
            { name: "Bullish", value: Bullish, lightcolor: "#44B549", darkcolor: "#44B549" },
            { name: "Bearish", value: Bearish, lightcolor: "#051D6D", darkcolor: "#051D6D" },
        ];

        const textOffsets = [
            { name: "Bullish", offset: '-0.8em' },
            { name: "Bearish", offset: '1.1em' },
        ];
        const rectOffsets = [
            { name: 'Bullish', offset: '-0.5em' },
            { name: 'Bearish', offset: '1em' },
        ];

        const svg = d3.select(ref.current)
            .attr("width", 300)
            .attr("height", 300)
            .append("g")
            .attr("transform", "translate(" + 150 + "," + 150 + ")");

        const arc = d3.arc()
            .innerRadius(100)
            .outerRadius(140);

        const arcHover = d3.arc()
            .innerRadius(100)
            .outerRadius(150);

        const pie = d3.pie()
            .value((d) => d.value)
            .sort(null);

        console.log("pie", pie(data))

        const g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc")
            .on('mouseover', function (e, d) {
                d3.select(this).select("path").transition()
                    .duration(200)
                    .attr("d", arcHover);
                console.log("d.", d)
                let tooltip = document.getElementById('BullishBearishTooltip');
                var diffAngle = d.endAngle - d.startAngle;
                var percentage = ((diffAngle / (2 * Math.PI)) * 100).toFixed(2);
                tooltip.innerHTML = "<strong>" + percentage + "</strong><span >" + "% " + d.data.name + "</span>";
                tooltip.style.visibility = 'visible';
            })
            .on('mouseout', function (e, d) {
                d3.select(this).select("path").transition()
                    .duration(200)
                    .attr("d", arc);
                let tooltip = document.getElementById('BullishBearishTooltip');
                tooltip.style.visibility = 'hidden';
            });

        g.append("path")
            .attr("d", arc)
            .style("fill", (d) => {
                // Create the gradients
                const gradient = svg.append("defs")
                    .append("linearGradient")
                    .attr("id", "gradient" + d.data.lightcolor)
                    .attr("x1", "0%")
                    .attr("x2", "0%")
                    .attr("y1", "0%")
                    .attr("y2", "100%");

                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", d3.rgb(d.data.lightcolor));

                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", d3.rgb(d.data.darkcolor));

                return "url(#gradient" + d.data.lightcolor + ")";
            });

        textOffsets.forEach((textOffset, i) => {
            svg.append("text")
                .attr("text-anchor", "left")
                .attr('font-size', '0.8em')
                .attr('y', textOffset.offset)
                .text(textOffset.name)
                .attr("transform", "translate(" + -10 + "," + 0 + ")");;

        });
        rectOffsets.forEach((rectOffset, i) => {
            svg.append('rect')
                .attr('x', 0)  // Adjust these numbers as per your requirements
                .attr('y', rectOffset.offset)  // Adjust these numbers as per your requirements
                .attr('width', '1.2em')
                .attr('height', '1.2em')
                .attr('rx', 6)
                .attr('ry', 6)
                .style('fill', data[i].lightcolor)
                .attr("transform", "translate(" + -40 + "," + -16 + ")");;
        });

    }, [Bullish, Bearish]);

    return (
        <div className="chart flex flex-col items-center w-full">
            <div id="BullishBearishTooltip" className='text-center w-full' >&nbsp;</div>
            <svg ref={ref}></svg>
        </div>
    );
}

export default BullishBearishDonut;
