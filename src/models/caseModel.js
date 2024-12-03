const pool = require('../config/database');

const getAllCases = async () => {
  try {
    logger.debug('Fetching all cases from the database');
    const result = await pool.query('SELECT * FROM cases');
    logger.info(`Retrieved ${result.rows.length} cases`);
    return result.rows; 
  } catch (error) {
    logger.error(`Database query GETALLCASES failed: ${error.message}`);
    throw error;
  }
};

const insertCase = async (caseData) => {
  try {
    logger.debug('Inserting case into the database');
    const query = `
    INSERT INTO cases (station_id, notification_date, ticket_number, logistics_guide_number, retailer_id, tracking_number, customer_name, customer_address, requirement, courier_name, customer_phone_number, customer_email, customer_postal_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`;
    const values = [
      caseData.stationId, caseData.notification_date, caseData.ticket_number, caseData.logistics_guide_number,
      caseData.retailerId, caseData.tracking_number, caseData.customer_name, caseData.customer_address,
      caseData.requirement, caseData.courier_name, caseData.customer_phone_number, caseData.customer_email, caseData.customer_postal_code
    ];
    const result = await pool.query(query, values);
    logger.info(`Case with ID: ${result.rows[0].id} inserted successfully`);
    return result.rows[0].id; 
  } catch (error) {
    logger.error(`Database query insertCase failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getAllCases,
  insertCase,
};