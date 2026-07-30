import { ActivityLevel, AgePref, GenderPref, HomeLocation, HomeType, HoursAlone, MultiPetExpLevel, OutdoorSpace, SheddingPref, SizePref, TrainingCommitment, YoungestChildAge } from "@/types/questionnaireSchema"

type Option<T> = {
    label: string
    value: T
}

export const homeTypeOptions: Option<HomeType>[] = [
    { label: "Apartment/Flat", value: "apartment" },
    { label: "Semi-detached", value: "semi-detached" },
    { label: "Detached", value: "detached" }
]

export const homeLocationOptions: Option<HomeLocation>[] = [
    { label: "Urban/City", value: "urban" },
    { label: "Suburban", value: "suburban" },
    { label: "Rural", value: "rural" },
]

export const outdoorSpaceOptions: Option<OutdoorSpace>[] = [
    { label: "Large outdoor space", value: "large" },
    { label: "Medium outdoor space", value: "medium" },
    { label: "Small outdoor space", value: "small" },
    { label: "No outdoor space", value: "none" },
]

export const youngestChildOptions: Option<YoungestChildAge>[] = [
    { label: "Under 5", value: "under_5" },
    { label: "5-12", value: "5_12" },
    { label: "13+", value: "13_plus" },
]

export const hoursAloneOptions: Option<HoursAlone>[] = [
    { label: "0-2 hours", value: "0_2" },
    { label: "2-4 hours", value: "2_4" },
    { label: "4-6 hours", value: "4_6" },
    { label: "6-8 hours", value: "6_8" },
    { label: "8+ hours", value: "8_plus" },
]

export const activityLevelOptions: Option<ActivityLevel>[] = [
    { label: "Low activity (< 30 mins)", value: "low" },
    { label: "Medium activity (30 - 60 mins)", value: "medium" },
    { label: "Moderate activity (60 - 90 mins)", value: "moderate" },
    { label: "High activity (90 - 120 mins)", value: "high" },
    { label: "Very high activity (120+ mins)", value: "very_high" },
]

export const multiPetLevelOptions: Option<MultiPetExpLevel>[] = [
    { label: "Once or twice", value: "once_twice" },
    { label: "Several times", value: "several" },
    { label: "Extensive experience", value: "extensive" },
]

export const agePrefOptions: Option<AgePref>[] = [
    { label: "0-2 years", value: "0_2" },
    { label: "3-5 years", value: "3_5" },
    { label: "6-8 years", value: "6_8" },
    { label: "8+ years", value: "8_plus" },
    { label: "No preference", value: "none" },
]

export const genderPrefOptions: Option<GenderPref>[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "No preference", value: "none" },
]

export const sizePrefOptions: Option<SizePref>[] = [
    { label: "Small (e.g. Chihuahua)", value: "small" },
    { label: "Medium (e.g. Border Collie)", value: "medium"},
    { label: "Large (e.g. Rottweiler)", value: "large" },
    { label: "Giant (e.g. Great Dane)", value: "giant" },
    { label: "No preference", value: "none" },
]

export const sheddingPrefOptions: Option<SheddingPref>[] = [
    { label: "Doesn't shed", value: "none" },
    { label: "Low shedding", value: "low" },
    { label: "Medium shedding", value: "medium" },
    { label: "High/No preference", value: "high" },
]

export const trainingCommitmentOptions: Option<TrainingCommitment>[] = [
    { label: "None", value: "none" },
    { label: "Basic obedience only", value: "basic" },
    { label: "Moderate", value: "moderate" },
    { label: "Intensive", value: "intensive" },
]