const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const caseController = require('../controllers/caseController');
const messagesController = require('../controllers/messagesController');
const authController = require('../controllers/authController');
const validateCSV = require('../middlewares/validateCSV');

//AUTH ROUTES
//LOGIN
router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('last_name').notEmpty().withMessage('Last_name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authController.signUp);
//SIGN UP
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);
//UPDATE USER
router.put('/users/:userId', authController.updateUser)

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