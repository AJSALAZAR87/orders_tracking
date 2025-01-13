const pool = require('../config/database');
const logger = require('../utils/logger');

const insertUser = async (data) => {
  try {
    const query = `INSERT INTO public.users (name, last_name, email, password) 
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, name, last_name, created_at`;
    const values = [data.name, data.last_name, data.email, data.password];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error(`Database query insertUser failed: ${error.message}`);
    throw error;
  }
};

const getUsers = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;
    if (limit > 100) limit = 100; 
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'ASC';
    const countQuery = `SELECT COUNT(*) FROM public.users`;
    const countResult = await pool.query(countQuery);
    const totalUsers = parseInt(countResult.rows[0].count);

    const query = `SELECT id, name, last_name, email, status, created_at FROM public.users
    ORDER BY id ${sort}
    LIMIT $1 OFFSET $2;`;

    const result = await pool.query(query, [limit, offset]);
    logger.info(`Retrieved ${result.rows.length} cases`);
    
    const totalPages = Math.ceil(totalUsers / limit);
    const pagination = {
      totalItems: totalUsers,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit,
    };

    const result2 = {
      data: result.rows,
      pagination
    }
    
    return result2;
  } catch (error) {
    logger.error(`Database query getUsers failed: ${error.message}`);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const query = `SELECT id, name, last_name, email, created_at, status FROM public.users
    WHERE id = $1
    ORDER BY id ASC`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    logger.error(`Database query getUserById failed: ${error.message}`);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM public.users WHERE email = $1';
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
  insertUser,
  getUserById,
  getUsers
}