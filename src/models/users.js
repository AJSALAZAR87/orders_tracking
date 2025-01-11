const pool = require('../config/database');
const logger = require('../utils/logger');

const insertUser = async (data) => {
  try {
    console.log('Datos usuario:', data);
    const query = `INSERT INTO users (name, last_name, email, password) 
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
    const values = [data.name, data.last_name, data.email, data.password];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error(`Database query insertUser failed: ${error.message}`);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0]; 
  } catch (error) {
    logger.error(`Database query findByEmail failed: ${error.message}`);
    throw error;
  }
};

const updateUser = async (id, fields) => {
  try {
    const setQuery = Object.keys(fields)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');

    const values = Object.values(fields);

    const query = `UPDATE public.users
                   SET ${setQuery}
                   WHERE id = $${values.length + 1}
                   RETURNING id, email, last_name`;
    
    const result = await pool.query(query, [...values, id]);

    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  } catch (error) {
    logger.error(`Database query updateUser failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  findByEmail,
  updateUser,
  insertUser
}