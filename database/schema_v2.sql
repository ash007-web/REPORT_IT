-- Add authentication and role-based access control (RBAC) to users table

ALTER TABLE users
ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT 'unhashed_default',
ADD COLUMN role VARCHAR(10) NOT NULL DEFAULT 'student'
CHECK (role IN ('student', 'admin'));
