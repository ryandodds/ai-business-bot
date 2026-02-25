const OpenAI = require('openai');
const { getSystemPrompt, loadClubData } = require('./prompts');
const { functions } = require('./functions');
const { createCheckoutSession } = require('../payments/stripe');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Handle incoming chat messages
async function handleChat(userMessage, conversationHistory = []) {
  try {
    console.log('handleChat called with:', userMessage);

    // Build the messages array with system prompt and history
    const messages = [
      { role: "system", content: getSystemPrompt() },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    console.log('Calling OpenAI API...');

    // Call OpenAI API with function calling enabled
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      functions: functions,
      function_call: "auto"
    });

    console.log('OpenAI responded');

    const assistantMessage = response.choices[0].message;

    console.log('Assistant message:', assistantMessage);

    // Check if AI wants to call a function
    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name;
      const functionArgs = JSON.parse(assistantMessage.function_call.arguments);

      // Execute the function
      const functionResult = await executeFunction(functionName, functionArgs);

      // Extract payment session before sending to OpenAI (it doesn't need it)
      let paymentSession = null;
      if (functionResult._paymentSession) {
        paymentSession = functionResult._paymentSession;
        delete functionResult._paymentSession;
      }

      // Send function result back to AI for final response
      const followUpMessages = [
        ...messages,
        assistantMessage,
        {
          role: "function",
          name: functionName,
          content: JSON.stringify(functionResult)
        }
      ];

      const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: followUpMessages
      });

      const result = {
        message: finalResponse.choices[0].message.content,
        functionCalled: functionName,
        functionArgs: functionArgs
      };

      // Attach payment session to outer response so frontend receives it
      if (paymentSession) {
        result.paymentSession = paymentSession;
      }

      return result;
    }

    // No function call - just return the response
    return {
      message: assistantMessage.content,
      functionCalled: null
    };

  } catch (error) {
    console.error('Error in handleChat:', error);
    throw error;
  }
}

// Execute the functions the AI calls
async function executeFunction(functionName, args) {
  const clubData = loadClubData();

  switch (functionName) {
    case "get_upcoming_events":
      return {
        events: clubData.upcoming_events
      };

    case "get_club_info":
      return {
        club_name: clubData.club_name,
        meeting_schedule: clubData.meeting_schedule,
        faqs: clubData.faqs
      };

    case "purchase_tickets":
      console.log('Purchase tickets called with args:', args);
      const totalAmount = clubData.fundraiser.price * args.quantity;

      // Create Stripe embedded checkout session
      const paymentResult = await createCheckoutSession(
        args.event_id,
        args.quantity,
        args.email,
        totalAmount
      );

      console.log('Payment result:', paymentResult);

      if (paymentResult.success) {
        return {
          status: "checkout_session_created",
          quantity: args.quantity,
          total: totalAmount,
          email: args.email,
          message: "The secure checkout form is now displayed below. The customer can complete their payment there.",
          // Store payment session separately — will be stripped before sending to OpenAI
          _paymentSession: {
            clientSecret: paymentResult.clientSecret,
            sessionId: paymentResult.sessionId,
          }
        };
      } else {
        return {
          status: "payment_failed",
          error: paymentResult.error
        };
      }

    default:
      return { error: "Unknown function" };
  }
}

module.exports = { handleChat };
