import { ActivityLevel, AloneTolerance, ChildrenAge, CoatLength, CoatType, DogAge, DogGender, DogSize, DogStatus, GoodWith, SheddingLevel, TrainingLevel } from "@/types/dogSchema"

export type DogLabel<T> = {
    label: string
    value: T
}

export const ageLabel: DogLabel<DogAge>[] = [
    { label: "0-2 years", value: "0_2" },
    { label: "3-5 years", value: "3_5" },
    { label: "6-8 years", value: "6_8" },
    { label: "8+ years", value: "8_plus" },
]

export const genderLabel: DogLabel<DogGender>[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
]

export const sizeLabel: DogLabel<DogSize>[] = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "Giant", value: "giant" },
]

export const goodWithLabel: DogLabel<GoodWith>[] = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Unknown", value: "unknown" },
]

export const aloneToleranceLabel: DogLabel<AloneTolerance>[] = [
    { label: "0-2 hours", value: "0_2" },
    { label: "2-4 hours", value: "2_4" },
    { label: "4-6 hours", value: "4_6" },
    { label: "6-8 hours", value: "6_8" },
    { label: "8+ hours", value: "8_plus" },
]

export const activityLevelLabel: DogLabel<ActivityLevel>[] = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "Moderate", value: "moderate" },
    { label: "High", value: "high" },
    { label: "Very high", value: "very_high" },
]

export const trainingLevelLabel: DogLabel<TrainingLevel>[] = [
    { label: "None", value: "none" },
    { label: "Basic", value: "basic" },
    { label: "Moderate", value: "moderate" },
    { label: "Extensive (Experienced Owner Needed)", value: "experienced_only" },
]

export const coatLengthLabel: DogLabel<CoatLength>[] = [
    { label: "Short", value: "short" },
    { label: "Medium", value: "medium" },
    { label: "Long", value: "long" },
]

export const coatTypeLabel: DogLabel<CoatType>[] = [
    { label: "Double", value: "double" },
    { label: "Single", value: "single" },
    { label: "Curly", value: "curly" },
    { label: "Silky", value: "silky" },
    { label: "Rough", value: "rough" },
    { label: "Wire", value: "wire" },
    { label: "Smooth", value: "smooth" },
    { label: "Hairless", value: "hairless" },
]

export const sheddingLevelLabel: DogLabel<SheddingLevel>[] = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
]

export const dogStatusLabel: DogLabel<DogStatus>[] = [
    { label: "Available", value: "available" },
    { label: "Pending", value: "pending" },
    { label: "Adopted", value: "adopted" },
]

export const childrenAgeLabel: DogLabel<ChildrenAge>[] = [
    { label: "Any", value: "any" },
    { label: "5-12 years", value: "5_12" },
    { label: "13+", value: "13_plus" },
    { label: "Unknown", value: "unknown" },
]

export function getDogLabel<T>(options: DogLabel<T>[], value: T): string {
    return options.find(o => o.value === value)?.label ?? String(value);
}