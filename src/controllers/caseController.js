const caseService = require('../services/caseService');
const logger = require('../utils/logger');

exports.uploadCSV = async (req, res) => {
  try {
    logger.info('Received CSV file upload request');
    await caseService.processCSV(req.file.path);
    res.status(200).json({ message: 'CSV processed successfully' });
    logger.info('CSV processed successfully');
  } catch (error) {
    logger.error(`Error processing CSV: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await caseService.getAllCases();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};