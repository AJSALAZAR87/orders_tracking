const stateModel = require('../models/states');

const getAllStates = async () => {
  return await stateModel.getAllStates();
}

module.exports = {
  getAllStates
}