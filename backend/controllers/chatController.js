const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Faculty } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a helpful and knowledgeable Campus AI assistant for Presidency University, Bengaluru. 
Your goal is to assist students with their questions about the campus, faculty, fees, and administrative procedures.

Campus Info:
- Location: Itagalpur, Rajanakunte, Yelahanka, Bengaluru - 560064.
- University Type: Private University (Established 2013).
- Schools: Engineering (SOE), Management (SOM), Commerce (SOC), Law (SOL), Design (SOD), Info Science (SOIS).

Fee Information (Approximate):
- B.Tech: INR 4,00,000 - 5,00,000 per year.
- MBA: INR 3,50,000 per year.
- LL.B: INR 2,00,000 per year.
- Note: Advise students to contact the Accounts department in the Admin Block for exact fee structures.

Facilities:
- Main Canteen: Located near the entrance, 15+ food counters.
- Library: Central library with 50,000+ books and digital access.
- Hostels: On-campus separate hostels for boys and girls.
- Transport: Extensive bus network from all parts of Bengaluru.

Faculty & Departments:
- L-Block: Engineering (CS, IS, AI, ML).
- S-Block: Management, Commerce, Law.
- Admin Block: Registration, Accounts, VP Office.

Response Guidelines:
- Be professional, friendly, and concise.
- If you don't know the answer, refer them to the helpdesk at Gate 2.
- For faculty status, mention that current status can be checked in the "Navigator".
- Use bullet points for lists.`;

exports.chat = async (req, res) => {
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chatSession = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
      },
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am now the Presidency University Campus Assistant." }] },
        ...history.map(h => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        }))
      ],
    });

    const result = await chatSession.sendMessageStream(message);

    // Set headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to connect to AI server. Check your API Key." });
  }
};
