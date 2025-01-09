const messagesModel = require('../models/messages');

const getAllMessages = async () => {
  return await messagesModel.getAllMessages();
}

const getMessagesByCaseId = async (caseId) => {
  return await messagesModel.getMessagesByCaseId(caseId);
}

const createMessage = async (messageData) => {
  return await messagesModel.createMessage(messageData);
}

const updateMessage = async (messageId, updatedData) => {
  return await messagesModel.updateMessage(messageId, updatedData);
}

const deleteMessage = async (messageId) => {
  return await messagesModel.deleteMessage(messageId);
}

module.exports = {
  getAllMessages,
  getMessagesByCaseId,
  createMessage,
  updateMessage,
  deleteMessage,
};