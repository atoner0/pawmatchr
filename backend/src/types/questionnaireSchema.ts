import { z } from 'zod'
import { ActivityLevelEnum } from './dogSchemas.js'

export const HomeTypeEnum = z.enum(['apartment', 'semi-detached', 'detached'])
export const HomeLocationEnum = z.enum(['urban', 'suburban', 'rural'])
export const OutdoorSpaceEnum = z.enum(['large', 'medium', 'small', 'none'])
export const PetTypeEnum = z.enum(['dog', 'cat', 'other'])
export const YoungestChildAgeEnum = z.enum(['under_5', '5_12', '13_plus']).nullable().optional()
export const HoursAloneEnum = z.enum(['0_2', '2_4', '4_6', '6_8', '8_plus'])
export const MultiPetExpLevelEnum = z.enum(['once_twice', 'several', 'extensive']).nullable().optional()
export const AgePrefEnum = z.enum(['0_2', '3_5', '6_8', '8_plus', 'none'])
export const GenderPrefEnum = z.enum(['male', 'female', 'none'])
export const SizePrefEnum = z.enum(['small', 'medium', 'large', 'giant', 'none'])
export const SheddingPrefEnum = z.enum(['none', 'low', 'medium', 'high'])
export const TrainingCommitmentEnum = z.enum(['none', 'basic', 'moderate', 'intensive'])

export type HomeType = z.infer<typeof HomeTypeEnum>
export type HomeLocation = z.infer<typeof HomeLocationEnum>
export type OutdoorSpace = z.infer<typeof OutdoorSpaceEnum>
export type PetType = z.infer<typeof PetTypeEnum>
export type YoungestChildAge = z.infer<typeof YoungestChildAgeEnum>
export type HoursAlone = z.infer<typeof HoursAloneEnum>
export type MultiPetExpLevel = z.infer<typeof MultiPetExpLevelEnum>
export type AgePref = z.infer<typeof AgePrefEnum>
export type GenderPref = z.infer<typeof GenderPrefEnum>
export type SizePref = z.infer<typeof SizePrefEnum>
export type SheddingPref = z.infer<typeof SheddingPrefEnum>
export type TrainingCommitment = z.infer<typeof TrainingCommitmentEnum>

export const createQuestionnaireSchema = z.object({
    home_type: HomeTypeEnum,
    home_location: HomeLocationEnum,
    outdoor_space: OutdoorSpaceEnum,
    current_pets: z.boolean(),
    current_pet_type: z.array(PetTypeEnum),
    current_pet_count: z.number().int().min(1).max(4).nullable().optional(),
    children: z.boolean(),
    youngest_child_age: YoungestChildAgeEnum,
    hours_alone: HoursAloneEnum,
    activity_level: ActivityLevelEnum,
    first_time_owner: z.boolean(),
    multi_pet_exp: z.boolean(),
    multi_pet_exp_level: MultiPetExpLevelEnum,
    age_pref: z.array(AgePrefEnum),
    gender_pref: GenderPrefEnum,
    size_pref: z.array(SizePrefEnum),
    shedding_pref: SheddingPrefEnum,
    training_commitment: TrainingCommitmentEnum,
    pref_notes: z.string().optional(),
}).superRefine((data, ctx) => {
    const noPreferenceConflict = (field: string[], path: string) => {
        if (field.includes("none") && field.length > 1) {
            ctx.addIssue({
                code: "custom",
                message: "Cannot select another option if no preference is selected",
                path: [path],
            })
        }
    }

    noPreferenceConflict(data.age_pref, "age_pref")
    noPreferenceConflict(data.size_pref, "size_pref")
})

export type QuestionnaireInput = z.infer<typeof createQuestionnaireSchema>