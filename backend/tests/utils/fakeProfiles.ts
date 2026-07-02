import type { Adopter } from '../../src/types/adopter.js'
import type { QuestionnaireInput } from '../../src/types/questionnaireSchema.js'
import type { Application } from '../../src/types/application.js'
import type { Dog } from '../../src/types/dog.js'
import type { Favourite } from '../../src/types/favourite.js'
import type { Booking } from '../../src/types/booking.js'
import type { Availability } from '../../src/types/availability.js'

export const fakeAdminPlainPassword = 'TestPassword123!'

export const fakeAdopterFull: Adopter = {
    adopter_id: 1,
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    password_hash: 'hashedpassword',
    phone: '07700900000',
    postcode: 'BT1 1AA',
    home_type: 'detached',
    home_location: 'suburban',
    outdoor_space: 'large',
    current_pets: false,
    current_pet_type: [],
    current_pet_count: null,
    children: false,
    youngest_child_age: null,
    hours_alone: '2_4',
    activity_level: 'moderate',
    first_time_owner: true,
    multi_pet_exp: false,
    multi_pet_exp_level: null,
    age_pref: '3_5',
    gender_pref: 'none',
    size_pref: 'medium',
    shedding_pref: 'low',
    training_commitment: 'basic',
    pref_notes: null,
    completed_at: null
}

export const fakeQuestionnaireInput: QuestionnaireInput = {
    home_type: 'detached',
    home_location: 'rural',
    outdoor_space: 'large',
    current_pets: false,
    current_pet_type: [],
    current_pet_count: null,
    children: false,
    youngest_child_age: null,
    hours_alone: '2_4',
    activity_level: 'moderate',
    first_time_owner: true,
    multi_pet_exp: false,
    multi_pet_exp_level: null,
    age_pref: '3_5',
    gender_pref: 'none',
    size_pref: 'large',
    shedding_pref: 'low',
    training_commitment: 'basic',
    pref_notes: undefined
}

export const fakeAdopterPartial = {
  adopter_id: 1,
  first_name: "Test",
  last_name: "User",
  email: "test@test.com",
  password_hash: "hash",
  phone: "07700000000",
  postcode: "BT35 9SP"
}

export const fakeAdmin = {
  staff_id: 10,
  shelter_id: 5,
  name: "Sarah Connor",
  email: "admin@shelter.com",
  password_hash: "$2b$10$sQhI3vdK2UuVcr2ADdn9oOv5Tz0xLB947QEXlPlvm96a/k47SqHGS",
  phone: "07712345678"
}

export const fakeApplicationReady: Application = {
    application_id: 1,
    dog_id: 1,
    adopter_id: 1,
    status: 'submitted',
    readiness_checklist: true,
    submitted_at: '2026-01-01T00:00:00.000Z',
    decision_at: null,
    adopted_at: null
}


export const fakeApplicationNotReady: Application = {
    application_id: 2,
    dog_id: 4,
    adopter_id: 3,
    status: 'submitted',
    readiness_checklist: false,
    submitted_at: '2026-01-01T00:00:00.000Z',
    decision_at: null,
    adopted_at: null
}

export const fakeDogWrongShelter : Dog = {
  dog_id: 1,
  shelter_id: 10,
  name: "Buddy",
  breed: "Labrador Retriever",
  age: "3_5",
  gender: "male",
  size: "large",
  colour: ["black"],
  neutered: true,
  house_trained: true,
  vaccinated: true,
  good_with_dogs: "yes",
  good_with_cats: "unknown",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "2_4",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  medical_notes: null,
  behavioural_flags: [],
  behavioural_notes: null,
  known_triggers: [],
  trigger_notes: null,
  status: "available",
  description: "Friendly and energetic dog looking for a loving home.",
  intake_date: new Date().toISOString()
}

export const fakeDogSameShelter : Dog = {
  dog_id: 4,
  shelter_id: 5,
  name: "Chewie",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male",
  size: "small",
  colour: ["brown"],
  neutered: true,
  house_trained: true,
  vaccinated: true,
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  medical_notes: null,
  behavioural_flags: [],
  behavioural_notes: null,
  known_triggers: [],
  trigger_notes: null,
  status: "available",
  description: "Friendly and relaxed dog looking for a loving home.",
  intake_date: new Date().toISOString()
}

export const fakeDogUpdated : Dog = {
  dog_id: 4,
  shelter_id: 5,
  name: "Updated Name",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male",
  size: "small",
  colour: ["brown"],
  neutered: true,
  house_trained: true,
  vaccinated: true,
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  medical_notes: null,
  behavioural_flags: [],
  behavioural_notes: null,
  known_triggers: [],
  trigger_notes: null,
  status: "available",
  description: "Friendly and relaxed dog looking for a loving home.",
  intake_date: new Date().toISOString()
}

export const fakeDogforCreate = {
  name: "Chewie",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male",
  size: "small",
  colour: "brown",
  neutered: "true",
  house_trained: "true",
  vaccinated: "true",
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],          
  behavioural_flags: [],
  known_triggers: [],
  description: "Friendly and relaxed dog looking for a loving home."
}

export const fakeDogforCreateInvalid = {
  name: "Chewie",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male", //no size variable
  colour: "brown",
  neutered: "true",
  house_trained: "true",
  vaccinated: "true",
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],          
  behavioural_flags: [],
  known_triggers: [],
  description: "Friendly and relaxed dog looking for a loving home."
}

export const fakeDogforUpdate = {
  name: "Updated Name",
  breed: "Cavapoo",
  age: "8_plus",
  gender: "male",
  size: "small",
  colour: "brown",
  neutered: "on",
  house_trained: "on",
  vaccinated: "on",
  good_with_dogs: "yes",
  good_with_cats: "no",
  good_with_children: "yes",
  children_age: "any",
  alone_tolerance: "6_8",
  activity_level: "moderate",
  training_level: "basic",
  coat_length: "short",
  coat_type: "smooth",
  shedding_level: "medium",
  medical_issues: [],
  behavioural_flags: [],
  known_triggers: [],
  description: "Friendly and relaxed dog looking for a loving home."
}

export const fakeDogforUpdateInvalid = {
  ...fakeDogforUpdate,
  size: "huge" 
}

export const fakeFavourite: Favourite = {
    favourite_id: 1,
    adopter_id: 1,
    dog_id: 1,
    saved_at: '2026-06-01T10:00:00Z'
}

export const fakeFavourites: Favourite[] = [
    fakeFavourite,
    { favourite_id: 2, adopter_id: 1, dog_id: 2, saved_at: '2026-06-02T10:00:00Z' }
]

export const fakeApplicationSubmitted: Application = {
    application_id: 1,
    dog_id: 1,
    adopter_id: 1,
    status: 'submitted',
    readiness_checklist: true,
    submitted_at: '2026-06-01T10:00:00Z',
    decision_at: null,
    adopted_at: null
}

export const fakeApplicationUnderReview: Application = {
    ...fakeApplicationSubmitted,
    application_id: 2,
    status: 'under_review'
}

export const fakeApplicationApproved: Application = {
    ...fakeApplicationSubmitted,
    application_id: 3,
    status: 'approved'
}

export const fakeApplicationAdopted: Application = {
    ...fakeApplicationSubmitted,
    application_id: 4,
    status: 'adopted',
    adopted_at: '2026-06-15T10:00:00Z'
}

export const fakeApplicationWithdrawn: Application = {
    ...fakeApplicationSubmitted,
    application_id: 5,
    status: 'withdrawn'
}

export const fakeApplicationOtherAdopter: Application = {
    ...fakeApplicationSubmitted,
    application_id: 6,
    adopter_id: 2 // belongs to a different adopter than the test token
}

export const fakeApplicationWithdrawnUpdated: Application = {
    ...fakeApplicationSubmitted,
    status: 'withdrawn'
}

export const fakeAvailability: Availability = {
    availability_id: 1,
    shelter_id: 1,
    slot: '2026-08-15T10:00:00Z',
    booking_type: 'initial_meet',
    is_booked: false,
}

export const fakeAvailabilityPetIntroduction: Availability = {
    availability_id: 2,
    shelter_id: 1,
    slot: '2026-08-16T14:00:00Z',
    booking_type: 'pet_introduction',
    is_booked: false,
}

export const fakeAvailabilityBooked: Availability = {
    availability_id: 3,
    shelter_id: 1,
    slot: '2026-08-17T09:00:00Z',
    booking_type: 'home_check',
    is_booked: true,
}

export const fakeBooking: Booking = {
    booking_id: 1,
    application_id: 1,
    availability_id: 1,
    multi_pet_guidance: false,
    status: 'booked',
    created_at: '2026-07-01T12:00:00Z',
}

export const fakeBookingPetIntroduction: Booking = {
    booking_id: 2,
    application_id: 1,
    availability_id: 2,
    multi_pet_guidance: true,
    status: 'booked',
    created_at: '2026-07-01T12:00:00Z',
}