const pool = require('../config/database');
const logger = require('../utils/logger');

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
    console.log('Station name2: ', caseData)
    const stationResult = await pool.query(
      'INSERT INTO hubs (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
      [caseData.station_name]
    );
    console.log('Station results: ', stationResult);
    const stationId = stationResult.rows.length > 0 ? stationResult.rows[0].id : null;
    if (!stationId) {
      logger.error('Failed to insert or retrieve station ID');
    }
    const retailerResult = await pool.query(
        'INSERT INTO retailers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [caseData.retailer_name]
    );
    console.log('Retailer result: ', retailerResult);
    const retailerId = retailerResult.rows.length > 0 ? retailerResult.rows[0].id : null;
    if (!retailerId) {
      logger.error('Failed to insert or retrieve retailer ID');
    }
    const courierResult = await pool.query(
      'INSERT INTO couriers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;',
      [caseData.courier_name]
    );
    // console.log('Courier result: ', courierId);
    const courierId = courierResult.rows.length > 0 ? courierResult.rows[0].id : null;
    if (!courierId) {
      logger.error('Failed to insert or retrieve courier ID');
    }
    const query = `
    INSERT INTO cases (hub_id, notification_date, ticket_number, logistics_guide_number, retailer_id, tracking_number, customer_name, customer_address, requirement, courier_id, customer_phone_number, customer_email, customer_postal_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (ticket_number) DO UPDATE SET ticket_number = EXCLUDED.ticket_number RETURNING id`;
    const values = [
      stationId, caseData.notification_date, caseData.ticket_number, caseData.logistics_guide_number,
      retailerId, caseData.tracking_number, caseData.customer_name, caseData.customer_address,
      caseData.requirement, courierId, caseData.customer_phone_number, caseData.customer_email, caseData.customer_postal_code
    ];
    console.log('Queries to post: ', query,values)
    const result = await pool.query(query, values);
    // logger.info(`Case with ID: ${result.rows[0].id} inserted successfully`);
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