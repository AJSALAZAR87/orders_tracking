const userModel = require('../models/users');

const findByEmailRepository = async (req) => {
  return await userModel.findByEmail(req);
};

const inserUserRepository = async (caseData) => {
  return await userModel.insertUser(caseData);
};

const updateUserRepository = async (id, fieldsToUpdate) => {
  return await userModel.updateUser(id, fieldsToUpdate);
}


module.exports = {
  findByEmailRepository,
  inserUserRepository,
  updateUserRepository,
};