const hubsRepository = require('../repositories/hubRepository');
const logger = require('../utils/logger');

const getAllHubs = async (req) => {
  try {
    const hubs = await hubsRepository.getAllHubs(req);
    return hubs;
  } catch (err) {
    logger.error(`Error in service getAllHubs: ${err.message}`);
    throw new Error(`Error in service getAllHubs: ${err.message}`);
  }
}

const getHubsById = async (id) => {
  try {
    const hub = await hubsRepository.getHubsById(id);
    return hub;
  } catch (err) {
    logger.error(`Error in service getHubsById: ${err.message}`);
    throw new Error(`Error in service getHubsById: ${err.message}`);
  }
}

const insertHub = async (hubData) => {
  try {
    const newHub = await hubsRepository.insertHub(hubData);
    return newHub;
  } catch (err) {
    logger.error(`Error in service createHub: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const updateHub = async (id, updatedData) => {
  try {
    const updatedHub = await hubsRepository.updateHub(id, updatedData);
    return updatedHub;
  } catch (err) {
    logger.error(`Error in service updateHub: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const deleteHub = async (id) => {
  try {
    const deletedHub = await hubsRepository.deleteHub(id);
    return deletedHub;
  } catch (err) {
    logger.error(`Error in service deleteHub: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

module.exports = {
  getAllHubs,
  insertHub,
  updateHub,
  deleteHub,
  getHubsById
};