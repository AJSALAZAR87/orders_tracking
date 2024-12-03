const csvParser = require('csv-parser');
const fs = require('fs');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const cases = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        cases.push({
          station_name: row['Station'],
          notification_date: row['Notification date'],
          ticket_number: row['Ticket number'],
          logistics_guide_number: row['Logistics guide number'],
          retailer_name: row['Retailer'],
          tracking_number: row['Tracking number'],
          customer_name: row['Customer name'],
          customer_address: row['Customer address'],
          requirement: row['Requirement'],
          courier_name: row['Courier name'],
          customer_phone_number: row['Customer phone number'],
          customer_email: row['Customer email'],
          customer_postal_code: row['Customer postal code'],
        });
      })
      .on('end', () => resolve(cases))
      .on('error', (err) => reject(err));
  });
};

module.exports = {
  parseCSV,
};