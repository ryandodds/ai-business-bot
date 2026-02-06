const functions = [
  {
    name: "get_upcoming_events",
    description: "Get detailed information about upcoming club events and speakers",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "get_club_info",
    description: "Get general information about the club (meeting times, how to join, etc)",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "purchase_tickets",
    description: "Process payment for fundraiser event tickets. Call this only after confirming the number of tickets and email with the student.",
    parameters: {
      type: "object",
      properties: {
        event_id: {
          type: "string",
          description: "The ID of the event (e.g., 'spring-mixer')"
        },
        quantity: {
          type: "number",
          description: "Number of tickets to purchase"
        },
        email: {
          type: "string",
          description: "Student's email address for receipt and ticket delivery"
        }
      },
      required: ["event_id", "quantity", "email"]
    }
  }
];

module.exports = { functions };