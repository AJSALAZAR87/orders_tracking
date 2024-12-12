const caseRepository = require('../repositories/caseRepository');
const logger = require('../utils/logger');
const { parseCSV } = require('../utils/csvParser');

// Business logic for processing CSV files
const processCSV = async (filePath) => {
  try {
    logger.debug(`Starting CSV processing for file: ${filePath}`);
    const cases = await parseCSV(filePath);
    console.log('CSV Parsed:', cases);
    logger.info(`Parsed ${cases.length} cases from CSV file.`);
    for (const case1 of cases) {
      if (!case1) {
        logger.warn('Empty case found, skipping...');
        continue;  // Skip this iteration if case is empty or undefined
      }
      console.log('Case data: ', case1);
      logger.info('Processing case data:', case1);
      await caseRepository.insertCase(case1);
    }
    logger.info('All cases have been inserted successfully.');
  } catch(error) {
    const msg = `Error in processing CSV: ${error.message}`
    logger.error(msg);
    throw error;
  }
};

// Business logic for fetching all cases
const getAllCases = async () => {
  try {
    logger.info('All cases have been retrieved');
    return await caseRepository.getAllCases(); 
  } catch (error) {
    // const msg = `Error in retrieving cases: ${error.message}`
    // logger.error(msg);
    console.log('Error', error)
    throw error;
  }
};

module.exports = {
  processCSV,
  getAllCases,
};