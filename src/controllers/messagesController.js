const messagesService = require('../services/messagesService');

const getAllMessages = async (req, res) => {
  try {
    const { caseId } = req.query;
    if (caseId){
      const messages = await messagesService.getMessagesByCaseId(caseId);
      if (messages.length === 0) {
        return res.status(404).json({ error: 'No messages found for this case' });
      }
      res.status(200).json(messages);
    }else{
      const messages = await messagesService.getAllMessages();
      const formattedMessages = messages.map( message => {
        return {
          id: message.id,
          sender: message.sender,
          message_text: message.message_text,
          sent_at: message.sent_at,
          message_type: message.message_type,
          status: message.status,
          twilio_message_sid: message.twilio_message_sid,
          direction: message.direction,
          twilio_status: message.twilio_status,
          message_sid: message.message_sid,
          case:{
            case_id: message.case_id,
            notification_date: message.notification_date,
            ticket_number: message.ticket_number,
            logistics_guide_number: message.logistics_guide_number,
            tracking_number: message.tracking_number,
            customer_name: message.customer_name,
            customer_address: message.customer_address,
            requirement: message.requirement,
            customer_phone_number: message.customer_phone_number,
            customer_email: message.customer_email,
            customer_postal_code: message.customer_postal_code
          },
        }
      })
      res.status(200).json({
        data: formattedMessages
      });
    }
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getMessagesById = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await messagesService.getMessagesById(id);
    if (messages.length === 0) {
      return res.status(404).json({ error: 'No messages found' });
    }
    const formattedMessages = messages.map( message => {
      return {
        id: message.id,
        sender: message.sender,
        message_text: message.message_text,
        sent_at: message.sent_at,
        message_type: message.message_type,
        status: message.status,
        twilio_message_sid: message.twilio_message_sid,
        direction: message.direction,
        twilio_status: message.twilio_status,
        message_sid: message.message_sid,
        case:{
          case_id: message.case_id,
          notification_date: message.notification_date,
          ticket_number: message.ticket_number,
          logistics_guide_number: message.logistics_guide_number,
          tracking_number: message.tracking_number,
          customer_name: message.customer_name,
          customer_address: message.customer_address,
          requirement: message.requirement,
          customer_phone_number: message.customer_phone_number,
          customer_email: message.customer_email,
          customer_postal_code: message.customer_postal_code
        },
      }
    })
    res.status(200).json({
      data: formattedMessages
    });
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
  getMessagesById,
  createMessage,
  updateMessage,
  deleteMessage,
};