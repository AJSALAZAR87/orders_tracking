const retailerService = require('../services/retailerService');

const getAllRetailers = async (req, res) => {
  try {
      const retailers = await retailerService.getAllRetailers();
      res.status(200).json({
        data: retailers
      });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getRetailersById = async (req, res) => {
  const { id } = req.params;
  try {
    const retailer = await retailerService.getRetailersById(id);
    if (retailer.length === 0) {
      return res.status(404).json({ error: 'No retailer found' });
    }
    res.status(200).json({
      data: retailer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const insertRetailer = async (req, res) => {
  const retailerData = req.body;
  try {
    const newRetailer = await retailerService.insertRetailer(retailerData);
    res.status(201).json(newRetailer); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateRetailer = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedRetailer = await retailerService.updateRetailer(id, updatedData);
    res.status(200).json(updatedRetailer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const deleteRetailer = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRetailer = await retailerService.deleteRetailer(id);
    res.status(200).json({ message: 'Retailer deleted', deletedRetailer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllRetailers,
  getRetailersById,
  insertRetailer,
  updateRetailer,
  deleteRetailer,
};