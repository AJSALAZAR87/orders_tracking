const statesService = require('../services/stateService');

const getAllStates = async (req, res) => {
  try {
      const states = await statesService.getAllStates(req);
      res.status(200).json({
        data: states,
      });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllStates
}