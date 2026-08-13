export const AGE_LABELS: Record<string, string> = {
    '0_2': '0-2 Years',
    '3_5': '3-5 Years',
    '6_8': '6-8 Years',
    '8_plus': '8+ Years'
}

export function ageLabel(value: string): string {
    return AGE_LABELS[value] ?? value;
}
