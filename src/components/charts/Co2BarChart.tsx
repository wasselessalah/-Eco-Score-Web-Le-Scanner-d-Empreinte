'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Benchmark } from '@/types';

interface Co2BarChartProps {
    currentCo2: number;
    currentLabel: string;
    benchmarks: Benchmark[];
}

export default function Co2BarChart({ currentCo2, currentLabel, benchmarks }: Co2BarChartProps) {
    const ref = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 10, left: 150 };
        const width = Math.min(containerWidth, 560) - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        const allData = [
            { label: currentLabel, value: currentCo2, color: '#3b82f6' },
            ...benchmarks.map(b => ({ label: b.label, value: b.co2Grams, color: b.color })),
        ];

        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const y = d3.scaleBand()
            .domain(allData.map(d => d.label))
            .range([0, height])
            .padding(0.35);

        const x = d3.scaleLinear()
            .domain([0, d3.max(allData, d => d.value)! * 1.2])
            .range([0, width]);

        // Bars with animation
        g.selectAll('.bar')
            .data(allData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', d => y(d.label)!)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('width', 0)
            .attr('fill', d => d.color)
            .attr('rx', 4)
            .attr('opacity', 0.9)
            .transition()
            .duration(800)
            .delay((_, i) => i * 120)
            .ease(d3.easeCubicOut)
            .attr('width', d => x(d.value));

        // Labels (left)
        g.selectAll('.label')
            .data(allData)
            .enter()
            .append('text')
            .attr('x', -8)
            .attr('y', d => y(d.label)! + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('fill', '#d1d5db')
            .attr('font-size', '12px')
            .text(d => d.label);

        // Values (right of bar)
        g.selectAll('.value')
            .data(allData)
            .enter()
            .append('text')
            .attr('x', d => x(d.value) + 8)
            .attr('y', d => y(d.label)! + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('fill', '#9ca3af')
            .attr('font-size', '12px')
            .attr('font-weight', '600')
            .attr('opacity', 0)
            .text(d => `${d.value.toFixed(2)}g`)
            .transition()
            .duration(400)
            .delay((_, i) => 800 + i * 120)
            .attr('opacity', 1);

    }, [currentCo2, currentLabel, benchmarks]);

    return (
        <div ref={containerRef} className="w-full overflow-x-auto">
            <svg ref={ref} />
        </div>
    );
}
