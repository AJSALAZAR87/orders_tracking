const hubService = require('../services/hubService');

const getAllHubs = async (req, res) => {
  try {
      const hubs = await hubService.getAllHubs();
      res.status(200).json({
        data: hubs
      });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getHubsById = async (req, res) => {
  const { id } = req.params;
  try {
    const hub = await hubService.getHubsById(id);
    if (hub.length === 0) {
      return res.status(404).json({ error: 'No hub found' });
    }
    res.status(200).json({
      data: hub
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const insertHub = async (req, res) => {
  const hubData = req.body;
  try {
    const newHub = await hubService.insertHub(hubData);
    res.status(201).json(newHub); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateHub = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedHub = await hubService.updateHub(id, updatedData);
    res.status(200).json(updatedHub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const deleteHub = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHub = await hubService.deleteHub(id);
    res.status(200).json({ message: 'Hub deleted', deletedHub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllHubs,
  getHubsById,
  insertHub,
  updateHub,
  deleteHub,
};