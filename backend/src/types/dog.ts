import type { DogAge, DogGender, DogSize, GoodWith, ChildrenAge, AloneTolerance, 
              ActivityLevel, TrainingLevel, CoatLength, CoatType, SheddingLevel, DogStatus } from './dogSchemas.js'

export interface Dog {
    dog_id: number
    shelter_id: number
    name: string
    breed: string
    photo_url: string
    age: DogAge
    gender: DogGender
    size: DogSize
    colour: string[]
    neutered: boolean
    house_trained: boolean
    vaccinated: boolean
    good_with_dogs: GoodWith
    good_with_cats: GoodWith
    good_with_children: GoodWith
    children_age: ChildrenAge | null
    alone_tolerance: AloneTolerance
    activity_level: ActivityLevel
    training_level: TrainingLevel
    coat_length: CoatLength
    coat_type: CoatType
    shedding_level: SheddingLevel
    medical_issues: string[]
    medical_notes: string | null
    behavioural_flags: string[]
    behavioural_notes: string | null
    known_triggers: string[]
    trigger_notes: string | null
    status: DogStatus
    description: string
    intake_date: string
}