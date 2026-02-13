'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getRatingColor } from '@/lib/utils';

interface EcoScoreGaugeProps {
    score: number;
    rating: string;
    size?: number;
}

export default function EcoScoreGauge({ score, rating, size = 240 }: EcoScoreGaugeProps) {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const width = size;
        const height = size;
        const radius = Math.min(width, height) / 2 - 20;
        const thickness = 20;

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Background arc
        const bgArc = d3.arc<unknown>()
            .innerRadius(radius - thickness)
            .outerRadius(radius)
            .startAngle(-Math.PI * 0.75)
            .endAngle(Math.PI * 0.75)
            .cornerRadius(thickness / 2);

        g.append('path')
            .attr('d', bgArc({}) as string)
            .attr('fill', '#1f2937');

        // Score arc with animation
        const scoreAngle = -Math.PI * 0.75 + (score / 100) * Math.PI * 1.5;

        const scoreArc = d3.arc<unknown>()
            .innerRadius(radius - thickness)
            .outerRadius(radius)
            .startAngle(-Math.PI * 0.75)
            .cornerRadius(thickness / 2);

        const color = getRatingColor(rating);

        const scorePath = g.append('path')
            .attr('fill', color)
            .attr('filter', `drop-shadow(0 0 8px ${color}40)`);

        // Animate the arc
        scorePath
            .transition()
            .duration(1200)
            .ease(d3.easeCubicOut)
            .attrTween('d', () => {
                const interpolate = d3.interpolate(-Math.PI * 0.75, scoreAngle);
                return (t: number) => {
                    return (scoreArc as d3.Arc<unknown, unknown>)
                        .endAngle(interpolate(t))({}) as string;
                };
            });

        // Central score text
        const scoreText = g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.1em')
            .attr('fill', '#f9fafb')
            .attr('font-size', `${size / 4}px`)
            .attr('font-weight', '800')
            .attr('font-family', 'var(--font-display, system-ui)')
            .text('0');

        scoreText
            .transition()
            .duration(1200)
            .ease(d3.easeCubicOut)
            .tween('text', () => {
                const interpolate = d3.interpolateRound(0, score);
                return (t: number) => {
                    scoreText.text(interpolate(t));
                };
            });

        // Label
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', `${size / 8}px`)
            .attr('fill', color)
            .attr('font-size', '14px')
            .attr('font-weight', '600')
            .attr('letter-spacing', '2px')
            .attr('text-transform', 'uppercase')
            .text(rating === 'green' ? 'EFFICIENT' : rating === 'moderate' ? 'MODERATE' : 'HEAVY');

    }, [score, rating, size]);

    return <svg ref={ref} className="mx-auto" />;
}
