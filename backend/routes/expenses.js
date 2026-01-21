const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const User = require('../models/User'); 
const sendExpenseNotification = require('../utils/emailService');

// Helper: Validate Splits
const validateSplit = (amount, splitType, splitDetails) => {
  if (splitType === 'PERCENTAGE') {
    const totalPercent = splitDetails.reduce((sum, item) => sum + Number(item.percentage), 0);
    if (Math.abs(totalPercent - 100) > 0.1) return 'Percentages must equal 100%';
  } else if (splitType === 'EXACT') {
    const totalAmount = splitDetails.reduce((sum, item) => sum + Number(item.amount), 0);
    if (Math.abs(totalAmount - amount) > 0.1) return 'Split amounts must equal the total expense amount';
  }
  return null;
};

// ==========================================
// 1. GET GLOBAL BALANCES (The Missing Piece)
// ==========================================
router.get('/balances', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all expenses where user is involved (paid or split)
    const expenses = await Expense.find({
      $or: [
        { paidBy: userId },
        { 'splitDetails.user': userId }
      ]
    });

    let balanceMap = {}; // key: otherUserId, value: amount (+ means they owe you, - means you owe them)

    expenses.forEach(expense => {
      const paidByMe = expense.paidBy.toString() === userId;
      
      if (paidByMe) {
        // I paid, so others owe me their split amounts
        expense.splitDetails.forEach(detail => {
          if (detail.user.toString() !== userId) {
            let amount = 0;
            if (expense.splitType === 'EQUAL') {
              amount = expense.amount / expense.splitDetails.length;
            } else if (expense.splitType === 'EXACT') {
              amount = detail.amount;
            } else if (expense.splitType === 'PERCENTAGE') {
              amount = (expense.amount * detail.percentage) / 100;
            }
            
            // Add to what they owe me
            const otherId = detail.user.toString();
            balanceMap[otherId] = (balanceMap[otherId] || 0) + amount;
          }
        });
      } else {
        // Someone else paid, I owe them my split amount
        const mySplit = expense.splitDetails.find(d => d.user.toString() === userId);
        if (mySplit) {
          let amount = 0;
          if (expense.splitType === 'EQUAL') {
            amount = expense.amount / expense.splitDetails.length;
          } else if (expense.splitType === 'EXACT') {
            amount = mySplit.amount;
          } else if (expense.splitType === 'PERCENTAGE') {
            amount = (expense.amount * mySplit.percentage) / 100;
          }

          // Subtract from balance (I owe this)
          const payerId = expense.paidBy.toString();
          balanceMap[payerId] = (balanceMap[payerId] || 0) - amount;
        }
      }
    });

    // Convert map to array for frontend
    // Example: [ { amount: 50 }, { amount: -20 } ]
    const balances = Object.values(balanceMap).map(amount => ({ amount }));
    
    res.json(balances);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CREATE EXPENSE (With Email)
// ==========================================
router.post('/', auth, async (req, res) => {
  try {
    const { description, amount, groupId, splitType, splitDetails, paidBy } = req.body;

    const error = validateSplit(amount, splitType, splitDetails);
    if (error && splitType !== 'EQUAL') return res.status(400).json({ msg: error });

    let finalDetails = splitDetails;
    if (splitType === 'EQUAL') {
       finalDetails = splitDetails.map(id => ({ user: id })); 
    }

    const payerId = paidBy || req.user.id;

    const newExpense = new Expense({
      description,
      amount,
      paidBy: payerId,
      group: groupId,
      splitType,
      splitDetails: finalDetails
    });
    const saved = await newExpense.save();

    // Email Logic
    (async () => {
        try {
            const payer = await User.findById(payerId);
            const userIdsToNotify = finalDetails
                .map(d => d.user)
                .filter(uid => uid.toString() !== payerId.toString());

            if (userIdsToNotify.length === 0) return;

            const usersToNotify = await User.find({ _id: { $in: userIdsToNotify } });

            usersToNotify.forEach(user => {
                let userShare = 0;
                if (splitType === 'EQUAL') userShare = amount / finalDetails.length;
                else if (splitType === 'EXACT') {
                    const detail = finalDetails.find(d => d.user.toString() === user._id.toString());
                    userShare = detail ? detail.amount : 0;
                } else if (splitType === 'PERCENTAGE') {
                    const detail = finalDetails.find(d => d.user.toString() === user._id.toString());
                    userShare = detail ? (amount * detail.percentage) / 100 : 0;
                }

                if (userShare > 0) {
                    sendExpenseNotification(user.email, payer.name, userShare, description);
                }
            });
        } catch (emailErr) {
            console.error("Failed to send emails:", emailErr);
        }
    })();

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. OTHER ROUTES
// ==========================================

// UPDATE Expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { description, amount, splitType, splitDetails, paidBy } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    const error = validateSplit(amount, splitType, splitDetails);
    if (error && splitType !== 'EQUAL') return res.status(400).json({ msg: error });

    let finalDetails = splitDetails;
    if (splitType === 'EQUAL') {
       finalDetails = splitDetails.map(id => ({ user: id })); 
    }

    expense.description = description;
    expense.amount = amount;
    expense.paidBy = paidBy;
    expense.splitType = splitType;
    expense.splitDetails = finalDetails;

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    await expense.deleteOne();
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;