'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ScanResult } from '@/types';

interface EvolutionChartProps {
    scans: ScanResult[];
}

export default function EvolutionChart({ scans }: EvolutionChartProps) {
    const ref = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !containerRef.current || scans.length < 2) return;

        const containerWidth = containerRef.current.clientWidth;
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = Math.min(containerWidth, 600) - margin.left - margin.right;
        const height = 220 - margin.top - margin.bottom;

        const sorted = [...scans].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(sorted, d => new Date(d.created_at)) as [Date, Date])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);

        // Grid lines
        g.append('g')
            .attr('class', 'grid')
            .selectAll('line')
            .data([25, 50, 75])
            .enter()
            .append('line')
            .attr('x1', 0).attr('x2', width)
            .attr('y1', d => y(d)).attr('y2', d => y(d))
            .attr('stroke', '#1f2937')
            .attr('stroke-dasharray', '3,3');

        // X axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d => {
                const date = d as Date;
                return `${date.getDate()}/${date.getMonth() + 1}`;
            }))
            .selectAll('text, line, path')
            .attr('stroke', '#6b7280')
            .attr('fill', '#6b7280');

        // Y axis
        g.append('g')
            .call(d3.axisLeft(y).ticks(4))
            .selectAll('text, line, path')
            .attr('stroke', '#6b7280')
            .attr('fill', '#6b7280');

        // Area fill
        const area = d3.area<ScanResult>()
            .x(d => x(new Date(d.created_at)))
            .y0(height)
            .y1(d => y(d.eco_score))
            .curve(d3.curveMonotoneX);

        const areaGradientId = 'evolution-area';
        const defs = svg.append('defs');
        const areaGradient = defs.append('linearGradient')
            .attr('id', areaGradientId)
            .attr('x1', '0').attr('y1', '0')
            .attr('x2', '0').attr('y2', '1');

        areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#22c55e').attr('stop-opacity', 0.3);
        areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#22c55e').attr('stop-opacity', 0);

        g.append('path')
            .datum(sorted)
            .attr('fill', `url(#${areaGradientId})`)
            .attr('d', area);

        // Line
        const line = d3.line<ScanResult>()
            .x(d => x(new Date(d.created_at)))
            .y(d => y(d.eco_score))
            .curve(d3.curveMonotoneX);

        const path = g.append('path')
            .datum(sorted)
            .attr('fill', 'none')
            .attr('stroke', '#22c55e')
            .attr('stroke-width', 2.5)
            .attr('d', line);

        // Animate line drawing
        const totalLength = (path.node() as SVGPathElement)?.getTotalLength() ?? 0;
        path
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .ease(d3.easeCubicOut)
            .attr('stroke-dashoffset', 0);

        // Dots
        g.selectAll('.dot')
            .data(sorted)
            .enter()
            .append('circle')
            .attr('cx', d => x(new Date(d.created_at)))
            .attr('cy', d => y(d.eco_score))
            .attr('r', 0)
            .attr('fill', '#22c55e')
            .attr('stroke', '#0a0a0a')
            .attr('stroke-width', 2)
            .transition()
            .duration(400)
            .delay((_, i) => 1200 + i * 80)
            .attr('r', 5);

    }, [scans]);

    if (scans.length < 2) {
        return (
            <div className="flex h-[220px] items-center justify-center text-gray-500 text-sm">
                Run at least 2 scans to see evolution chart
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full overflow-x-auto">
            <svg ref={ref} />
        </div>
    );
}
