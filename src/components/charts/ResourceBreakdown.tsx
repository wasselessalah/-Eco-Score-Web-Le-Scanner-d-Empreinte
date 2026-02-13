'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ResourceData {
    label: string;
    value: number;
    color: string;
}

interface ResourceBreakdownProps {
    jsKB: number;
    cssKB: number;
    imageKB: number;
    totalWeightMB: number;
}

export default function ResourceBreakdown({ jsKB, cssKB, imageKB, totalWeightMB }: ResourceBreakdownProps) {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const totalKB = totalWeightMB * 1024;
        const otherKB = Math.max(0, totalKB - jsKB - cssKB - imageKB);

        const data: ResourceData[] = [
            { label: 'JavaScript', value: jsKB, color: '#f59e0b' },
            { label: 'CSS', value: cssKB, color: '#06b6d4' },
            { label: 'Images', value: imageKB, color: '#22c55e' },
            { label: 'Other', value: otherKB, color: '#6b7280' },
        ].filter(d => d.value > 0);

        const width = 280;
        const height = 280;
        const radius = Math.min(width, height) / 2 - 10;

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie<ResourceData>()
            .value(d => d.value)
            .sort(null)
            .padAngle(0.03);

        const arc = d3.arc<d3.PieArcDatum<ResourceData>>()
            .innerRadius(radius * 0.55)
            .outerRadius(radius)
            .cornerRadius(4);

        const arcs = g.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // Animated slices
        arcs.append('path')
            .attr('fill', d => d.data.color)
            .attr('opacity', 0.9)
            .attr('stroke', '#0a0a0a')
            .attr('stroke-width', 2)
            .transition()
            .duration(800)
            .delay((_, i) => i * 100)
            .attrTween('d', function (d) {
                const interpolate = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
                return (t: number) => arc(interpolate(t)) as string;
            });

        // Center text
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.2em')
            .attr('fill', '#f9fafb')
            .attr('font-size', '24px')
            .attr('font-weight', '800')
            .text(`${totalWeightMB.toFixed(1)}`);

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1.3em')
            .attr('fill', '#9ca3af')
            .attr('font-size', '12px')
            .text('MB Total');

    }, [jsKB, cssKB, imageKB, totalWeightMB]);

    return (
        <div className="flex flex-col items-center gap-4">
            <svg ref={ref} />
            <div className="flex flex-wrap justify-center gap-4 text-sm">
                {[
                    { label: 'JavaScript', color: '#f59e0b', value: jsKB },
                    { label: 'CSS', color: '#06b6d4', value: cssKB },
                    { label: 'Images', color: '#22c55e', value: imageKB },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span
                            className="inline-block h-3 w-3 rounded-sm"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-400">{item.label}</span>
                        <span className="font-semibold text-gray-200">{item.value.toFixed(0)} KB</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
