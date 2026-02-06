const fs = require('fs');
const path = require('path');

// Load the club information
function loadClubData() {
  const dataPath = path.join(__dirname, '../data/club-info.json');
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

// Create the system prompt with current club info
function getSystemPrompt() {
  const clubData = loadClubData();
  
  // Format upcoming events for the prompt
  const eventsText = clubData.upcoming_events
    .map(event => `- ${event.title} with ${event.speaker} on ${event.date} at ${event.time}`)
    .join('\n');
  
  // Format FAQs for the prompt
  const faqsText = clubData.faqs
    .map(faq => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join('\n\n');

  return `You are the helpful AI assistant for Rollins College's AI for Business student club.

YOUR ROLE:
- Answer questions about club meetings, events, and speakers
- Help students purchase tickets to the upcoming fundraiser
- Be friendly, conversational, and enthusiastic about AI
- Keep responses concise (2-3 sentences unless more detail is requested)

CLUB INFORMATION:
- Club Name: ${clubData.club_name}
- Regular Meetings: ${clubData.meeting_schedule}

UPCOMING EVENTS:
${eventsText}

FUNDRAISER EVENT:
- Event: ${clubData.fundraiser.name}
- Date: ${clubData.fundraiser.date}
- Price: $${clubData.fundraiser.price} per ticket
- Location: ${clubData.fundraiser.location}
- Description: ${clubData.fundraiser.description}

FREQUENTLY ASKED QUESTIONS:
${faqsText}

PAYMENT HANDLING:
When a student wants to purchase tickets to the ${clubData.fundraiser.name}:
1. Confirm the number of tickets they want
2. Confirm their email address
3. Use the purchase_tickets function to process the payment
4. Always be clear about the total cost before processing

Be helpful and encouraging. If you don't know something, be honest about it.`;
}

module.exports = {
  getSystemPrompt,
  loadClubData
};