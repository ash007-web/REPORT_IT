import pool from '../config/db.js';

export const getItems = async (req, res) => {
  try {
    const { type, userId } = req.query;
    let query = `
      SELECT i.*, u.name as reporter_name, u.student_id 
      FROM items i
      JOIN users u ON i.user_id = u.id
    `;
    const queryParams = [];
    const conditions = [];

    if (type && (type === 'lost' || type === 'found')) {
      queryParams.push(type);
      conditions.push(`i.type = $${queryParams.length}`);
    }

    if (userId) {
      queryParams.push(userId);
      conditions.push(`i.user_id = $${queryParams.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }
    
    query += ` ORDER BY i.created_at DESC`;

    const result = await pool.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createItem = async (req, res) => {
  try {
    const { userId, title, description, location, date, type } = req.body;
    
    if (!userId || !title || !description || !location || !date || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO items (user_id, title, description, location, item_date, type, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'active')
      RETURNING *
    `;
    const values = [userId, title, description, location, date, type];
    
    const result = await pool.query(query, values);
    const createdItem = result.rows[0];

    // Fetch with user info
    const itemWithUser = await pool.query(
      `SELECT i.*, u.name as reporter_name, u.student_id 
       FROM items i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [createdItem.id]
    );

    res.status(201).json(itemWithUser.rows[0] || createdItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resolveItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      UPDATE items 
      SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error resolving item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      DELETE FROM items 
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.status(200).json({ message: 'Item successfully deleted', deletedItem: result.rows[0] });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
