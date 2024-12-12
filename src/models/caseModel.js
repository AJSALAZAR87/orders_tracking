const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllCases = async () => {
  try {
    logger.debug('Fetching all cases from the database');
    const query = `
      SELECT 
    cases.id AS case_id,
    cases.notification_date,
    cases.ticket_number,
    cases.logistics_guide_number,
    cases.retailer_id,
    cases.hub_id,
    cases.courier_id,
    cases.tracking_number,
    cases.customer_name,
    cases.customer_address,
    cases.customer_phone_number,
    cases.customer_email,
    cases.customer_postal_code,
    cases.requirement,
      -- Only retrieve necessary columns from hub
      hubs.name AS hub_name, 
      hubs.location AS hub_location, 
      -- Only retrieve necessary columns from retailer
      retailers.name AS retailer_name, 
      -- Only retrieve necessary columns from courier
      couriers.name AS courier_name, 
      couriers.address AS courier_address
      FROM 
          cases
      JOIN 
          hubs ON cases.hub_id = hubs.id
      JOIN 
          retailers ON cases.retailer_id = retailers.id
      JOIN 
          couriers ON cases.courier_id = couriers.id;
    `;
    const result = await pool.query(query);
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