import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ScanResultView from './ScanResultView';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: scan } = await supabase
        .from('scans')
        .select('url, eco_score, rating')
        .eq('id', id)
        .eq('is_public', true)
        .single();

    if (!scan) {
        return { title: 'Scan Not Found — Éco-Score Web' };
    }

    return {
        title: `Éco-Score ${scan.eco_score}/100 — ${scan.url}`,
        description: `This website scored ${scan.eco_score}/100 on the Éco-Score. Rating: ${scan.rating}. Analyze your own website's carbon footprint.`,
        openGraph: {
            title: `Éco-Score ${scan.eco_score}/100 for ${scan.url}`,
            description: `Carbon footprint analysis: ${scan.rating} rating with eco-score ${scan.eco_score}/100`,
        },
    };
}

export default async function PublicScanPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: scan, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

    if (error || !scan) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <ScanResultView scan={scan} />
        </div>
    );
}
