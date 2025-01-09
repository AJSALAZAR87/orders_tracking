const pool = require('../config/database');
const logger = require('../utils/logger');

const getAllMessages = async () => {
  try {
    const query = `
      SELECT m.*, c.*
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
      SELECT m.*, c.*
      FROM public.messages m
      LEFT JOIN public.cases c ON m.case_id = c.id
      WHERE m.case_id = $1
    `;
    const result = await pool.query(query, [caseId]);
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
    const { message, sender } = updatedData;
    const query = `
      UPDATE public.messages
      SET message = $1, sender = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [message, sender, messageId]);
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
};