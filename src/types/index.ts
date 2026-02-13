export type EcoRating = 'green' | 'moderate' | 'heavy';

export interface ScanResult {
    id: string;
    user_id: string | null;
    url: string;
    total_weight_mb: number;
    total_requests: number;
    js_size_kb: number;
    css_size_kb: number;
    image_size_kb: number;
    performance_score: number;
    energy_kwh: number;
    co2_grams: number;
    eco_score: number;
    rating: EcoRating;
    is_public: boolean;
    created_at: string;
}

export interface CarbonResult {
    energyKwh: number;
    co2Grams: number;
    ecoScore: number;
    rating: EcoRating;
}

export interface LighthouseData {
    totalWeightMB: number;
    totalRequests: number;
    jsSizeKB: number;
    cssSizeKB: number;
    imageSizeKB: number;
    performanceScore: number;
}

export interface Benchmark {
    label: string;
    weightMB: number;
    co2Grams: number;
    color: string;
}

export interface ScanRequest {
    url: string;
}

export interface ScanResponse {
    success: boolean;
    data?: ScanResult;
    error?: string;
}
