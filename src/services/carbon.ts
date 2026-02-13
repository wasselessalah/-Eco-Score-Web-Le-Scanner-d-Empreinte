import type { CarbonResult, EcoRating } from '@/types';

const ENERGY_PER_GB = 0.81;
const CO2_PER_KWH = 475;

function getEcoRating(ecoScore: number): EcoRating {
    if (ecoScore >= 70) return 'green';
    if (ecoScore >= 40) return 'moderate';
    return 'heavy';
}

function calculateEcoScore(co2Grams: number): number {
    // Scale: 0g = 100, 5g+ = 0
    // Linear mapping: score = 100 - (co2 / 5) * 100
    const score = Math.round(100 - (co2Grams / 5) * 100);
    return Math.max(0, Math.min(100, score));
}

export function calculateCarbon(totalWeightMB: number): CarbonResult {
    const totalGB = totalWeightMB / 1024;
    const energyKwh = totalGB * ENERGY_PER_GB;
    const co2Grams = energyKwh * CO2_PER_KWH;
    const ecoScore = calculateEcoScore(co2Grams);
    const rating = getEcoRating(ecoScore);

    return {
        energyKwh: Number(energyKwh.toFixed(6)),
        co2Grams: Number(co2Grams.toFixed(4)),
        ecoScore,
        rating,
    };
}
