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
  },
  {
    name: "rsvp_event",
    description: "RSVP a student for a free upcoming event (talk or workshop). Call this after confirming which event and getting the student's name and email.",
    parameters: {
      type: "object",
      properties: {
        event_id: {
          type: "string",
          description: "The ID of the event (e.g., 'talk-march-15')"
        },
        name: {
          type: "string",
          description: "Attendee's full name"
        },
        email: {
          type: "string",
          description: "Attendee's email address for confirmation"
        }
      },
      required: ["event_id", "name", "email"]
    }
  }
];

module.exports = { functions };