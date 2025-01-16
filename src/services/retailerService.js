const retailersRepository = require('../repositories/retailersRepository');
const logger = require('../utils/logger');

const getAllRetailers = async () => {
  try {
    const retailers = await retailersRepository.getAllRetailers();
    return retailers;
  } catch (err) {
    logger.error(`Error in service getAllRetailers: ${err.message}`);
    throw new Error(`Error in service getAllRetailers: ${err.message}`);
  }
}

const getRetailersById = async (id) => {
  try {
    const retailer = await retailersRepository.getRetailersById(id);
    return retailer;
  } catch (err) {
    logger.error(`Error in service getRetailersById: ${err.message}`);
    throw new Error(`Error in service getRetailersById: ${err.message}`);
  }
}

const insertRetailer = async (messageData) => {
  try {
    const newRetailer = await retailersRepository.insertRetailer(messageData);
    return newRetailer;
  } catch (err) {
    logger.error(`Error in service createRetailer: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const updateRetailer = async (id, updatedData) => {
  try {
    const updatedRetailer = await retailersRepository.updateRetailer(id, updatedData);
    return updatedRetailer;
  } catch (err) {
    logger.error(`Error in service updateRetailer: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const deleteRetailer = async (id) => {
  try {
    const deletedRetailer = await retailersRepository.deleteRetailer(id);
    return deletedRetailer;
  } catch (err) {
    logger.error(`Error in service deleteRetailer: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

module.exports = {
  getAllRetailers,
  insertRetailer,
  updateRetailer,
  deleteRetailer,
  getRetailersById
};