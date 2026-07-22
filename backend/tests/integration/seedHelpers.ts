import testPool from './testPool.js'

export async function seedBookingTestData() {
    const shelterResult = await testPool.query(
        `INSERT INTO shelters (name, city, postcode, email, phone)
         VALUES ('Test Shelter', 'Belfast', 'BT1 1AA', 'shelter@test.com', '02890000000')
         RETURNING shelter_id`
    )
    const shelterId = shelterResult.rows[0].shelter_id

    const dogResult = await testPool.query(
        `INSERT INTO dogs (shelter_id, name, breed, age, gender, size, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, description, photo_url)
        VALUES ($1, 'Buddy', 'Labrador', '3_5', 'male', 'large', '2_4', 'moderate', 'basic', 'short', 'smooth', 'medium', 'Friendly dog', 'https://example.com/buddy.jpg')
        RETURNING dog_id`,
        [shelterId]
    )
    const dogId = dogResult.rows[0].dog_id

    const adopter1Result = await testPool.query(
        `INSERT INTO adopters (first_name, last_name, email, password_hash, phone, postcode)
         VALUES ('Jane', 'Doe', 'jane@test.com', 'hash', '07700000001', 'BT1 1AA')
         RETURNING adopter_id`
    )
    const adopter1Id = adopter1Result.rows[0].adopter_id

    const adopter2Result = await testPool.query(
        `INSERT INTO adopters (first_name, last_name, email, password_hash, phone, postcode)
         VALUES ('John', 'Smith', 'john@test.com', 'hash', '07700000002', 'BT1 1AA')
         RETURNING adopter_id`
    )
    const adopter2Id = adopter2Result.rows[0].adopter_id

    const application1Result = await testPool.query(
        `INSERT INTO applications (dog_id, adopter_id, status, readiness_checklist)
         VALUES ($1, $2, 'submitted', true)
         RETURNING application_id`,
        [dogId, adopter1Id]
    )
    const application1Id = application1Result.rows[0].application_id

    const application2Result = await testPool.query(
        `INSERT INTO applications (dog_id, adopter_id, status, readiness_checklist)
         VALUES ($1, $2, 'submitted', true)
         RETURNING application_id`,
        [dogId, adopter2Id]
    )
    const application2Id = application2Result.rows[0].application_id

    const availabilityResult = await testPool.query(
        `INSERT INTO availability (shelter_id, slot, is_booked)
         VALUES ($1, '2026-08-15T10:00:00Z', false)
         RETURNING availability_id`,
        [shelterId]
    )
    const availabilityId = availabilityResult.rows[0].availability_id

    // NEW: a second, already-booked slot + its linked booking
    const bookedAvailabilityResult = await testPool.query(
        `INSERT INTO availability (shelter_id, slot, is_booked)
         VALUES ($1, '2026-08-16T14:00:00Z', true)
         RETURNING availability_id`,
        [shelterId]
    )
    const bookedAvailabilityId = bookedAvailabilityResult.rows[0].availability_id

    const bookingResult = await testPool.query(
        `INSERT INTO bookings (application_id, availability_id, booking_type, multi_pet_guidance, status)
         VALUES ($1, $2, 'initial_meet', false, 'booked')
         RETURNING booking_id`,
        [application1Id, bookedAvailabilityId]
    )
    const bookingId = bookingResult.rows[0].booking_id

    // NEW: a second shelter, to test cross-shelter scoping
    const otherShelterResult = await testPool.query(
        `INSERT INTO shelters (name, city, postcode, email, phone)
         VALUES ('Other Shelter', 'Lisburn', 'BT28 2BB', 'other@test.com', '02892000000')
         RETURNING shelter_id`
    )
    const otherShelterId = otherShelterResult.rows[0].shelter_id

    return { shelterId, otherShelterId, dogId, adopter1Id, adopter2Id, application1Id, application2Id, availabilityId, bookedAvailabilityId, bookingId }
}

export async function clearBookingTestData() {
    await testPool.query(
        `TRUNCATE bookings, availability, applications, adopters, dogs, shelters RESTART IDENTITY CASCADE`
    )
}

export async function seedMatchTestData() {
    const shelterResult = await testPool.query(
        `INSERT INTO shelters (name, city, postcode, email, phone)
         VALUES ('Test Shelter', 'Belfast', 'BT1 1AA', 'shelter@test.com', '02890000000')
         RETURNING shelter_id`
    )
    const shelterId = shelterResult.rows[0].shelter_id

    const dog1Result = await testPool.query(
        `INSERT INTO dogs (shelter_id, name, breed, age, gender, size, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, description, photo_url)
        VALUES ($1, 'Buddy', 'Labrador', '3_5', 'male', 'large', '2_4', 'moderate', 'basic', 'short', 'smooth', 'medium', 'Friendly dog', 'https://example.com/buddy.jpg')
        RETURNING dog_id`,
        [shelterId]
    )
    const dog1Id = dog1Result.rows[0].dog_id

    const dog2Result = await testPool.query(
        `INSERT INTO dogs (shelter_id, name, breed, age, gender, size, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, description, photo_url)
        VALUES ($1, 'Luna', 'Cavapoo', '0_2', 'female', 'small', '4_6', 'low', 'none', 'medium', 'curly', 'low', 'Calm dog', 'https://example.com/luna.jpg')
        RETURNING dog_id`,
        [shelterId]
    )
    const dog2Id = dog2Result.rows[0].dog_id

    const adopterResult = await testPool.query(
        `INSERT INTO adopters (first_name, last_name, email, password_hash, phone, postcode)
         VALUES ('Jane', 'Doe', 'jane@test.com', 'hash', '07700000001', 'BT1 1AA')
         RETURNING adopter_id`
    )
    const adopterId = adopterResult.rows[0].adopter_id

    const existingMatchResult = await testPool.query(
        `INSERT INTO matches (dog_id, adopter_id, overall_score, fuzzy_score, semantic_score, warnings, explanation)
         VALUES ($1, $2, 0.75, 0.8, 0.65, '[]'::jsonb, 'An existing match, seeded for cache/invalidation/upsert tests')
         RETURNING match_id`,
        [dog1Id, adopterId]
    )
    const existingMatchId = existingMatchResult.rows[0].match_id

    return { shelterId, dog1Id, dog2Id, adopterId, existingMatchId }
}

export async function clearMatchTestData() {
    await testPool.query(
        `TRUNCATE matches, adopters, dogs, shelters RESTART IDENTITY CASCADE`
    )
}