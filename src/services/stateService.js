const statesRepository = require('../repositories/statesReposiroty');
const logger = require('../utils/logger');

const getAllStates = async () => {
  try {
    const states = await statesRepository.getAllStates();
    return states;
  } catch (error) {
    logger.error(`Error in service getAllStates: ${error.message}`);
    throw new Error(`Error in service getAllStates: ${error.message}`);
  }
}

module.exports = {
  getAllStates
}