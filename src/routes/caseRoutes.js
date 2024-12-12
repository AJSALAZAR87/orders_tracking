const express = require('express');
const caseController = require('../controllers/caseController');
const validateCSV = require('../middlewares/validateCSV');
const router = express.Router();

//CSV parser
router.post('/upload-csv', validateCSV, caseController.uploadCSV);


//Cases
router.get('/cases', caseController.getCases);


module.exports = router;