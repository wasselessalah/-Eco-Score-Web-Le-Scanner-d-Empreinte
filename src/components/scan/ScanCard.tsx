'use client';

import type { ScanResult } from '@/types';
import { formatCO2, formatMB, getRatingColor, getRatingLabel } from '@/lib/utils';

interface ScanCardProps {
    scan: ScanResult;
    onDelete?: (id: string) => void;
    onRescan?: (url: string) => void;
}

export default function ScanCard({ scan, onDelete, onRescan }: ScanCardProps) {
    const ratingColor = getRatingColor(scan.rating);
    const date = new Date(scan.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="group relative rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <a
                        href={`/scan/${scan.id}`}
                        className="block truncate text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                    >
                        {scan.url}
                    </a>
                    <p className="mt-1 text-xs text-gray-500">{date}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Score badge */}
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-extrabold"
                        style={{ backgroundColor: `${ratingColor}15`, color: ratingColor }}
                    >
                        {scan.eco_score}
                    </div>
                </div>
            </div>

            {/* Metrics row */}
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>{formatCO2(scan.co2_grams)} CO₂</span>
                <span className="text-gray-600">•</span>
                <span>{formatMB(scan.total_weight_mb)}</span>
                <span className="text-gray-600">•</span>
                <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{ backgroundColor: `${ratingColor}15`, color: ratingColor }}
                >
                    {getRatingLabel(scan.rating)}
                </span>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {onRescan && (
                    <button
                        onClick={() => onRescan(scan.url)}
                        className="rounded-md border border-white/10 px-3 py-1 text-xs text-gray-400 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
                    >
                        Re-scan
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(scan.id)}
                        className="rounded-md border border-white/10 px-3 py-1 text-xs text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
