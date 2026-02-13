import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runLighthouse } from '@/services/lighthouse';
import { calculateCarbon } from '@/services/carbon';
import { createClient } from '@/lib/supabase/server';

const scanSchema = z.object({
    url: z.string().url('Please enter a valid URL'),
});

const PRIVATE_IP_PATTERNS = [
    /^https?:\/\/localhost/i,
    /^https?:\/\/127\./,
    /^https?:\/\/10\./,
    /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./,
    /^https?:\/\/192\.168\./,
    /^https?:\/\/0\./,
    /^https?:\/\/\[::1\]/,
];

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimit.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return true;
    }

    if (entry.count >= RATE_LIMIT) return false;

    entry.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded. Try again in a minute.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const parsed = scanSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid URL' },
                { status: 400 }
            );
        }

        const { url } = parsed.data;

        // Block private/internal IPs
        if (PRIVATE_IP_PATTERNS.some(pattern => pattern.test(url))) {
            return NextResponse.json(
                { success: false, error: 'Scanning private or internal URLs is not allowed.' },
                { status: 400 }
            );
        }

        // Ensure valid protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return NextResponse.json(
                { success: false, error: 'URL must start with http:// or https://' },
                { status: 400 }
            );
        }

        // Run Lighthouse via PageSpeed Insights
        const lighthouseData = await runLighthouse(url);

        // Calculate carbon footprint
        const carbonResult = calculateCarbon(lighthouseData.totalWeightMB);

        // Try to save to database if user is authenticated
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let scanId: string | null = null;
        if (user) {
            const { data: scan, error } = await supabase
                .from('scans')
                .insert({
                    user_id: user.id,
                    url,
                    total_weight_mb: lighthouseData.totalWeightMB,
                    total_requests: lighthouseData.totalRequests,
                    js_size_kb: lighthouseData.jsSizeKB,
                    css_size_kb: lighthouseData.cssSizeKB,
                    image_size_kb: lighthouseData.imageSizeKB,
                    performance_score: lighthouseData.performanceScore,
                    energy_kwh: carbonResult.energyKwh,
                    co2_grams: carbonResult.co2Grams,
                    eco_score: carbonResult.ecoScore,
                    rating: carbonResult.rating,
                    is_public: true,
                })
                .select('id')
                .single();

            if (!error && scan) {
                scanId = scan.id;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                id: scanId,
                url,
                ...lighthouseData,
                ...carbonResult,
                is_public: true,
                created_at: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Scan error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'An unexpected error occurred.',
            },
            { status: 500 }
        );
    }
}
