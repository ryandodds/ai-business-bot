// Import the tools we installed
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { handleChat } = require('./agent/handler');

// Create the server
const app = express();

// Middleware - these let the server handle different types of data
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Test route - just to make sure the server works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Chat endpoint - this is where messages come in
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received message:', req.body.message);
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Send message to AI agent
    const response = await handleChat(message, conversationHistory || []);
    console.log('Sending response back to client:', response);
    res.json(response);

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
