CREATE TABLE adopters (
    adopter_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    email               TEXT UNIQUE NOT NULL,
    password_hash       TEXT NOT NULL,
    phone               TEXT NOT NULL,
    postcode            TEXT NOT NULL,
    home_type           TEXT
                        CHECK (home_type IN ('apartment', 'semi-detached', 'detached')),
    home_location       TEXT
                        CHECK (home_location IN ('urban', 'suburban', 'rural')),
    outdoor_space       TEXT
                        CHECK (outdoor_space IN ('large', 'medium', 'small', 'none')),
    current_pets        BOOLEAN,
    current_pet_type    JSONB DEFAULT '[]'::jsonb,
    current_pet_count   INTEGER
                        CHECK (current_pet_count IN (1, 2, 3, 4)),
    children            BOOLEAN,
    youngest_child_age  TEXT
                        CHECK (youngest_child_age IN ('under_5', '5_12', '13_plus')),
    hours_alone         TEXT
                        CHECK (hours_alone IN ('0_2', '2_4', '4_6', '6_8', '8_plus')),
    activity_level      TEXT
                        CHECK (activity_level IN ('low', 'medium', 'moderate', 'high', 'very_high')),
    first_time_owner    BOOLEAN,
    multi_pet_exp       BOOLEAN,
    multi_pet_exp_level TEXT
                        CHECK (multi_pet_exp_level IN ('once_twice', 'several', 'extensive')),
    age_pref            JSONB DEFAULT '[]'::jsonb,
    gender_pref         TEXT
                        CHECK (gender_pref IN ('male', 'female', 'none')),
    size_pref           JSONB DEFAULT '[]'::jsonb,
    shedding_pref       TEXT
                        CHECK (shedding_pref IN ('none', 'low', 'medium', 'high')),
    training_commitment TEXT
                        CHECK (training_commitment IN ('none', 'basic', 'moderate', 'intensive')),
    pref_notes          TEXT,
    completed_at        TIMESTAMPTZ 
);

CREATE TABLE shelters (
    shelter_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                TEXT NOT NULL,
    city                TEXT NOT NULL,
    postcode            TEXT NOT NULL,
    email               TEXT UNIQUE NOT NULL,
    phone               TEXT NOT NULL
);

CREATE TABLE shelter_admins (
    staff_id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shelter_id          INTEGER NOT NULL REFERENCES shelters(shelter_id),
    email               TEXT UNIQUE NOT NULL,
    password_hash       TEXT NOT NULL,
    name                TEXT NOT NULL         
);

CREATE TABLE dogs (
    dog_id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shelter_id          INTEGER NOT NULL REFERENCES shelters(shelter_id),
    photo_url           VARCHAR(255) NOT NULL,
    name                TEXT NOT NULL,
    breed               TEXT NOT NULL,
    age                 TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (age IN ('0_2', '3_5', '6_8', '8_plus')),
    gender              TEXT NOT NULL
                        CHECK (gender IN ('male', 'female')),
    size                TEXT NOT NULL
                        CHECK (size IN ('small', 'medium', 'large', 'giant')),
    colour              JSONB DEFAULT '[]'::jsonb,
    neutered            BOOLEAN,
    house_trained       BOOLEAN,
    vaccinated          BOOLEAN,
    good_with_dogs      TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (good_with_dogs IN ('yes', 'no', 'unknown')),
    good_with_cats      TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (good_with_cats IN ('yes', 'no', 'unknown')),
    good_with_children  TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (good_with_children IN ('yes', 'no', 'unknown')),
    children_age        TEXT
                        CHECK (children_age IN ('any', '5_12', '13_plus', 'unknown')),
    alone_tolerance     TEXT NOT NULL
                        CHECK (alone_tolerance IN ('0_2', '2_4', '4_6', '6_8', '8_plus')),
    activity_level      TEXT NOT NULL
                        CHECK (activity_level IN ('low', 'medium', 'moderate', 'high', 'very_high')),
    training_level      TEXT NOT NULL
                        CHECK (training_level IN ('none', 'basic', 'moderate', 'experienced_only')),
    coat_length         TEXT NOT NULL
                        CHECK (coat_length IN ('short', 'medium', 'long')),
    coat_type           TEXT NOT NULL  
                        CHECK (coat_type IN ('double', 'single', 'curly', 'silky', 'rough', 'wire', 'smooth', 'hairless')),
    shedding_level      TEXT NOT NULL
                        CHECK (shedding_level IN ('none', 'low', 'medium', 'high')),
    medical_issues      JSONB DEFAULT '[]'::jsonb,
    medical_notes       TEXT,
    behavioural_flags   JSONB DEFAULT '[]'::jsonb,
    behavioural_notes   TEXT,
    known_triggers      JSONB DEFAULT '[]'::jsonb,
    trigger_notes       TEXT,
    status              TEXT NOT NULL DEFAULT 'available'
                        CHECK (status IN ('available', 'pending', 'adopted')),
    description         TEXT NOT NULL,
    intake_date         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE matches (
    match_id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dog_id              INTEGER NOT NULL REFERENCES dogs(dog_id) ON DELETE CASCADE,
    adopter_id          INTEGER NOT NULL REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    overall_score       NUMERIC(5, 4) NOT NULL,
    fuzzy_score         NUMERIC(5, 4) NOT NULL,
    semantic_score      NUMERIC(5, 4) NOT NULL,
    explanation         TEXT NOT NULL,
    generated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE favourites (
    favourite_id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dog_id              INTEGER NOT NULL REFERENCES dogs(dog_id) ON DELETE CASCADE,
    adopter_id          INTEGER NOT NULL REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    saved_at            TIMESTAMPTZ DEFAULT now(),
    UNIQUE (adopter_id, dog_id)
);

CREATE TABLE checkins (
    checkin_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dog_id              INTEGER NOT NULL REFERENCES dogs(dog_id) ON DELETE CASCADE,
    adopter_id          INTEGER NOT NULL REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    milestone           TEXT NOT NULL
                        CHECK (milestone IN ('week_1', 'month_1', 'month_3', 'month_6', 'month_9', 'year')),
    notes               TEXT,
    wellbeing_rating    INTEGER
                        CHECK (wellbeing_rating BETWEEN 1 AND 5),
    completed_at        TIMESTAMPTZ
);

CREATE TABLE applications(
    application_id      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dog_id              INTEGER NOT NULL REFERENCES dogs(dog_id) ON DELETE CASCADE,
    adopter_id          INTEGER NOT NULL REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    status              TEXT NOT NULL DEFAULT 'submitted'
                        CHECK (status IN ('submitted', 'under_review', 'approved', 'adopted', 'rejected', 'withdrawn')),
    readiness_checklist BOOLEAN NOT NULL DEFAULT false,
    submitted_at        TIMESTAMPTZ,
    decision_at         TIMESTAMPTZ,
    adopted_at          TIMESTAMPTZ
);

CREATE TABLE availability(
    availability_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shelter_id          INTEGER NOT NULL REFERENCES shelters(shelter_id) ON DELETE CASCADE,
    slot                TIMESTAMPTZ NOT NULL,
    is_booked           BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE bookings(
    booking_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id      INTEGER NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    availability_id     INTEGER NOT NULL REFERENCES availability(availability_id) ON DELETE CASCADE,
    multi_pet_guidance  BOOLEAN NOT NULL DEFAULT false,
    status              TEXT NOT NULL DEFAULT 'booked'
                        CHECK (status IN ('booked', 'completed', 'cancelled')),
    booking_type        TEXT NOT NULL
                        CHECK (booking_type IN ('initial_meet', 'home_check', 'pet_introduction')),
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE supportmaterials(
    support_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title               TEXT NOT NULL,
    content             TEXT NOT NULL,
    stage               TEXT NOT NULL
                        CHECK (stage IN ('week_1', 'month_1', 'month_3', 'general')),
    issue_type          TEXT NOT NULL
                        CHECK (issue_type IN (
                            'lead_pulling',
                            'jumping_up',
                            'recall',
                            'separation_anxiety',
                            'reactivity',
                            'destructive_behaviour',
                            'general'
                        )),
    created_at          TIMESTAMPTZ DEFAULT now()
);