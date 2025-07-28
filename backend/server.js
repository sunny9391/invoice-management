
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Invoice = require('./models/invoice');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});



app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/employeeinvoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/employeeinvoices/:employee', async (req, res) => {
  const employee = req.params.employee.trim().toLowerCase();
  try {
    const empInvoices = await Invoice.find({
      employee: { $regex: new RegExp(`^${employee}$`, 'i') }
    });

    if (empInvoices.length === 0) {
      return res.status(404).json({ message: `No invoices found for employee: ${employee}` });
    }

    res.json(empInvoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/addinvoice', async (req, res) => {
  const { employee, date, amount, description, documentUrl } = req.body;

  if (!employee || !date || !amount || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const latestInvoice = await Invoice.findOne().sort({ id: -1 });
    let nextNumber = 1;

    if (latestInvoice && latestInvoice.id) {
      const match = latestInvoice.id.match(/INV(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const newId = `INV${String(nextNumber).padStart(3, '0')}`;
    const newInvoice = new Invoice({
      id: newId,
      employee,
      date,
      amount: `₹${amount}`,
      description,
      status: 'Pending',
      documentUrl: documentUrl || '',
      reviewedBy: null
    });

    const saved = await newInvoice.save();
    res.status(201).json({ message: 'Invoice submitted', invoice: saved });

  } catch (err) {
    console.error('Error saving invoice:', err);
    res.status(500).json({ message: 'Server error while saving invoice' });
  }
});

app.put('/api/employeeinvoices/byid/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice status updated", invoice: updatedInvoice });
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ message: "Server error while updating invoice" });
  }
});

app.get('/api/employeeinvoices/byid/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    console.error("Error fetching invoice by ID:", err);
    res.status(500).json({ message: "Server error while fetching invoice" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
