const caseService = require('../services/caseService');
const logger = require('../utils/logger');

exports.uploadCSV = async (req, res) => {
  try {
    logger.info('Received CSV file upload request');
    await caseService.processCSV(req.file.path);
    res.status(200).json({ message: 'CSV processed successfully' });
    logger.info('CSV processed successfully');
  } catch (error) {
    logger.error(`Error processing CSV: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await caseService.getAllCases(req);
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
        retailer: {
          id: caseItem.retailer_id,
          name: caseItem.retailer_name,
        },
        hub: {
          id: caseItem.hub_id,
          name: caseItem.hub_name,
          location: caseItem.hub_location,
        },
        courier: {
          id: caseItem.courier_id,
          name: caseItem.courier_name,
          address: caseItem.courier_address,
        },
        // Include other case fields as needed
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