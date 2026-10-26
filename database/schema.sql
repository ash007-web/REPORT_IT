-- Campus Lost & Found
-- PostgreSQL schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    item_date DATE NOT NULL,

    type VARCHAR(10) NOT NULL
        CHECK (type IN ('lost', 'found')),

    status VARCHAR(10) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'resolved')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,

    CONSTRAINT fk_items_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Fast filtering by Lost / Found
CREATE INDEX idx_items_type
ON items(type);

-- Fast filtering by Active / Resolved
CREATE INDEX idx_items_status
ON items(status);

-- Fast lookup of items belonging to a student
CREATE INDEX idx_items_user_id
ON items(user_id);

-- Useful for chronological campus feeds
CREATE INDEX idx_items_created_at
ON items(created_at DESC);

-- Composite index for the most common feed query
CREATE INDEX idx_items_status_type
ON items(status, type);


-- Sample users
INSERT INTO users (student_id, name)
VALUES
    ('AJCE001', 'Adarsh'),
    ('AJCE002', 'Ananya'),
    ('AJCE003', 'Rahul');


-- Sample items
INSERT INTO items
    (user_id, title, description, location, item_date, type)
VALUES
    (
        1,
        'Black Water Bottle',
        'Matte black bottle with a small white sticker.',
        'Main Block - Ground Floor',
        CURRENT_DATE,
        'lost'
    ),
    (
        2,
        'Scientific Calculator',
        'Casio calculator found near the library entrance.',
        'Central Library',
        CURRENT_DATE,
        'found'
    ),
    (
        3,
        'Blue USB Drive',
        'Small 32GB USB drive found beside a classroom desk.',
        'Computer Lab 2',
        CURRENT_DATE - INTERVAL '1 day',
        'found'
    );
