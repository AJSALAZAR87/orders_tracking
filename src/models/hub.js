const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllHubs = async (req) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    let status = req.query.status || '';

    status = (status === 'activo' ? true : status ==='inactivo' ? false : null);

    if (limit > 100) limit = 100; 
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'ASC';

    let countQuery = 'SELECT COUNT(*) FROM public.hubs';
    let query1 = `
      SELECT 
        h.id AS hub_id,
        h.name AS hub_name,
        h.address AS hub_address,
        h.contact_name AS hub_contact_name,
        h.contact_phone AS hub_contact_phone,
        h.contact_email AS hub_contact_email,
        h.hub_type AS hub_type,
        h.city AS hub_city,
        h.state AS hub_state,
        h.status AS hub_status,
        h.created_at AS hub_created_at,
        h.updated_at AS hub_updated_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', ca.id,
                    'ticket_number', ca.ticket_number,
                    'logistics_guide_number', ca.logistics_guide_number,
                    'tracking_number', ca.tracking_number
                )
            ) FILTER (WHERE ca.id IS NOT NULL), '[]'
        ) AS cases
      FROM 
          hubs h
      LEFT JOIN 
          cases ca ON ca.hub_id = h.id
    `;
    const queryParams = [];
    let countResult;
    let total;

    if(search) {
      countQuery += ` WHERE (name ILIKE $${queryParams.length + 1} OR hub_type ILIKE $${queryParams.length + 1})`;
      query1 += ` WHERE (h.name ILIKE $${queryParams.length + 1} OR h.hub_type ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${search}%`);
    }

    if(status !== null) {
      if (queryParams.length > 0) {
        countQuery += ` AND status = $${queryParams.length + 1}`;
        query1 += ` AND h.status = $${queryParams.length + 1}`;
      } else {
        countQuery += ` WHERE status = $${queryParams.length + 1}`;
        query1 += ` WHERE h.status = $${queryParams.length + 1}`;
      }
      queryParams.push(status); 
    }

    query1 += ` GROUP BY h.id, h.name, h.address, h.contact_name, h.contact_phone, h.contact_email, 
                h.hub_type, h.city, h.state, h.status, h.created_at, h.updated_at
                ORDER BY h.id ${sort} 
                LIMIT $${queryParams.length + 1} 
                OFFSET $${queryParams.length + 2} 
                ;`;
    queryParams.push(limit, offset);

    countResult = await pool.query(countQuery, queryParams.slice(0, queryParams.length - 2));
    total = parseInt(countResult.rows[0].count);

    const result = await pool.query(query1, queryParams);
    logger.info(`Retrieved ${result.rows.length} hubs`);
    
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
    logger.error(`Error in getAllHubs: ${err.message}`);
    throw new Error(`Error retrieving all Hubs: ${err.message}`);
  }
}

const getHubById = async (Id) => {
  try {
    const query = `
      SELECT 
        h.id AS hub_id,
        h.name AS hub_name,
        h.address AS hub_address,
        h.contact_name AS hub_contact_name,
        h.contact_phone AS hub_contact_phone,
        h.contact_email AS hub_contact_email,
        h.hub_type AS hub_type,
        h.city AS hub_city,
        h.state AS hub_state,
        h.status AS hub_status,
        h.created_at AS hub_created_at,
        h.updated_at AS hub_updated_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', ca.id,
                    'ticket_number', ca.ticket_number,
                    'logistics_guide_number', ca.logistics_guide_number,
                    'tracking_number', ca.tracking_number
                )
            ) FILTER (WHERE ca.id IS NOT NULL), '[]'
        ) AS cases
      FROM 
          hubs h
      LEFT JOIN 
          cases ca ON ca.hub_id = h.id
      WHERE h.id = $1
      GROUP BY 
          h.id;
    `;
    const result = await pool.query(query, [Id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in getHubById: ${err.message}`);
    throw new Error(`Error retrieving hub by id ${Id}: ${err.message}`);
  }
}

const insertHub = async (hubData) => {
  try {
    const {
      name,
      address,
      contact_name,
      contact_phone,
      contact_email,
      hub_type,
      city,
      state,
      status = true,
    } = hubData;

    const query = `
      INSERT INTO public.hubs (name, address, contact_name, contact_phone, contact_email, hub_type, city, state, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const queryValues = [
      name,
      address || null,  
      contact_name || null, 
      contact_phone || null,
      contact_email || null,
      hub_type || null,
      city || null,
      state || null,
      status,
    ];
    const result = await pool.query(query, queryValues);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in insertHub: ${err.message}`);
    throw new Error(`Error creating hub: ${err.message}`);
  }
}


const updateHub = async (id, updatedData) => {
  try {
    const setQuery = Object.keys(updatedData)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');

    const values = Object.values(updatedData);

    const query = `UPDATE public.hubs
                   SET ${setQuery}
                   WHERE id = $${values.length + 1}
                   RETURNING *`;
    
    logger.info('update hubs QUERY:', query);

    const result = await pool.query(query, [...values, id]);

    if (result.rowCount === 0) {
      throw new Error('hub not found');
    }

    return result.rows[0];
    
  } catch (err) {
    logger.error(`Error in updatehubs: ${err.message}`);
    throw new Error(`Error updating hubs ${id}: ${err.message}`);
  }
}

const deleteHub = async (id) => {
  try {
    const query = 'DELETE FROM public.hubs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in delete Hub: ${err.message}`);
    throw new Error(`Error deleting hub ${id}: ${err.message}`);
  }
}

module.exports = {
  getAllHubs,
  getHubById,
  insertHub,
  updateHub,
  deleteHub,
};