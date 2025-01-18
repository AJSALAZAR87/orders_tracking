const retailerModel = require('../models/retailer');

const getAllRetailers = async () => {
  return await retailerModel.getAllRetailers();
}

const getRetailersById = async (caseId) => {
  return await retailerModel.getRetailerById(caseId);
}

const insertRetailer = async (retailerData) => {
  return await retailerModel.insertRetailer(retailerData);
}

const updateRetailer = async (retailerId, updatedData) => {
  return await retailerModel.updateRetailer(retailerId, updatedData);
}

const deleteRetailer = async (retailerId) => {
  return await retailerModel.deleteRetailer(retailerId);
}

module.exports = {
  getAllRetailers,
  insertRetailer,
  updateRetailer,
  deleteRetailer,
  getRetailersById,
};