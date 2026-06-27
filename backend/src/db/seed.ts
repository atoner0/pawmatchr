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
        status, description
      ) VALUES (
        $1, 'Biscuit', 'Golden Retriever', '3_5', 'male', 'large', '["golden"]',
        true, true, true,
        'yes', 'unknown', 'yes', 'any',
        '4_6', 'moderate', 'basic',
        'long', 'double', 'high',
        '["pulls_on_lead"]', '[]',
        'available',
        'Biscuit is a gentle and affectionate golden retriever who loves nothing more than a long walk followed by a cuddle on the sofa. He gets on well with children of all ages and is learning to walk nicely on the lead. He would thrive in an active family home with a garden.'
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
        status, description
      ) VALUES (
        $1, 'Luna', 'Border Collie', '0_2', 'female', 'medium', '["black", "white"]',
        true, true, true,
        'yes', 'no', 'yes', '5_12',
        '2_4', 'very_high', 'moderate',
        'medium', 'double', 'medium',
        '["pulls_on_lead", "jumps_at_people"]', '["cats"]',
        'available',
        'Luna is a bright and energetic young border collie who needs a lot of mental and physical stimulation. She is not suitable for homes with cats but loves the company of other dogs. She would be best suited to an experienced owner who can channel her intelligence and energy through training and activities.'
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
        status, description
      ) VALUES (
        $1, 'Archie', 'Staffordshire Bull Terrier', '3_5', 'male', 'medium', '["brindle"]',
        true, true, true,
        'no', 'no', 'yes', '13_plus',
        '4_6', 'moderate', 'moderate',
        'short', 'smooth', 'low',
        '["reactive_to_dogs", "resource_guarding"]', '["other_dogs"]',
        'available',
        'Archie is a loving and loyal staffy who bonds deeply with his people. He needs to be the only pet in the home as he does not get on with other dogs or cats. He is fine with older teenagers and would suit a calm, experienced owner who can give him the one-on-one attention he deserves.'
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
        status, description
      ) VALUES (
        $1, 'Pepper', 'Cockapoo', '0_2', 'female', 'small', '["brown"]',
        true, true, true,
        'yes', 'yes', 'yes', 'any',
        '2_4', 'medium', 'basic',
        'medium', 'curly', 'low',
        '[]', '[]',
        'available',
        'Pepper is a sweet and sociable cockapoo who gets along with everyone she meets — children, dogs, and cats alike. She is low shedding, which makes her a great choice for those with mild allergies. She enjoys playtime but is equally happy relaxing at home, making her a very adaptable companion.'
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
        status, description
      ) VALUES (
        $1, 'Rex', 'German Shepherd', '6_8', 'male', 'large', '["black", "brown"]',
        true, true, true,
        'unknown', 'no', 'yes', '13_plus',
        '6_8', 'high', 'experienced_only',
        'medium', 'double', 'high',
        '["excessive_barking", "separation_anxiety"]', '["loud_noises", "strangers"]',
        'available',
        'Rex is a dignified and intelligent older shepherd who has had a difficult past. He is nervous around strangers and loud environments, and needs a patient, experienced owner who understands the breed. He has shown no aggression and with the right home and routine he has a lot of love to give. His compatibility with other dogs is currently being assessed.'
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
        status, description
      ) VALUES (
        $1, 'Daisy', 'Cavalier King Charles Spaniel', '8_plus', 'female', 'small', '["white", "brown"]',
        true, true, true,
        'yes', 'yes', 'yes', 'any',
        '8_plus', 'low', 'none',
        'long', 'silky', 'medium',
        '[]', '[]',
        'available',
        'Daisy is a gentle senior spaniel looking for a quiet home to spend her golden years. She is calm, affectionate, and wonderfully easy to live with. She gets along with everyone and asks for very little — just warmth, comfort, and company. She would suit a retired owner or anyone looking for a relaxed and loving companion.'
      )
    `, [shelterId2])

    await client.query('COMMIT')

    const shelterCount = await pool.query('SELECT COUNT(*) FROM shelters')
    const adminCount = await pool.query('SELECT COUNT(*) FROM shelter_admins')
    const dogCount = await pool.query('SELECT COUNT(*) FROM dogs')

    console.log('✓ Seed complete')
    console.log(`  Shelters: ${shelterCount.rows[0].count}`)
    console.log(`  Admins:   ${adminCount.rows[0].count}  (password: Admin1234!)`)
    console.log(`  Dogs:     ${dogCount.rows[0].count}`)

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