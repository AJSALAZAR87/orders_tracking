const express = require('express');
const caseController = require('../controllers/caseController');
const validateCSV = require('../middlewares/validateCSV');
const router = express.Router();

//CASES MODEL

//GET
router.get('/cases', caseController.getCases);

//POST
router.post('/upload-csv', validateCSV, caseController.uploadCSV);

//PUT
router.patch('/cases/:id', caseController.updateCase);

//DELETE
router.delete('/cases/:id', caseController.deleteCase);

module.exports = router;