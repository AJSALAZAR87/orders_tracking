const courierModel = require('../models/courier');

const getAllCouriers = async (req) => {
  return await courierModel.getAllCouriers(req);
}

const getCouriersById = async (caseId) => {
  return await courierModel.getCourierById(caseId);
}

const createCourier = async (courierData) => {
  return await courierModel.insertCourier(courierData);
}

const updateCourier = async (courierId, updatedData) => {
  return await courierModel.updateCourier(courierId, updatedData);
}

const deleteCourier = async (courierId) => {
  return await courierModel.deleteCourier(courierId);
}

module.exports = {
  getAllCouriers,
  createCourier,
  updateCourier,
  deleteCourier,
  getCouriersById,
};