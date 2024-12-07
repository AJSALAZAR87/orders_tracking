const caseModel = require('../models/caseModel');

const getAllCases = async () => {
  return await caseModel.getAllCases();
};

const insertCase = async (caseData) => {
  return await caseModel.insertCase(caseData);
};

module.exports = {
  getAllCases,
  insertCase,
};