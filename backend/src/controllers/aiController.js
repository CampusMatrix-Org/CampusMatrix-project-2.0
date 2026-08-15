import axios from "axios";
import Flashcard from "../models/Flashcard.js";

/**
 * @desc    Generate flashcards using Groq AI
 * @route   POST /api/v1/ai/flashcards/generate
 */
export const generateFlashcards = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ success: false, message: "Please provide notes." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const modelUrl = "https://api.groq.com/openai/v1/chat/completions";

    const prompt = `
      Act as an expert educator. Convert the following lecture notes into a structured JSON object.
      The object must contain a key named "cards" which is an array of flashcard objects.
      Each flashcard object MUST have exactly three fields: "question", "answer", and "deck".
      Notes: ${notes}
    `;

    const response = await axios.post(
      modelUrl,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful assistant that outputs only valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const parsedData = JSON.parse(response.data.choices[0].message.content);
    let rawCards = parsedData.cards || parsedData.flashcards || [];

    // Map to OpenAPI contract format
    const formattedCards = rawCards.map((card, index) => ({
      id: Date.now() + index,
      deck: card.deck || "General",
      question: card.question || card.q,
      answer: card.answer || card.a
    }));

    res.status(200).json(formattedCards);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};