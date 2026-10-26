import pool from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = `
      SELECT id, student_id, name, role, created_at 
      FROM users
    `;
    const queryParams = [];
    const conditions = [];

    if (role && (role === 'student' || role === 'admin')) {
      queryParams.push(role);
      conditions.push(`role = $${queryParams.length}`);
    }

    if (search && search.trim()) {
      queryParams.push(`%${search.trim().toLowerCase()}%`);
      conditions.push(`(LOWER(name) LIKE $${queryParams.length} OR LOWER(student_id) LIKE $${queryParams.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY id ASC`;

    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
