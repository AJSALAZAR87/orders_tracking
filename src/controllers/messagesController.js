const messagesService = require('../services/messagesService');

const getAllMessages = async (req, res) => {
  try {
    const messages = await messagesService.getAllMessages();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getMessagesByCaseId = async (req, res) => {
  const { caseId } = req.params;
  try {
    const messages = await messagesService.getMessagesByCaseId(caseId);
    if (messages.length === 0) {
      return res.status(404).json({ error: 'No messages found for this case' });
    }
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createMessage = async (req, res) => {
  const messageData = req.body;
  try {
    const newMessage = await messagesService.createMessage(messageData);
    res.status(201).json(newMessage); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const updatedData = req.body;
  try {
    const updatedMessage = await messagesService.updateMessage(messageId, updatedData);
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await messagesService.deleteMessage(messageId);
    res.status(200).json({ message: 'Message deleted', deletedMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllMessages,
  getMessagesByCaseId,
  createMessage,
  updateMessage,
  deleteMessage,
};