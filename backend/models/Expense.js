const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  splitType: { 
    type: String, 
    enum: ['EQUAL', 'EXACT', 'PERCENTAGE'], 
    default: 'EQUAL' 
  },
  splitDetails: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    percentage: { type: Number }
  }]
});

module.exports = mongoose.model('Expense', ExpenseSchema);