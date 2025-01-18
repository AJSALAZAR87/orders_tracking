const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllCases = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Limit to 100
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'ASC';

    const {
      tracking_number,
      ticket_number,
      logistics_guide_number,
      retailer_id,
      courier_id,
      status,
    } = req.query;

    let whereClauses = [];
    let queryParams = [];

    if (retailer_id) {
      whereClauses.push(`cases.retailer_id = $${queryParams.length + 1}`);
      queryParams.push(retailer_id);
    }
    if (courier_id) {
      whereClauses.push(`cases.courier_id = $${queryParams.length + 1}`);
      queryParams.push(courier_id);
    }
    if (status) {
      whereClauses.push(`cases.status = $${queryParams.length + 1}`);
      queryParams.push(status);
    }

    if (ticket_number) {
      whereClauses.push(`cases.ticket_number LIKE $${queryParams.length + 1}`);
      queryParams.push(`%${ticket_number}%`);
    }
    if (logistics_guide_number) {
      whereClauses.push(`cases.logistics_guide_number LIKE $${queryParams.length + 1}`);
      queryParams.push(`%${logistics_guide_number}%`);
    }
    if (tracking_number) {
      whereClauses.push(`cases.tracking_number LIKE $${queryParams.length + 1}`);
      queryParams.push(`%${tracking_number}%`);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) 
      FROM cases
      JOIN hubs ON cases.hub_id = hubs.id
      JOIN retailers ON cases.retailer_id = retailers.id
      JOIN couriers ON cases.courier_id = couriers.id
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const totalCases = parseInt(countResult.rows[0].count);

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
        cases.status,
        hubs.name AS hub_name, 
        hubs.address AS hubs_address, 
        retailers.name AS retailer_name, 
        couriers.name AS courier_name, 
        couriers.address AS courier_address,
        couriers.phone_number AS courier_phone_number
      FROM 
          cases
      JOIN 
          hubs ON cases.hub_id = hubs.id
      JOIN 
          retailers ON cases.retailer_id = retailers.id
      JOIN 
          couriers ON cases.courier_id = couriers.id
      ${whereClause}
      ORDER BY cases.id ${sort}  -- Sorting direction based on query parameter
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
    `;

    queryParams.push(limit, offset);
    const result = await pool.query(query, queryParams);
    logger.info(`Retrieved ${result.rows.length} cases`);
    
    const totalPages = Math.ceil(totalCases / limit);
    const pagination = {
      totalItems: totalCases,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit,
    };

    return {
      data: result.rows,
      pagination
    }; 
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
      [caseData.station_name.toUpperCase()]
    );
    console.log('Station results: ', stationResult);
    const stationId = stationResult.rows.length > 0 ? stationResult.rows[0].id : null;
    if (!stationId) {
      logger.error('Failed to insert or retrieve station ID');
    }
    const retailerResult = await pool.query(
        'INSERT INTO retailers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [caseData.retailer_name.toUpperCase()]
    );
    console.log('Retailer result: ', retailerResult);
    const retailerId = retailerResult.rows.length > 0 ? retailerResult.rows[0].id : null;
    if (!retailerId) {
      logger.error('Failed to insert or retrieve retailer ID');
    }
    const courierResult = await pool.query(
      'INSERT INTO couriers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;',
      [caseData.courier_name.toUpperCase()]
    );
    // console.log('Courier result: ', courierId);
    const courierId = courierResult.rows.length > 0 ? courierResult.rows[0].id : null;
    if (!courierId) {
      logger.error('Failed to insert or retrieve courier ID');
    }
    const query = `
    INSERT INTO cases (hub_id, notification_date, ticket_number, logistics_guide_number, retailer_id, tracking_number, customer_name, customer_address, requirement, courier_id, customer_phone_number, customer_email, customer_postal_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (ticket_number) DO NOTHING RETURNING id`;
    const values = [
      stationId, caseData.notification_date, caseData.ticket_number, caseData.logistics_guide_number,
      retailerId, caseData.tracking_number, caseData.customer_name, caseData.customer_address,
      caseData.requirement, courierId, caseData.customer_phone_number, caseData.customer_email, caseData.customer_postal_code
    ];
    console.log('Queries to post: ', query,values)
    const result = await pool.query(query, values);
    // logger.info(`Case with ID: ${result.rows[0].id} inserted successfully`);
    const inserted = result.rows[0]?.id ? result.rows[0].id : null;

    return inserted ? true : false;
  } catch (error) {
    logger.error(`Database query insertCase failed: ${error.message}`);
    throw error;
  }
};

const updateCase = async (id, fieldsToUpdate) => {
  try {
    const setQuery = Object.keys(fieldsToUpdate)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');

    const values = Object.values(fieldsToUpdate);

    const query = `UPDATE public.cases
                   SET ${setQuery}
                   WHERE id = $${values.length + 1}
                   RETURNING *`;

    logger.info('update case model:', query);

    const result = await pool.query(query, [...values, id]);

    if (result.rowCount === 0) {
      throw new Error('Case not found');
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating case: ${err.message}`);
  }
}

const deleteCase = async(id) => {
  try {
    const query = 'DELETE FROM public.cases WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new Error('Case not found');
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting case: ${err.message}`);
  }
}

module.exports = {
  getAllCases,
  insertCase,
  updateCase,
  deleteCase
};