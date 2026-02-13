'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Benchmark } from '@/types';

interface BenchmarkComparisonProps {
    currentCo2: number;
    benchmarks: Benchmark[];
}

export default function BenchmarkComparison({ currentCo2, benchmarks }: BenchmarkComparisonProps) {
    const ref = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const margin = { top: 40, right: 30, bottom: 30, left: 30 };
        const width = Math.min(containerWidth, 560) - margin.left - margin.right;
        const height = 100;

        const maxCo2 = Math.max(currentCo2, ...benchmarks.map(b => b.co2Grams)) * 1.3;

        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, maxCo2])
            .range([0, width]);

        // Gradient track
        const gradientId = 'benchmark-gradient';
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%');

        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#22c55e');
        gradient.append('stop').attr('offset', '50%').attr('stop-color', '#eab308');
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444');

        // Track bar
        g.append('rect')
            .attr('x', 0)
            .attr('y', height / 2 - 8)
            .attr('width', width)
            .attr('height', 16)
            .attr('rx', 8)
            .attr('fill', `url(#${gradientId})`)
            .attr('opacity', 0.3);

        // Benchmark markers
        benchmarks.forEach(b => {
            const bx = x(b.co2Grams);
            g.append('line')
                .attr('x1', bx).attr('y1', height / 2 - 20)
                .attr('x2', bx).attr('y2', height / 2 + 20)
                .attr('stroke', b.color)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '4,3');

            g.append('text')
                .attr('x', bx)
                .attr('y', height / 2 + 36)
                .attr('text-anchor', 'middle')
                .attr('fill', '#9ca3af')
                .attr('font-size', '10px')
                .text(b.label);
        });

        // Current position marker (animated)
        const marker = g.append('g')
            .attr('transform', `translate(0, ${height / 2})`);

        marker.append('circle')
            .attr('r', 10)
            .attr('fill', '#f9fafb')
            .attr('stroke', '#0a0a0a')
            .attr('stroke-width', 3);

        marker.append('text')
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#f9fafb')
            .attr('font-size', '13px')
            .attr('font-weight', '700')
            .text(`${currentCo2.toFixed(2)}g CO₂`);

        marker
            .transition()
            .duration(1000)
            .ease(d3.easeCubicOut)
            .attr('transform', `translate(${x(currentCo2)}, ${height / 2})`);

    }, [currentCo2, benchmarks]);

    return (
        <div ref={containerRef} className="w-full overflow-x-auto">
            <svg ref={ref} />
        </div>
    );
}
