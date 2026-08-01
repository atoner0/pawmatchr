import type { HomeType, HomeLocation, OutdoorSpace, YoungestChildAge, HoursAlone, MultiPetExpLevel, AgePref, GenderPref, SizePref, SheddingPref, TrainingCommitment, PetType } from "./questionnaireSchema.js"

import type { ActivityLevel } from "./dogSchemas.js"

export interface Adopter {
    adopter_id: number
    first_name: string
    last_name: string
    email: string
    password_hash: string
    phone: string
    postcode: string
    home_type?: HomeType | null,
    home_location?: HomeLocation | null,
    outdoor_space?: OutdoorSpace | null,
    current_pets?: boolean | null,
    current_pet_type?: PetType[],
    current_pet_count?: number | null,
    children?: boolean | null,
    youngest_child_age?: YoungestChildAge | null,
    hours_alone?: HoursAlone | null,
    activity_level?: ActivityLevel | null,
    first_time_owner?: boolean | null,
    multi_pet_exp?: boolean | null,
    multi_pet_exp_level?: MultiPetExpLevel | null,
    age_pref?: AgePref[],
    gender_pref?: GenderPref | null,
    size_pref?: SizePref[],
    shedding_pref?: SheddingPref | null,
    training_commitment?: TrainingCommitment | null,
    pref_notes?: string | null,
    completed_at?: string | null
}

export type SafeAdopter = Omit<Adopter, 'password_hash'>