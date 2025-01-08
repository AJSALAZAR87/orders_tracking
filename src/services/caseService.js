const caseRepository = require('../repositories/caseRepository');
const logger = require('../utils/logger');
const { parseCSV } = require('../utils/csvParser');

const processCSV = async (filePath) => {
  let insertedCount = 0;
  try {
    logger.debug(`Starting CSV processing for file: ${filePath}`);
    const cases = await parseCSV(filePath);
    console.log('CSV Parsed:', cases);
    logger.info(`Parsed ${cases.length} cases from CSV file.`);
    for (const case1 of cases) {
      if (!case1) {
        logger.warn('Empty case found, skipping...');
        continue; 
      }
      console.log('Case data: ', case1);
      logger.info('Processing case data:', case1);

      try {
        const isInserted = await caseRepository.insertCaseRepository(case1);
        if (isInserted) {
          insertedCount++;
        } 
      } catch (err) {
        logger.error(`Error inserting case with ticket number ${case1.ticket_number}: ${err.message}`);
        continue;
      }

    }
    logger.info('All cases have been inserted successfully.');
    return insertedCount;
  } catch(error) {
    const msg = `Error in processing CSV: ${error.message}`
    logger.error(msg);
    throw error;
  }
};


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