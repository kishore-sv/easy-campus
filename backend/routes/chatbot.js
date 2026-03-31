const express = require('express');
const router = express.Router();
const { Faculty, Event } = require('../models');

router.post('/query', async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();

    // 1. Where is [Faculty Name]?
    if (lowerMsg.includes("where is") || lowerMsg.includes("location of")) {
      const faculty = await Faculty.find();
      const match = faculty.find(f => lowerMsg.includes(f.name.toLowerCase()));
      if (match) {
        return res.json({ 
          response: `${match.name}'s office is at ${match.location} (Cabin ${match.cabin}). Their current status is: ${match.status}.` 
        });
      }
      return res.json({ response: "I couldn't find that faculty member. Can you check the name?" });
    }

    // 2. Events this week?
    if (lowerMsg.includes("event") || lowerMsg.includes("happenings")) {
      const events = await Event.find().limit(3);
      if (events.length > 0) {
        let response = "Here are the upcoming events: \n";
        events.forEach(e => {
          response += `- ${e.title} at ${e.venue} on ${new Date(e.date).toDateString()}\n`;
        });
        return res.json({ response });
      }
      return res.json({ response: "There are no major events scheduled for this week!" });
    }

    // 3. Holiday?
    if (lowerMsg.includes("holiday") || lowerMsg.includes("tomorrow")) {
      return res.json({ response: "According to the official calendar, tomorrow is a regular working day for all departments." });
    }

    // 4. Default FAQs
    if (lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
      return res.json({ response: "Hello! I am the Easy Campus AI Assistant. I can help you find faculty, locate classrooms, check events, or track your food orders. How can I assist you today?" });
    }

    if (lowerMsg.includes("canteen") || lowerMsg.includes("food")) {
      return res.json({ response: "The main canteen is in the Ground Floor of M Block. You can also order food through this app!" });
    }

    // Extensibility for OpenAI later
    res.json({ response: "I'm still learning! For now, try asking about faculty, events, or general campus info." });
  } catch (error) {
    res.status(500).json({ message: "Chatbot error: " + error.message });
  }
});

module.exports = router;
