'use client';

import EcoScoreGauge from '@/components/charts/EcoScoreGauge';
import Co2BarChart from '@/components/charts/Co2BarChart';
import ResourceBreakdown from '@/components/charts/ResourceBreakdown';
import BenchmarkComparison from '@/components/charts/BenchmarkComparison';
import { BENCHMARKS } from '@/services/benchmarks';
import { formatCO2, formatKWh, formatMB, getRatingColor, getRatingLabel } from '@/lib/utils';

interface ScanResultData {
    id?: string | null;
    url: string;
    totalWeightMB?: number;
    total_weight_mb?: number;
    totalRequests?: number;
    total_requests?: number;
    jsSizeKB?: number;
    js_size_kb?: number;
    cssSizeKB?: number;
    css_size_kb?: number;
    imageSizeKB?: number;
    image_size_kb?: number;
    performanceScore?: number;
    performance_score?: number;
    energyKwh?: number;
    energy_kwh?: number;
    co2Grams?: number;
    co2_grams?: number;
    ecoScore?: number;
    eco_score?: number;
    rating: string;
}

interface ScanResultProps {
    data: ScanResultData;
}

export default function ScanResult({ data }: ScanResultProps) {
    // Normalize field names (API returns camelCase, DB returns snake_case)
    const totalWeightMB = data.totalWeightMB ?? data.total_weight_mb ?? 0;
    const totalRequests = data.totalRequests ?? data.total_requests ?? 0;
    const jsSizeKB = data.jsSizeKB ?? data.js_size_kb ?? 0;
    const cssSizeKB = data.cssSizeKB ?? data.css_size_kb ?? 0;
    const imageSizeKB = data.imageSizeKB ?? data.image_size_kb ?? 0;
    const performanceScore = data.performanceScore ?? data.performance_score ?? 0;
    const energyKwh = data.energyKwh ?? data.energy_kwh ?? 0;
    const co2Grams = data.co2Grams ?? data.co2_grams ?? 0;
    const ecoScore = data.ecoScore ?? data.eco_score ?? 0;
    const { rating, url } = data;

    const ratingColor = getRatingColor(rating);

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            {/* Header */}
            <div className="text-center">
                <p className="mb-1 text-sm text-gray-400">Scan result for</p>
                <p className="text-lg font-semibold text-white break-all">{url}</p>
                <div
                    className="mt-3 inline-block rounded-full px-4 py-1 text-sm font-bold"
                    style={{ backgroundColor: `${ratingColor}20`, color: ratingColor }}
                >
                    {getRatingLabel(rating)}
                </div>
            </div>

            {/* Score + Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Gauge */}
                <div className="flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <EcoScoreGauge score={ecoScore} rating={rating} />
                </div>

                {/* Stats */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    {[
                        { label: 'CO₂ Emissions', value: formatCO2(co2Grams), sub: 'per page view' },
                        { label: 'Energy', value: formatKWh(energyKwh), sub: 'per page view' },
                        { label: 'Page Weight', value: formatMB(totalWeightMB), sub: `${totalRequests} requests` },
                        { label: 'Performance', value: `${performanceScore}/100`, sub: 'Lighthouse score' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
                        >
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
                            <p className="mt-1 text-2xl font-extrabold text-white">{stat.value}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* CO₂ Comparison */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                        CO₂ Comparison
                    </h3>
                    <Co2BarChart
                        currentCo2={co2Grams}
                        currentLabel="This Page"
                        benchmarks={BENCHMARKS}
                    />
                </div>

                {/* Resource Breakdown */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                        Resource Breakdown
                    </h3>
                    <ResourceBreakdown
                        jsKB={jsSizeKB}
                        cssKB={cssSizeKB}
                        imageKB={imageSizeKB}
                        totalWeightMB={totalWeightMB}
                    />
                </div>
            </div>

            {/* Benchmark Scale */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                    Benchmark Position
                </h3>
                <BenchmarkComparison currentCo2={co2Grams} benchmarks={BENCHMARKS} />
            </div>

            {/* Shareable link */}
            {data.id && (
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Share this result:{' '}
                        <a
                            href={`/scan/${data.id}`}
                            className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
                        >
                            {typeof window !== 'undefined' ? `${window.location.origin}/scan/${data.id}` : `/scan/${data.id}`}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
