const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  id: String,
  employee: String,
  date: String,
  amount: String,
  description: String,
  status: String,
  documentUrl: String,
  reviewedBy: {
    type: String,
    default: null 
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema, 'collection');
