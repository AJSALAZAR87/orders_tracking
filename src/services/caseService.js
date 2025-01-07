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
      await caseRepository.insertCaseRepository(case1);
    }
    logger.info('All cases have been inserted successfully.');
  } catch(error) {
    const msg = `Error in processing CSV: ${error.message}`
    logger.error(msg);
    throw error;
  }
};

// Business logic for fetching all cases
const getCases = async (req) => {
  try {
    logger.info('All cases have been retrieved');
    return await caseRepository.getCasesRepository(req); 
  } catch (error) {
    // const msg = `Error in retrieving cases: ${error.message}`
    // logger.error(msg);
    console.log('Error', error)
    throw error;
  }
};

const updateCase = async (id, fields) => {
  try {
    const updatedCase = await caseRepository.updateCaseRepository(id, fields);
    return updatedCase;
  } catch (err) {
    throw new Error(`Error in service: ${err.message}`);
  }
}

const deleteCase = async(id) => {
  try {
    const deletedCase = await caseRepository.deleteCaseRepository(id);
    return deletedCase;
  } catch (err) {
    throw new Error(`Error in service: ${err.message}`);
  }
}

module.exports = {
  processCSV,
  getCases,
  updateCase,
  deleteCase,
};