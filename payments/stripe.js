const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Use the existing payment link for the Spring Networking Mixer
const MIXER_PAYMENT_LINK = 'https://buy.stripe.com/test_aFa9ASer65SaaTafbq5Vu02';

async function createPaymentLink(eventId, quantity, email, totalAmount) {
  // For the mixer event, just return the existing payment link
  // Note: Stripe payment links don't support dynamic quantities via URL
  // So we'll return the link and note the quantity in our message
  
  return {
    success: true,
    checkout_url: MIXER_PAYMENT_LINK,
    total: totalAmount,
    quantity: quantity
  };
}

// Verify a payment was successful
async function verifyPayment(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === 'paid',
      amount: session.amount_total / 100,
      email: session.customer_email
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { paid: false, error: error.message };
  }
}

module.exports = {
  createPaymentLink,
  verifyPayment
};