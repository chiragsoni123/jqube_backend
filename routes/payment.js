const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { verifyRole } = require('../middleware/auth'); // For admin history access
const Payment = require('../models/Payment'); // Payment model to save payment history
const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay accepts payments in paise
      currency: currency || 'INR',
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, orderId: order.id, amount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong', error });
  }
});

// Route to verify payment
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  const hash = crypto.createHmac('sha256', secret)
                     .update(razorpay_order_id + '|' + razorpay_payment_id)
                     .digest('hex');

  if (hash === razorpay_signature) {
    // Store payment info in database
    const payment = new Payment({
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: 'successful',
    });

    await payment.save();

    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
