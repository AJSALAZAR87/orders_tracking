const messagesRepository = require('../repositories/messagesRepository');
const logger = require('../utils/logger');

const getAllMessages = async () => {
  try {
    const messages = await messagesRepository.getAllMessages();
    return messages;
  } catch (err) {
    logger.error(`Error in service getAllMessages: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const getMessagesByCaseId = async (caseId) => {
  try {
    const messages = await messagesRepository.getMessagesByCaseId(caseId);
    return messages;
  } catch (err) {
    logger.error(`Error in service getMessagesByCaseId: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const createMessage = async (messageData) => {
  try {
    const newMessage = await messagesRepository.createMessage(messageData);
    return newMessage;
  } catch (err) {
    logger.error(`Error in service createMessage: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const updateMessage = async (messageId, updatedData) => {
  try {
    const updatedMessage = await messagesRepository.updateMessage(messageId, updatedData);
    return updatedMessage;
  } catch (err) {
    logger.error(`Error in service updateMessage: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const deleteMessage = async (messageId) => {
  try {
    const deletedMessage = await messagesRepository.deleteMessage(messageId);
    return deletedMessage;
  } catch (err) {
    logger.error(`Error in service deleteMessage: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

module.exports = {
  getAllMessages,
  getMessagesByCaseId,
  createMessage,
  updateMessage,
  deleteMessage,
};