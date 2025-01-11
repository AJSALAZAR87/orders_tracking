const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllMessages = async () => {
  try {
    const query = `
      SELECT 
      m.id AS id, 
      m.message_text,
      m.sender, 
      m.message_text,
      m.sent_at,
      m.message_type,
      m.status,
      m.twilio_message_sid,
      m.direction,
      m.twilio_status,
      m.message_sid,
      c.id AS case_id, 
      c.notification_date, 
      c.ticket_number, 
      c.logistics_guide_number, 
      c.retailer_id, 
      c.tracking_number, 
      c.customer_name, 
      c.customer_address, 
      c.requirement, 
      c.courier_id, 
      c.customer_phone_number, 
      c.customer_email, 
      c.customer_postal_code, 
      c.hub_id
      FROM public.messages m
      LEFT JOIN public.cases c ON m.case_id = c.id
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    logger.error(`Error in getAllMessages, retrieving messages: ${err.message}`);
    throw new Error(`Error retrieving messages: ${err.message}`);
  }
}

const getMessagesByCaseId = async (caseId) => {
  try {
    const query = `
      SELECT m.*
      FROM public.messages m
      WHERE m.case_id = $1
    `;
    const result = await pool.query(query, [caseId]);
    return result.rows;
  } catch (err) {
    logger.error(`Error in getMessagesByCaseId, retrieving message: ${err.message}`);
    throw new Error(`Error retrieving messages for case ${caseId}: ${err.message}`);
  }
}

const getMessagesById = async (Id) => {
  try {
    const query = `
      SELECT 
      m.id AS id, 
      m.message_text,
      m.sender, 
      m.message_text,
      m.sent_at,
      m.message_type,
      m.status,
      m.twilio_message_sid,
      m.direction,
      m.twilio_status,
      m.message_sid,
      c.id AS case_id, 
      c.notification_date, 
      c.ticket_number, 
      c.logistics_guide_number, 
      c.retailer_id, 
      c.tracking_number, 
      c.customer_name, 
      c.customer_address, 
      c.requirement, 
      c.courier_id, 
      c.customer_phone_number, 
      c.customer_email, 
      c.customer_postal_code, 
      c.hub_id
      FROM public.messages m
      LEFT JOIN public.cases c ON m.case_id = c.id
      WHERE m.id = $1
    `;
    const result = await pool.query(query, [Id]);
    return result.rows;
  } catch (err) {
    logger.error(`Error in getMessagesByCaseId, retrieving message: ${err.message}`);
    throw new Error(`Error retrieving messages for case ${caseId}: ${err.message}`);
  }
}

const createMessage = async (messageData) => {
  try {
    const { case_id, message_text, sender } = messageData;
    const query = `
      INSERT INTO public.messages (case_id, message_text, sender)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [case_id, message_text, sender]);
    return result.rows[0]; // Devuelve el mensaje creado
  } catch (err) {
    logger.error(`Error in createMessage, creating message: ${err.message}`);
    throw new Error(`Error creating message: ${err.message}`);
  }
}


const updateMessage = async (messageId, updatedData) => {
  try {
    const setQuery = Object.keys(updatedData)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(', ');

    const values = Object.values(updatedData);

    const query = `UPDATE public.messages
                   SET ${setQuery}
                   WHERE id = $${values.length + 1}
                   RETURNING *`;
    
    logger.info('update Message QUERY:', query);

    const result = await pool.query(query, [...values, messageId]);

    if (result.rowCount === 0) {
      throw new Error('Message not found');
    }

    return result.rows[0];
    
  } catch (err) {
    logger.error(`Error in updateMessage, updating message: ${err.message}`);
    throw new Error(`Error updating message ${messageId}: ${err.message}`);
  }
}

const deleteMessage = async (messageId) => {
  try {
    const query = 'DELETE FROM public.messages WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [messageId]);
    return result.rows[0];
  } catch (err) {
    logger.error(`Error in deleteMessage, deleting message: ${err.message}`);
    throw new Error(`Error deleting message ${messageId}: ${err.message}`);
  }
}

module.exports = {
  getAllMessages,
  getMessagesByCaseId,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessagesById,
};