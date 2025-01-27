const couriersRepository = require('../repositories/courierRepository');
const logger = require('../utils/logger');

const getAllCouriers = async (req) => {
  try {
    const couriers = await couriersRepository.getAllCouriers(req);
    return couriers;
  } catch (err) {
    logger.error(`Error in service getAllCouriers: ${err.message}`);
    throw new Error(`Error in service getAllCouriers: ${err.message}`);
  }
}

const getCouriersById = async (courierId) => {
  try {
    const couriers = await couriersRepository.getCouriersById(courierId);
    return couriers;
  } catch (err) {
    logger.error(`Error in service getCouriersById: ${err.message}`);
    throw new Error(`Error in service getCouriersById: ${err.message}`);
  }
}

const createCourier = async (messageData) => {
  try {
    const newCourier = await couriersRepository.createCourier(messageData);
    return newCourier;
  } catch (err) {
    logger.error(`Error in service createCourier: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const updateCourier = async (courierId, updatedData) => {
  try {
    const updatedCourier = await couriersRepository.updateCourier(courierId, updatedData);
    return updatedCourier;
  } catch (err) {
    logger.error(`Error in service updateCourier: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

const deleteCourier = async (courierId) => {
  try {
    const deletedCourier = await couriersRepository.deleteCourier(courierId);
    return deletedCourier;
  } catch (err) {
    logger.error(`Error in service deleteCourier: ${err.message}`);
    throw new Error(`Error in service: ${err.message}`);
  }
}

module.exports = {
  getAllCouriers,
  createCourier,
  updateCourier,
  deleteCourier,
  getCouriersById
};