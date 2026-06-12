CREATE TABLE adopters (
    adopter_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name          TEXT NOT NULL,
    last_name           TEXT NOT NULL,
    email               TEXT UNIQUE NOT NULL,
    password_hash       TEXT NOT NULL,
    phone               TEXT NOT NULL,
    postcode            TEXT,
    home_type           TEXT,
    outdoor_space       TEXT,
    current_pets        BOOLEAN,
    current_pet_type    JSONB DEFAULT '[]'::jsonb,
    children            BOOLEAN,
    youngest_child_age  INTEGER,
    hours_alone         INTEGER,
    activity_level      TEXT,
    first_time_owner    BOOLEAN,
    multi_pet_exp       TEXT,
    size_pref           TEXT,
    shedding_pref       TEXT,
    training_commitment TEXT,
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
    name                TEXT NOT NULL,
    breed               TEXT NOT NULL,
    age                 INTEGER NOT NULL,
    gender              TEXT NOT NULL
                        CHECK (gender IN ('male', 'female')),
    size                TEXT NOT NULL
                        CHECK (size IN ('small', 'medium', 'large', 'extra-large')),
    colour              TEXT NOT NULL,
    neutered            TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (neutered IN ('yes', 'no', 'unknown')),
    house_trained       TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (house_trained IN ('yes', 'no', 'unknown')),
    vaccinated          TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (vaccinated IN ('yes', 'no', 'unknown')),
    good_with_dogs      TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (good_with_dogs IN ('yes', 'no', 'unknown')),
    good_with_cats      TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (good_with_cats IN ('yes', 'no', 'unknown')),
    good_with_children  TEXT NOT NULL DEFAULT 'unknown'
                        CHECK (good_with_children IN ('yes', 'no', 'unknown')),
    coat_length         TEXT NOT NULL
                        CHECK (coat_length IN ('short', 'medium', 'long')),
    shedding_level      TEXT NOT NULL
                        CHECK (shedding_level IN ('low', 'medium', 'high')),
    medical_issues      JSONB DEFAULT '[]'::jsonb,
    behavioural_flags   JSONB DEFAULT '[]'::jsonb,
    known_triggers      JSONB DEFAULT '[]'::jsonb,
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
    status              TEXT NOT NULL DEFAULT 'incomplete'
                        CHECK (status IN ('incomplete', 'submitted', 'reviewing', 'complete', 'rejected')),
    readiness_checklist BOOLEAN NOT NULL DEFAULT false,
    submitted_at        TIMESTAMPTZ,
    decision_at         TIMESTAMPTZ
);

CREATE TABLE availability(
    availability_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shelter_id          INTEGER NOT NULL REFERENCES shelters(shelter_id) ON DELETE CASCADE,
    slot                TIMESTAMPTZ NOT NULL,
    booking_type        TEXT NOT NULL
                        CHECK (booking_type IN ('initial_meet', 'home_check', 'pet_introduction')),
    is_booked           BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE bookings(
    booking_id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id      INTEGER NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
    availability_id     INTEGER NOT NULL REFERENCES availability(availability_id) ON DELETE CASCADE,
    multi_pet_guidance  BOOLEAN NOT NULL DEFAULT false,
    status              TEXT NOT NULL DEFAULT 'booked'
                        CHECK (status IN ('booked', 'completed', 'cancelled')),
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