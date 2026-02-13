'use client';

import ScanResult from '@/components/scan/ScanResult';
import type { ScanResult as ScanResultType } from '@/types';

interface ScanResultViewProps {
    scan: ScanResultType;
}

export default function ScanResultView({ scan }: ScanResultViewProps) {
    return <ScanResult data={scan} />;
}
