import 'dotenv/config'
import bcrypt from 'bcrypt'
import pool from '../config/db.js'

const seed = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // ============================================================
    // Clear existing data (order matters due to foreign keys)
    // ============================================================
    await client.query(`
      TRUNCATE TABLE
        supportmaterials, bookings, availability, applications,
        checkins, favourites, matches, dogs,
        shelter_admins, shelters, adopters
      RESTART IDENTITY CASCADE
    `)

    // ============================================================
    // Shelters
    // ============================================================
    const shelter1 = await client.query(`
      INSERT INTO shelters (name, city, postcode, email, phone)
      VALUES ('Paws & Hearts Rescue', 'Belfast', 'BT1 1AA', 'info@pawsandhearts.co.uk', '02890111222')
      RETURNING shelter_id
    `)

    const shelter2 = await client.query(`
      INSERT INTO shelters (name, city, postcode, email, phone)
      VALUES ('Second Chance Animal Shelter', 'Lisburn', 'BT28 2BB', 'hello@secondchance.co.uk', '02892333444')
      RETURNING shelter_id
    `)

    const shelterId1 = shelter1.rows[0].shelter_id
    const shelterId2 = shelter2.rows[0].shelter_id

    // ============================================================
    // Shelter Admins
    // ============================================================
    const adminPassword = await bcrypt.hash('Admin1234!', 10)

    await client.query(`
      INSERT INTO shelter_admins (shelter_id, email, password_hash, name)
      VALUES ($1, $2, $3, $4)
    `, [shelterId1, 'admin@pawsandhearts.co.uk', adminPassword, 'Sarah Mitchell'])

    await client.query(`
      INSERT INTO shelter_admins (shelter_id, email, password_hash, name)
      VALUES ($1, $2, $3, $4)
    `, [shelterId2, 'admin@secondchance.co.uk', adminPassword, 'James O\'Brien'])

    // ============================================================
    // Dogs — Shelter 1 (Paws & Hearts)
    // ============================================================
    await client.query(`
      INSERT INTO dogs (
        shelter_id, name, breed, age, gender, size, colour,
        neutered, house_trained, vaccinated,
        good_with_dogs, good_with_cats, good_with_children, children_age,
        alone_tolerance, activity_level, training_level,
        coat_length, coat_type, shedding_level,
        behavioural_flags, known_triggers,
        status, description, photo_url
      ) VALUES (
        $1, 'Biscuit', 'Golden Retriever', '3_5', 'male', 'large', '["golden"]',
        true, true, true,
        'yes', 'unknown', 'yes', 'any',
        '4_6', 'moderate', 'basic',
        'long', 'double', 'high',
        '["Pulls on lead"]', '[]',
        'available',
        'Biscuit is a gentle and affectionate golden retriever who loves nothing more than a long walk followed by a cuddle on the sofa. He gets on well with children of all ages and is learning to walk nicely on the lead. He would thrive in an active family home with a garden.',
        'https://images.unsplash.com/photo-1626736637845-53045bb9695b?q=80&w=711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400'
      )
    `, [shelterId1])

    await client.query(`
      INSERT INTO dogs (
        shelter_id, name, breed, age, gender, size, colour,
        neutered, house_trained, vaccinated,
        good_with_dogs, good_with_cats, good_with_children, children_age,
        alone_tolerance, activity_level, training_level,
        coat_length, coat_type, shedding_level,
        behavioural_flags, known_triggers,
        status, description, photo_url
      ) VALUES (
        $1, 'Luna', 'Border Collie', '0_2', 'female', 'medium', '["black", "white"]',
        true, true, true,
        'yes', 'no', 'yes', '5_12',
        '2_4', 'very_high', 'moderate',
        'medium', 'double', 'medium',
        '["Pulls on lead", "Jumps at people"]', '["Cats"]',
        'available',
        'Luna is a bright and energetic young border collie who needs a lot of mental and physical stimulation. She is not suitable for homes with cats but loves the company of other dogs. She would be best suited to an experienced owner who can channel her intelligence and energy through training and activities.',
        'https://images.unsplash.com/photo-1654256578072-b932c33cb92e?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400'
      )
    `, [shelterId1])

    await client.query(`
      INSERT INTO dogs (
        shelter_id, name, breed, age, gender, size, colour,
        neutered, house_trained, vaccinated,
        good_with_dogs, good_with_cats, good_with_children, children_age,
        alone_tolerance, activity_level, training_level,
        coat_length, coat_type, shedding_level,
        behavioural_flags, known_triggers,
        status, description, photo_url
      ) VALUES (
        $1, 'Archie', 'Staffordshire Bull Terrier', '3_5', 'male', 'medium', '["brown"]',
        true, true, true,
        'no', 'no', 'yes', '13_plus',
        '4_6', 'moderate', 'moderate',
        'short', 'smooth', 'low',
        '["Reactive to dogs", "Resource guarding"]', '["Other dogs"]',
        'available',
        'Archie is a loving and loyal staffy who bonds deeply with his people. He needs to be the only pet in the home as he does not get on with other dogs or cats. He is fine with older teenagers and would suit a calm, experienced owner who can give him the one-on-one attention he deserves.',
        'https://images.unsplash.com/photo-1700064777749-0ac818716100?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400'
      )
    `, [shelterId1])

    // ============================================================
    // Dogs — Shelter 2 (Second Chance)
    // ============================================================
    await client.query(`
      INSERT INTO dogs (
        shelter_id, name, breed, age, gender, size, colour,
        neutered, house_trained, vaccinated,
        good_with_dogs, good_with_cats, good_with_children, children_age,
        alone_tolerance, activity_level, training_level,
        coat_length, coat_type, shedding_level,
        behavioural_flags, known_triggers,
        status, description, photo_url
      ) VALUES (
        $1, 'Pepper', 'Cockapoo', '0_2', 'female', 'small', '["brown"]',
        true, true, true,
        'yes', 'yes', 'yes', 'any',
        '2_4', 'medium', 'basic',
        'medium', 'curly', 'low',
        '[]', '[]',
        'available',
        'Pepper is a sweet and sociable cockapoo who gets along with everyone she meets — children, dogs, and cats alike. She is low shedding, which makes her a great choice for those with mild allergies. She enjoys playtime but is equally happy relaxing at home, making her a very adaptable companion.',
        'https://images.unsplash.com/photo-1724930438762-91cb791e0d13?q=80&w=766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400'
      )
    `, [shelterId2])

    await client.query(`
      INSERT INTO dogs (
        shelter_id, name, breed, age, gender, size, colour,
        neutered, house_trained, vaccinated,
        good_with_dogs, good_with_cats, good_with_children, children_age,
        alone_tolerance, activity_level, training_level,
        coat_length, coat_type, shedding_level,
        behavioural_flags, known_triggers,
        status, description, photo_url
      ) VALUES (
        $1, 'Rex', 'German Shepherd', '6_8', 'male', 'large', '["black", "brown"]',
        true, true, true,
        'unknown', 'no', 'yes', '13_plus',
        '6_8', 'high', 'experienced_only',
        'medium', 'double', 'high',
        '["Excessive barking", "Separation anxiety"]', '["Loud noises", "Strangers"]',
        'available',
        'Rex is a dignified and intelligent older shepherd who has had a difficult past. He is nervous around strangers and loud environments, and needs a patient, experienced owner who understands the breed. He has shown no aggression and with the right home and routine he has a lot of love to give. His compatibility with other dogs is currently being assessed.',
        'https://images.unsplash.com/photo-1621951714307-0f9b8070a9b0?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400'
      )
    `, [shelterId2])

    await client.query(`
      INSERT INTO dogs (
        shelter_id, name, breed, age, gender, size, colour,
        neutered, house_trained, vaccinated,
        good_with_dogs, good_with_cats, good_with_children, children_age,
        alone_tolerance, activity_level, training_level,
        coat_length, coat_type, shedding_level,
        behavioural_flags, known_triggers,
        status, description, photo_url
      ) VALUES (
        $1, 'Daisy', 'Cavalier King Charles Spaniel', '8_plus', 'female', 'small', '["white", "brown"]',
        true, true, true,
        'yes', 'yes', 'yes', 'any',
        '8_plus', 'low', 'none',
        'long', 'silky', 'medium',
        '[]', '[]',
        'available',
        'Daisy is a gentle senior spaniel looking for a quiet home to spend her golden years. She is calm, affectionate, and wonderfully easy to live with. She gets along with everyone and asks for very little — just warmth, comfort, and company. She would suit a retired owner or anyone looking for a relaxed and loving companion.',
        'https://images.unsplash.com/photo-1626571565169-9c853e9a7361?q=80&w=1604&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400'
      )
    `, [shelterId2])

    // ============================================================
    // Adopters
    // ============================================================
    const adopterPassword = await bcrypt.hash('Adopter1234!', 10)

    const adopter1 = await client.query(`
      INSERT INTO adopters (
        first_name, last_name, email, password_hash, phone, postcode,
        home_type, home_location, outdoor_space,
        current_pets, current_pet_type, current_pet_count,
        children, youngest_child_age,
        hours_alone, activity_level,
        first_time_owner, multi_pet_exp, multi_pet_exp_level,
        age_pref, gender_pref, size_pref, shedding_pref, training_commitment,
        pref_notes, completed_at
      ) VALUES (
        'John', 'Doe', 'john.doe@example.com', $1, '07700900001', 'BT2 3CD',
        'semi-detached', 'suburban', 'medium',
        true, '["dog"]', 1,
        false, NULL,
        '2_4', 'moderate',
        false, true, 'extensive',
        '["none"]', 'none', '["none"]', 'none', 'moderate',
        'I go hiking most weekends and have a large garden, I currently have a friendly older dog at home',
        now()
      ) RETURNING adopter_id
    `, [adopterPassword])

    const adopter2 = await client.query(`
      INSERT INTO adopters (
        first_name, last_name, email, password_hash, phone, postcode,
        home_type, home_location, outdoor_space,
        current_pets, current_pet_type, current_pet_count,
        children, youngest_child_age,
        hours_alone, activity_level,
        first_time_owner, multi_pet_exp, multi_pet_exp_level,
        age_pref, gender_pref, size_pref, shedding_pref, training_commitment,
        pref_notes, completed_at
      ) VALUES (
        'Robert', 'Jones', 'robert.jones@example.com', $1, '07700900002', 'BT9 5EF',
        'detached', 'rural', 'large',
        false, '[]', NULL,
        true, '5_12',
        '4_6', 'medium',
        true, false, NULL,
        '["none"]', 'none', '["none"]', 'none', 'intensive',
        'First time owner, keen to do things right and willing to commit to training',
        now()
      ) RETURNING adopter_id
    `, [adopterPassword])

    const adopter3 = await client.query(`
      INSERT INTO adopters (
        first_name, last_name, email, password_hash, phone, postcode,
        home_type, home_location, outdoor_space,
        current_pets, current_pet_type, current_pet_count,
        children, youngest_child_age,
        hours_alone, activity_level,
        first_time_owner, multi_pet_exp, multi_pet_exp_level,
        age_pref, gender_pref, size_pref, shedding_pref, training_commitment,
        pref_notes, completed_at
      ) VALUES (
        'Jessica', 'Smith', 'jessica.smith@example.com', $1, '07700900003', 'BT4 1GH',
        'apartment', 'urban', 'none',
        true, '["cat"]', 1,
        false, NULL,
        '0_2', 'low',
        false, false, NULL,
        '["none"]', 'none', '["small"]', 'low', 'basic',
        'Looking for a calm companion to relax with in the evenings',
        now()
      ) RETURNING adopter_id
    `, [adopterPassword])

    const adopterId1 = adopter1.rows[0].adopter_id
    const adopterId2 = adopter2.rows[0].adopter_id
    const adopterId3 = adopter3.rows[0].adopter_id

    // Get dog IDs for reference (Biscuit and Luna belong to shelter 1)
    const dogsResult = await client.query(`SELECT dog_id, name FROM dogs WHERE shelter_id = $1 ORDER BY dog_id`, [shelterId1])
    const dogIdBiscuit = dogsResult.rows[0].dog_id
    const dogIdLuna = dogsResult.rows[1].dog_id

    // ============================================================
    // Applications
    // ============================================================
    // John Doe → Biscuit, submitted, checklist done
    const app1 = await client.query(`
      INSERT INTO applications (dog_id, adopter_id, status, readiness_checklist, submitted_at)
      VALUES ($1, $2, 'submitted', true, '2026-06-04')
      RETURNING application_id
    `, [dogIdBiscuit, adopterId1])

    // Robert Jones → Luna, under review, checklist not done
    const app2 = await client.query(`
      INSERT INTO applications (dog_id, adopter_id, status, readiness_checklist, submitted_at)
      VALUES ($1, $2, 'under_review', false, '2026-05-20')
      RETURNING application_id
    `, [dogIdLuna, adopterId2])

    // Jessica Smith → Biscuit, under review, checklist done
    const app3 = await client.query(`
      INSERT INTO applications (dog_id, adopter_id, status, readiness_checklist, submitted_at)
      VALUES ($1, $2, 'under_review', true, '2026-05-10')
      RETURNING application_id
    `, [dogIdBiscuit, adopterId3])

    const applicationId1 = app1.rows[0].application_id
    const applicationId2 = app2.rows[0].application_id
    const applicationId3 = app3.rows[0].application_id

    // ============================================================
    // Availability — Shelter 1
    // ============================================================
    const avail1 = await client.query(`
      INSERT INTO availability (shelter_id, slot, is_booked)
      VALUES ($1, '2026-07-15 10:00', true)
      RETURNING availability_id
    `, [shelterId1])

    const avail2 = await client.query(`
      INSERT INTO availability (shelter_id, slot, is_booked)
      VALUES ($1, '2026-07-10 14:00', true)
      RETURNING availability_id
    `, [shelterId1])

    const avail3 = await client.query(`
      INSERT INTO availability (shelter_id, slot, is_booked)
      VALUES ($1, '2026-07-10 11:00', false)
      RETURNING availability_id
    `, [shelterId1])

    const avail4 = await client.query(`
      INSERT INTO availability (shelter_id, slot, is_booked)
      VALUES ($1, '2026-07-15 15:00', true)
      RETURNING availability_id
    `, [shelterId1])

    const availabilityId1 = avail1.rows[0].availability_id
    const availabilityId2 = avail2.rows[0].availability_id
    const availabilityId4 = avail4.rows[0].availability_id

    // ============================================================
    // Bookings
    // ============================================================
    // App2 (Robert Jones/Luna): kennel meet + home visit completed, pet intro not yet booked
    await client.query(`
      INSERT INTO bookings (application_id, availability_id, booking_type, multi_pet_guidance, status)
      VALUES ($1, $2, 'initial_meet', false, 'completed')
    `, [applicationId2, availabilityId1])

    await client.query(`
      INSERT INTO bookings (application_id, availability_id, booking_type, multi_pet_guidance, status)
      VALUES ($1, $2, 'home_check', false, 'completed')
    `, [applicationId2, availabilityId2])

    // App1 (John Doe/Biscuit): upcoming pet introduction, still booked
    await client.query(`
      INSERT INTO bookings (application_id, availability_id, booking_type, multi_pet_guidance, status)
      VALUES ($1, $2, 'pet_introduction', true, 'booked')
    `, [applicationId1, availabilityId4])

    await client.query('COMMIT')

    const shelterCount = await pool.query('SELECT COUNT(*) FROM shelters')
    const adminCount = await pool.query('SELECT COUNT(*) FROM shelter_admins')
    const dogCount = await pool.query('SELECT COUNT(*) FROM dogs')
    const adopterCount = await pool.query('SELECT COUNT(*) FROM adopters')
    const applicationCount = await pool.query('SELECT COUNT(*) FROM applications')
    const availabilityCount = await pool.query('SELECT COUNT(*) FROM availability')
    const bookingCount = await pool.query('SELECT COUNT(*) FROM bookings')

    console.log('✓ Seed complete')
    console.log(`  Shelters:     ${shelterCount.rows[0].count}`)
    console.log(`  Admins:       ${adminCount.rows[0].count}  (password: Admin1234!)`)
    console.log(`  Dogs:         ${dogCount.rows[0].count}`)
    console.log(`  Adopters:     ${adopterCount.rows[0].count}  (password: Adopter1234!)`)
    console.log(`  Applications: ${applicationCount.rows[0].count}`)
    console.log(`  Availability: ${availabilityCount.rows[0].count}`)
    console.log(`  Bookings:     ${bookingCount.rows[0].count}`)

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Seed failed, rolled back:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()