const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const User = require('../models/User');

// Create Group
router.post('/', auth, async (req, res) => {
  try {
    const { name, members } = req.body;
    const uniqueMembers = [...new Set([...members, req.user.id])];
    const group = new Group({ name, creator: req.user.id, members: uniqueMembers });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Group Details
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name');
    const expenses = await Expense.find({ group: req.params.id }).populate('paidBy', 'name').sort({ date: -1 });
    res.json({ group, expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// *** LEVEL 3: SETTLEMENT ALGORITHM ***
router.get('/:id/balances', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.id });
    const group = await Group.findById(req.params.id);
    let netBalance = {}; 
    
    // Initialize 0 balance for everyone
    group.members.forEach(m => netBalance[m.toString()] = 0);

    // Calculate how much everyone paid vs what they should have paid
    expenses.forEach(exp => {
      const payerId = exp.paidBy.toString();
      netBalance[payerId] += exp.amount; // They paid, so they are owed this back initially

      if (exp.splitType === 'EQUAL') {
        const splitAmount = exp.amount / exp.splitDetails.length; // Actually splitDetails contains participants here
        exp.splitDetails.forEach(detail => {
             // In EQUAL mode, detail.user is the ID
            const uid = detail.user ? detail.user.toString() : detail.toString();
            netBalance[uid] -= splitAmount;
        });
      } else if (exp.splitType === 'EXACT') {
        exp.splitDetails.forEach(detail => {
          netBalance[detail.user.toString()] -= detail.amount;
        });
      } else if (exp.splitType === 'PERCENTAGE') {
        exp.splitDetails.forEach(detail => {
          const amountOwed = (exp.amount * detail.percentage) / 100;
          netBalance[detail.user.toString()] -= amountOwed;
        });
      }
    });

    // Optimization Logic
    let debtors = [];
    let creditors = [];
    for (const [userId, amount] of Object.entries(netBalance)) {
      if (amount < -0.01) debtors.push({ userId, amount });
      if (amount > 0.01) creditors.push({ userId, amount });
    }

    const optimizedPayments = [];
    let i = 0; let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amountToSettle = Math.min(Math.abs(debtor.amount), creditor.amount);

      const fromUser = await User.findById(debtor.userId);
      const toUser = await User.findById(creditor.userId);

      optimizedPayments.push({
        from: fromUser.name,
        to: toUser.name,
        amount: parseFloat(amountToSettle.toFixed(2))
      });

      debtor.amount += amountToSettle;
      creditor.amount -= amountToSettle;

      if (Math.abs(debtor.amount) < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
    res.json(optimizedPayments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;