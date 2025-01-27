const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllRetailers = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    if (limit > 100) limit = 100; 
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'ASC';

    let countQuery = 'SELECT COUNT(*) FROM public.retailers';
    let query1 = `
      SELECT 
        r.id AS retailer_id,
        r.name AS retailer_name,
        r.address AS retailer_address,
        r.phone_number AS retailer_phone_number,
        r.email AS retailer_email,
        r.contact_name AS retailer_contact_name,
        r.city AS retailer_city,
        r.state AS retailer_state,
        r.website_url AS retailer_website_url,
        r.created_at AS retailer_created_at,
        r.updated_at AS retailer_updated_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', ca.id,
                    'ticket_number', ca.ticket_number,
                    'logistics_guide_number', ca.logistics_guide_number,
                    'tracking_number', ca.tracking_number,
                    'customer_name', ca.customer_name,
                    'customer_address', ca.customer_address,
                    'customer_phone_number', ca.customer_phone_number,
                    'customer_email', ca.customer_email
                )
            ) FILTER (WHERE ca.id IS NOT NULL), '[]'
        ) AS cases
      FROM 
          retailers r
      LEFT JOIN 
          cases ca ON ca.retailer_id = r.id
    `;

    const queryParams = [];
    let countResult;
    let total;

    if(search) {
      countQuery += ` WHERE (name ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 1})`;
      query1 += ` WHERE (r.name ILIKE $${queryParams.length + 1} OR r.email ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${search}%`);
    }

    query1 += ` GROUP BY r.id 
                ORDER BY r.id ${sort} 
                LIMIT $${queryParams.length + 1} 
                OFFSET $${queryParams.length + 2} 
                ;`;
    queryParams.push(limit, offset);

    countResult = await pool.query(countQuery, queryParams.slice(0, queryParams.length - 2));
    total = parseInt(countResult.rows[0].count);

    const result = await pool.query(query1, queryParams);
    logger.info(`Retrieved ${result.rows.length} couriers`);
    
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      totalItems: total,
      totalPages: totalPages,
      currentPage: page,
      pageSize: limit,
    };

    const result2 = {
      data: result.rows,
      pagination
    }
    return result2;
  } catch (err) {
    logger.error(`Error in getAllRetailers: ${err.message}`);
    throw new Error(`Error retrieving all Retailers: ${err.message}`);
  }
}

const getRetailerById = async (Id) => {
  try {
    const query = `
      SELECT 
        r.id AS retailer_id,
        r.name AS retailer_name,
        r.address AS retailer_address,
        r.phone_number AS retailer_phone_number,
        r.email AS retailer_email,
        r.contact_name AS retailer_contact_name,
        r.city AS retailer_city,
        r.state AS retailer_state,
        r.website_url AS retailer_website_url,
        r.created_at AS retailer_created_at,
        r.updated_at AS retailer_updated_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', ca.id,
                    'ticket_number', ca.ticket_number,
                    'logistics_guide_number', ca.logistics_guide_number,
                    'tracking_number', ca.tracking_number,
                    'customer_name', ca.customer_name,
                    'customer_address', ca.customer_address,
                    'customer_phone_number', ca.customer_phone_number,
                    'customer_email', ca.customer_email
                )
            ) FILTER (WHERE ca.id IS NOT NULL), '[]'
        ) AS cases
      FROM 
          retailers r
      LEFT JOIN 
          cases ca ON ca.retailer_id = r.id
      WHERE r.id = $1
      GROUP BY 
          r.id;
    `;
    const result = await pool.query(query, [Id]);
    return result.rows;
  } catch (err) {
    logger.error(`Error in getRetailerById: ${err.message}`);
    throw new Error(`Error retrieving retailer by id ${Id}: ${err.message}`);
  }
}

const insertRetailer = async (retailerData) => {
  try {
    const {
      name,
      address,
      phone_number,
      email,
      contact_name,
      city,
      state,
      website_url,
    } = retailerData;

    const query = `
      INSERT INTO public.retailers (name, address, phone_number, email, contact_name, city, state, website_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const queryValues = [
      name,
      address || null,  
      phone_number || null, 
      email || null,
      contact_name || null,
      city || null,
      state || null,
      website_url || null,
    ];
    const result = await pool.query(query, queryValues);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in insertRetailer: ${err.message}`);
    throw new Error(`Error creating retailer: ${err.message}`);
  }
}


const updateRetailer = async (id, updatedData) => {
  try {
    const setQuery = Object.keys(updatedData)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');

    const values = Object.values(updatedData);

    const query = `UPDATE public.retailers
                   SET ${setQuery}
                   WHERE id = $${values.length + 1}
                   RETURNING *`;
    
    logger.info('update retailers QUERY:', query);

    const result = await pool.query(query, [...values, id]);

    if (result.rowCount === 0) {
      throw new Error('retailer not found');
    }

    return result.rows[0];
    
  } catch (err) {
    logger.error(`Error in updateretailers: ${err.message}`);
    throw new Error(`Error updating retailers ${id}: ${err.message}`);
  }
}

const deleteRetailer = async (id) => {
  try {
    const query = 'DELETE FROM public.retailers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in delete Retailer: ${err.message}`);
    throw new Error(`Error deleting retailer ${id}: ${err.message}`);
  }
}

module.exports = {
  getAllRetailers,
  getRetailerById,
  insertRetailer,
  updateRetailer,
  deleteRetailer,
};