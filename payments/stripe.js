const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(eventId, quantity, email, totalAmount) {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Spring Networking Mixer Ticket',
            },
            unit_amount: 1500, // $15.00 in cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      customer_email: email,
      return_url: `${process.env.BASE_URL || 'http://localhost:3000'}/#/checkout-complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    return {
      success: true,
      clientSecret: session.client_secret,
      sessionId: session.id,
      total: totalAmount,
      quantity: quantity,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message };
  }
}

// Verify a payment was successful
async function verifyPayment(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.status,
      paid: session.payment_status === 'paid',
      amount: session.amount_total / 100,
      email: session.customer_email,
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { paid: false, error: error.message };
  }
}

module.exports = {
  createCheckoutSession,
  verifyPayment,
};
