const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllRetailers = async () => {
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
      GROUP BY 
          r.id;
    `;
    const result = await pool.query(query);
    return result.rows;
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