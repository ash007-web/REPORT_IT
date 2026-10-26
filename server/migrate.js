import pool from './config/db.js';

async function updateDb() {
  try {
    // Add role column if not exists
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'student'
    `);
    
    // Check if admin user exists in DB, if not insert
    const adminCheck = await pool.query(`SELECT * FROM users WHERE role = 'admin' OR student_id = 'ADMIN01'`);
    if (adminCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (student_id, name, role)
        VALUES ('ADMIN01', 'System Admin', 'admin')
      `);
      console.log('Inserted default admin user ADMIN01');
    } else {
      await pool.query(`UPDATE users SET role = 'admin' WHERE student_id = 'ADMIN01'`);
      console.log('Updated existing admin user');
    }

    const allUsers = await pool.query('SELECT id, student_id, name, role, created_at FROM users');
    console.log('All Users in DB:', allUsers.rows);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

updateDb();
