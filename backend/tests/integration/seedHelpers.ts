import testPool from './testPool.js'

export async function seedBookingTestData() {
    const shelterResult = await testPool.query(
        `INSERT INTO shelters (name, city, postcode, email, phone)
         VALUES ('Test Shelter', 'Belfast', 'BT1 1AA', 'shelter@test.com', '02890000000')
         RETURNING shelter_id`
    )
    const shelterId = shelterResult.rows[0].shelter_id

    const dogResult = await testPool.query(
        `INSERT INTO dogs (shelter_id, name, breed, age, gender, size, alone_tolerance, activity_level, training_level, coat_length, coat_type, shedding_level, description)
         VALUES ($1, 'Buddy', 'Labrador', '3_5', 'male', 'large', '2_4', 'moderate', 'basic', 'short', 'smooth', 'medium', 'Friendly dog')
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
        `INSERT INTO availability (shelter_id, slot, booking_type, is_booked)
         VALUES ($1, '2026-08-15T10:00:00Z', 'initial_meet', false)
         RETURNING availability_id`,
        [shelterId]
    )
    const availabilityId = availabilityResult.rows[0].availability_id

    return { shelterId, dogId, adopter1Id, adopter2Id, application1Id, application2Id, availabilityId }
}

export async function clearBookingTestData() {
    await testPool.query(
        `TRUNCATE bookings, availability, applications, adopters, dogs, shelters RESTART IDENTITY CASCADE`
    )
}