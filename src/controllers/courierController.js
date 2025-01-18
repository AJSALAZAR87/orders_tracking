const courierService = require('../services/courierService');


const getAllCouriers = async (req, res) => {
  try {
      const couriers = await courierService.getAllCouriers();
      res.status(200).json({
        data: couriers
      });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getCouriersById = async (req, res) => {
  const { id } = req.params;
  try {
    const courier = await courierService.getCouriersById(id);
    if (courier.length === 0) {
      return res.status(404).json({ error: 'No courier found' });
    }
    res.status(200).json({
      data: courier
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const insertCourier = async (req, res) => {
  const courierData = req.body;
  try {
    const newCourier = await courierService.createCourier(courierData);
    res.status(201).json(newCourier); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateCourier = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedCourier = await courierService.updateCourier(id, updatedData);
    res.status(200).json(updatedCourier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const deleteCourier = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourier = await courierService.deleteCourier(id);
    res.status(200).json({ message: 'Courier deleted', deletedCourier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllCouriers,
  getCouriersById,
  insertCourier,
  updateCourier,
  deleteCourier,
};