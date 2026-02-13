import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return inputs.filter(Boolean).join(' ');
}

export function formatCO2(grams: number): string {
    if (grams < 1) return `${(grams * 1000).toFixed(1)} mg`;
    return `${grams.toFixed(2)} g`;
}

export function formatKWh(kwh: number): string {
    if (kwh < 0.001) return `${(kwh * 1_000_000).toFixed(1)} µWh`;
    if (kwh < 1) return `${(kwh * 1000).toFixed(2)} mWh`;
    return `${kwh.toFixed(4)} kWh`;
}

export function formatMB(mb: number): string {
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    return `${mb.toFixed(2)} MB`;
}

export function getRatingColor(rating: string): string {
    switch (rating) {
        case 'green': return '#22c55e';
        case 'moderate': return '#eab308';
        case 'heavy': return '#ef4444';
        default: return '#6b7280';
    }
}

export function getRatingLabel(rating: string): string {
    switch (rating) {
        case 'green': return 'Efficient';
        case 'moderate': return 'Moderate';
        case 'heavy': return 'Heavy';
        default: return 'Unknown';
    }
}
