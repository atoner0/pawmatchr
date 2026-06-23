import { z } from 'zod'

export const DogAgeEnum = z.enum(['0_2', '3_5', '6_8', '8_plus', 'unknown'])
export const DogGenderEnum = z.enum(['male', 'female'])
export const DogSizeEnum = z.enum(['small', 'medium', 'large', 'giant'])
export const GoodWithEnum = z.enum(['yes', 'no', 'unknown'])
export const AloneToleranceEnum = z.enum(['0_2', '2_4', '4_6', '6_8', '8_plus'])
export const ActivityLevelEnum = z.enum(['low', 'medium', 'moderate', 'high', 'very_high'])
export const TrainingLevelEnum = z.enum(['none', 'basic', 'moderate', 'experienced_only'])
export const CoatLengthEnum = z.enum(['short', 'medium', 'long'])
export const CoatTypeEnum = z.enum(['double', 'single', 'curly', 'silky', 'rough', 'wire', 'smooth', 'hairless'])
export const SheddingLevelEnum = z.enum(['low', 'medium', 'high'])
export const DogStatusEnum = z.enum(['available', 'pending', 'adopted'])
export const ChildrenAgeEnum = z.enum(['any', '5_12', '13_plus', 'unknown'])

export type DogAge = z.infer<typeof DogAgeEnum>
export type DogGender = z.infer<typeof DogGenderEnum>
export type DogSize = z.infer<typeof DogSizeEnum>
export type GoodWith = z.infer<typeof GoodWithEnum>
export type AloneTolerance = z.infer<typeof AloneToleranceEnum>
export type ActivityLevel = z.infer<typeof ActivityLevelEnum>
export type TrainingLevel = z.infer<typeof TrainingLevelEnum>
export type CoatLength = z.infer<typeof CoatLengthEnum>
export type CoatType = z.infer<typeof CoatTypeEnum>
export type SheddingLevel = z.infer<typeof SheddingLevelEnum>
export type DogStatus = z.infer<typeof DogStatusEnum>
export type ChildrenAge = z.infer<typeof ChildrenAgeEnum>

export const createDogSchema = z.object({
    name: z.string().min(1),
    breed: z.string().min(1),
    age: DogAgeEnum,
    gender: DogGenderEnum,
    size: DogSizeEnum,
    colour: z.array(z.string()).min(1),
    neutered: z.boolean(),
    house_trained: z.boolean(),
    vaccinated: z.boolean(),
    good_with_dogs: GoodWithEnum,
    good_with_cats: GoodWithEnum,
    good_with_children: GoodWithEnum,
    children_age: ChildrenAgeEnum.nullable().optional(),
    alone_tolerance: AloneToleranceEnum,
    activity_level: ActivityLevelEnum,
    training_level: TrainingLevelEnum,
    coat_length: CoatLengthEnum,
    coat_type: CoatTypeEnum,
    shedding_level: SheddingLevelEnum,
    medical_issues: z.array(z.string()).default([]),
    medical_notes: z.string().nullable().optional(),
    behavioural_flags: z.array(z.string()).default([]),
    behavioural_notes: z.string().nullable().optional(),
    known_triggers: z.array(z.string()).default([]),
    trigger_notes: z.string().nullable().optional(),
    description: z.string().min(1)
})