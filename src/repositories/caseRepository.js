const caseModel = require('../models/caseModel');

const getCasesRepository = async (req) => {
  return await caseModel.getAllCases(req);
};

const insertCaseRepository = async (caseData) => {
  return await caseModel.insertCase(caseData);
};

const updateCaseRepository = async (id, fieldsToUpdate) => {
  return await caseModel.updateCase(id, fieldsToUpdate);
}

const deleteCaseRepository = async (id) => {
  return await caseModel.deleteCase(id);
}



module.exports = {
  getCasesRepository,
  insertCaseRepository,
  updateCaseRepository,
  deleteCaseRepository
};