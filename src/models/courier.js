const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllCouriers = async () => {
  try {
    const query = `
      SELECT 
        c.id AS courier_id,
        c.name AS courier_name,
        c.address AS courier_address,
        c.phone_number AS courier_phone_number,
        c.email AS courier_email,
        c.vehicle_type AS courier_vehicle_type,
        c.status AS courier_status,
        c.created_at AS courier_created_at,
        c.updated_at AS courier_updated_at,
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
          couriers c
      LEFT JOIN 
          cases ca ON ca.courier_id = c.id
      GROUP BY 
          c.id;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    logger.error(`Error in getAllCouriers, retrieving couriers: ${err.message}`);
    throw new Error(`Error retrieving all couriers: ${err.message}`);
  }
}

const getCourierById = async (Id) => {
  try {
    const query = `
      SELECT 
        c.id AS courier_id,
        c.name AS courier_name,
        c.address AS courier_address,
        c.phone_number AS courier_phone_number,
        c.email AS courier_email,
        c.vehicle_type AS courier_vehicle_type,
        c.status AS courier_status,
        c.created_at AS courier_created_at,
        c.updated_at AS courier_updated_at,
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
          couriers c
      LEFT JOIN 
          cases ca ON ca.courier_id = c.id
      WHERE c.id = $1
      GROUP BY 
          c.id;
    `;
    const result = await pool.query(query, [Id]);
    return result.rows;
  } catch (err) {
    logger.error(`Error in getCourierById: ${err.message}`);
    throw new Error(`Error retrieving courier by id ${Id}: ${err.message}`);
  }
}

const insertCourier = async (courierData) => {
  try {
    const {
      name,
      address,
      phone_number,
      email,
      vehicle_type,
      status = true, 
    } = courierData;

    const query = `
      INSERT INTO public.couriers (name, address, phone_number, email, vehicle_type, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const queryValues = [
      name,
      address || null,  
      phone_number || null, 
      email || null,
      vehicle_type || null,
      status,
    ];
    const result = await pool.query(query, queryValues);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in insertCourier: ${err.message}`);
    throw new Error(`Error creating courier: ${err.message}`);
  }
}


const updateCourier = async (courierId, updatedData) => {
  try {
    const setQuery = Object.keys(updatedData)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');

    const values = Object.values(updatedData);

    const query = `UPDATE public.couriers
                   SET ${setQuery}
                   WHERE id = $${values.length + 1}
                   RETURNING *`;
    
    logger.info('update Courier QUERY:', query);

    const result = await pool.query(query, [...values, courierId]);

    if (result.rowCount === 0) {
      throw new Error('Courier not found');
    }

    return result.rows[0];
    
  } catch (err) {
    logger.error(`Error in updatecourier: ${err.message}`);
    throw new Error(`Error updating courier ${courierId}: ${err.message}`);
  }
}

const deleteCourier = async (courierId) => {
  try {
    const query = 'DELETE FROM public.couriers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [courierId]);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in deleteCourier: ${err.message}`);
    throw new Error(`Error deleting courier ${courierId}: ${err.message}`);
  }
}

module.exports = {
  getAllCouriers,
  getCourierById,
  insertCourier,
  updateCourier,
  deleteCourier,
};