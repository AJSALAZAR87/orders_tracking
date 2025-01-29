const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllStates = async () => {
  try {
    const query = "SELECT * FROM public.mx_states;";
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error(`Error in get All States ${error.message}`)
    throw new Error('Error in getAllStates method', error.message) 
  }
}

module.exports = {
  getAllStates
}