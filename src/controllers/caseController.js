const caseService = require('../services/caseService');
const logger = require('../utils/logger');

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No CSV file attached');
    }
    logger.info('Received CSV file upload request');
    const insertedCount = await caseService.processCSV(req.file.path);
    res.status(200).json({ message: 'CSV processed successfully', insertedCount });
    logger.info('CSV processed successfully');
  } catch (error) {
    logger.error(`Error processing CSV: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await caseService.getCases(req);
    const formattedCases = cases.data.map(caseItem => {
      return {
        caseId: caseItem.case_id,
        notificationDate: caseItem.notification_date,
        ticketNumber: caseItem.ticket_number,
        logisticsGuideNumber: caseItem.logistics_guide_number,
        trackingNumber: caseItem.tracking_number,
        requirement: caseItem.requirement,
        customerName: caseItem.customer_name,
        customerAddress: caseItem.customer_address,
        customerPhoneNumber: caseItem.customer_phone_number,
        customerEmail: caseItem.customer_email,
        customerPostalCode: caseItem.customer_postal_code,
        status: caseItem.status,
        retailer: {
          id: caseItem.retailer_id,
          name: caseItem.retailer_name,
        },
        hub: {
          id: caseItem.hub_id,
          name: caseItem.hub_name,
          address: caseItem.address,
        },
        courier: {
          id: caseItem.courier_id,
          name: caseItem.courier_name,
          address: caseItem.courier_address,
          phone_number: caseItem.courier_phone_number
        },
        
      };
    });
    res.status(200).json({
      data: formattedCases,
      pagination: cases.pagination,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCase = async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  try {
    const updatedCase = await caseService.updateCase(id, fields);
    res.status(200).json(updatedCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.deleteCase = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCase = await caseService.deleteCase(id);
    res.status(200).json({ message: 'Case deleted', case: deletedCase });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}