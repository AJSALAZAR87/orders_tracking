const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const caseController = require('../controllers/caseController');
const messagesController = require('../controllers/messagesController');
const authController = require('../controllers/authController');
const courierController = require('../controllers/courierController');
const retailerController = require('../controllers/retailerController');
const hubController = require('../controllers/hubController');
const validateCSV = require('../middlewares/validateCSV');
const { authenticate } = require('../middlewares/auth')

//AUTH ROUTES
//LOGIN
router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('last_name').notEmpty().withMessage('Last_name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], authController.signUp);
//SIGN UP
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
], authController.login);
//REFRESH TOKEN
router.post('/refresh-token', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], authController.refreshToken);
//UPDATE USER
router.put('/users/:userId', authenticate, authController.updateUser);
//GET USERS
router.get('/users', authenticate, authController.getUsers);
//GET USER BY ID
router.get('/users/:userId', authenticate, authController.getUserById);

//CASES ROUTES
//GET
router.get('/cases', authenticate, caseController.getCases);
//POST
router.post('/upload-csv', authenticate, validateCSV, caseController.uploadCSV);
//PATCH
router.patch('/cases/:id', authenticate, caseController.updateCase);
//DELETE
router.delete('/cases/:id', authenticate, caseController.deleteCase);

//MESSAGES ROUTES
//GET
router.get('/messages', authenticate, messagesController.getAllMessages);
//GET BY ID
router.get('/messages/:id', authenticate, messagesController.getMessagesById); 
//POST
router.post('/messages', authenticate, messagesController.createMessage);
//PUT
router.put('/messages/:messageId', authenticate, messagesController.updateMessage);
//DELETE
router.delete('/messages/:messageId', authenticate, messagesController.deleteMessage);

//COURIERS ROUTES
//GET
router.get('/couriers', authenticate, courierController.getAllCouriers);
//GET BY ID
router.get('/couriers/:id', authenticate, courierController.getCouriersById); 
//POST
router.post('/couriers', authenticate, courierController.insertCourier);
//PUT
router.put('/couriers/:id', authenticate, courierController.updateCourier);
//DELETE
router.delete('/couriers/:id', authenticate, courierController.deleteCourier);

//RETAILERS ROUTES
//GET
router.get('/retailers', authenticate, retailerController.getAllRetailers);
//GET BY ID
router.get('/retailers/:id', authenticate, retailerController.getRetailersById); 
//POST
router.post('/retailers', authenticate, retailerController.insertRetailer);
//PUT
router.put('/retailers/:id', authenticate, retailerController.updateRetailer);
//DELETE
router.delete('/retailers/:id', authenticate, retailerController.deleteRetailer);

//HUBS ROUTES
//GET
router.get('/hubs', authenticate, hubController.getAllHubs);
//GET BY ID
router.get('/hubs/:id', authenticate, hubController.getHubsById); 
//POST
router.post('/hubs', authenticate, hubController.insertHub);
//PUT
router.put('/hubs/:id', authenticate, hubController.updateHub);
//DELETE
router.delete('/hubs/:id', authenticate, hubController.deleteHub);

module.exports = router;