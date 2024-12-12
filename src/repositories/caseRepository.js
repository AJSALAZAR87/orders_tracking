const caseModel = require('../models/caseModel');

const getAllCases = async (req) => {
  return await caseModel.getAllCases(req);
};

const insertCase = async (caseData) => {
  return await caseModel.insertCase(caseData);
};

module.exports = {
  getAllCases,
  insertCase,
};