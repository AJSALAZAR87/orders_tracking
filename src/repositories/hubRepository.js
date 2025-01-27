const hubModel = require('../models/hub');

const getAllHubs = async (req) => {
  return await hubModel.getAllHubs(req);
}

const getHubsById = async (caseId) => {
  return await hubModel.getHubById(caseId);
}

const insertHub = async (hubData) => {
  return await hubModel.insertHub(hubData);
}

const updateHub = async (hubId, updatedData) => {
  return await hubModel.updateHub(hubId, updatedData);
}

const deleteHub = async (hubId) => {
  return await hubModel.deleteHub(hubId);
}

module.exports = {
  getAllHubs,
  insertHub,
  updateHub,
  deleteHub,
  getHubsById,
};