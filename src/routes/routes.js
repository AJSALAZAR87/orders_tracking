const express = require('express');
const caseController = require('../controllers/caseController');
const messagesController = require('../controllers/messagesController');
const validateCSV = require('../middlewares/validateCSV');
const router = express.Router();

//CASES ROUTES
//GET
router.get('/cases', caseController.getCases);
//POST
router.post('/upload-csv', validateCSV, caseController.uploadCSV);
//PATCH
router.patch('/cases/:id', caseController.updateCase);
//DELETE
router.delete('/cases/:id', caseController.deleteCase);

//MESSAGES ROUTES
//GET
router.get('/messages', messagesController.getAllMessages);
//GET BY ID
router.get('/messages/:id', messagesController.getMessagesById); 
//POST
router.post('/messages', messagesController.createMessage);
//PUT
router.put('/messages/:messageId', messagesController.updateMessage);
//DELETE
router.delete('/messages/:messageId', messagesController.deleteMessage);


module.exports = router;