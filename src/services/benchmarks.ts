import type { Benchmark } from '@/types';
import { calculateCarbon } from './carbon';

export const BENCHMARKS: Benchmark[] = [
    {
        label: 'Optimized Green Site',
        weightMB: 0.5,
        co2Grams: calculateCarbon(0.5).co2Grams,
        color: '#22c55e',
    },
    {
        label: 'Average Web Page',
        weightMB: 2.5,
        co2Grams: calculateCarbon(2.5).co2Grams,
        color: '#eab308',
    },
    {
        label: 'Heavy Website',
        weightMB: 8.0,
        co2Grams: calculateCarbon(8.0).co2Grams,
        color: '#ef4444',
    },
];

export function getBenchmarkPosition(co2Grams: number): {
    percentage: number;
    nearestBenchmark: Benchmark;
} {
    const maxCo2 = BENCHMARKS[BENCHMARKS.length - 1].co2Grams;
    const percentage = Math.min(100, (co2Grams / maxCo2) * 100);

    let nearestBenchmark = BENCHMARKS[0];
    let minDiff = Math.abs(co2Grams - BENCHMARKS[0].co2Grams);

    for (const benchmark of BENCHMARKS) {
        const diff = Math.abs(co2Grams - benchmark.co2Grams);
        if (diff < minDiff) {
            minDiff = diff;
            nearestBenchmark = benchmark;
        }
    }

    return { percentage, nearestBenchmark };
}
