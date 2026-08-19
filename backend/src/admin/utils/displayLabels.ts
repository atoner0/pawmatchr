export const AGE_LABELS: Record<string, string> = {
    '0_2': '0-2 Years',
    '3_5': '3-5 Years',
    '6_8': '6-8 Years',
    '8_plus': '8+ Years'
}

export function ageLabel(value: string): string {
    return AGE_LABELS[value] ?? value;
}

export function capitaliseFirst(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const ALONE_TOLERANCE_LABELS: Record<string, string> = {
    '0_2': '0-2 Hours',
    '2_4': '2-4 Hours',
    '4_6': '4-6 Hours',
    '6_8': '6-8 Hours',
    '8_plus': '8+ Hours'
}

export function aloneToleranceLabel(value: string): string {
    return ALONE_TOLERANCE_LABELS[value] ?? value;
}

export const CHILDREN_AGE_LABELS: Record<string, string> = {
    'any': 'Any',
    '5_12': '5-12 only',
    '13_plus': '13+ only',
    'unknown': 'Unknown'
}

export function childrenAgeLabel(value: string): string {
    return CHILDREN_AGE_LABELS[value] ?? value;
}

export const TRAINING_LEVEL_LABELS: Record<string, string> = {
    'none': 'None',
    'basic': 'Basic Obedience',
    'moderate': 'Moderate',
    'experienced_only': 'High - Experienced Only'
}

export function trainingLevelLabel(value: string): string {
    return TRAINING_LEVEL_LABELS[value] ?? value;
}

export function petCountSummary(count: number, types:string[]): string {
    if(!types || types.length === 0) return `${count} pet(s)`
    return `${count} ${types.map(t => t.toLowerCase()).join(', ')}`
}