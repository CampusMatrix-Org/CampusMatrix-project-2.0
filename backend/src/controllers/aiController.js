import axios from "axios";
import Flashcard from "../models/Flashcard.js";

/**
 * @desc    Generate flashcards using Groq AI (Llama 3.1)
 * @route   POST /api/v1/ai/generate
 */
export const generateFlashcards = async (req, res) => {
  try {
    const { notes, subject } = req.body;

    if (!notes) {
      return res.status(400).json({ success: false, message: "Please provide notes." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const modelUrl = "https://api.groq.com/openai/v1/chat/completions";

    const prompt = `
      Act as an expert educator. Convert the following lecture notes into a structured JSON object.
      The object must contain a key named "cards" which is an array of flashcard objects.
      Each flashcard object MUST have exactly two fields: "question" and "answer".
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

    const aiContent = response.data.choices[0].message.content;
    const parsedData = JSON.parse(aiContent);

    // Dynamic extraction logic
    let rawCards = [];
    if (parsedData.cards && Array.isArray(parsedData.cards)) {
      rawCards = parsedData.cards;
    } else if (parsedData.flashcards && Array.isArray(parsedData.flashcards)) {
      rawCards = parsedData.flashcards;
    } else {
      const firstArrayKey = Object.keys(parsedData).find((key) => Array.isArray(parsedData[key]));
      if (firstArrayKey) rawCards = parsedData[firstArrayKey];
    }

    if (rawCards.length === 0) {
      throw new Error("AI failed to return an array of cards.");
    }

    const flashcardsToSave = rawCards
      .map((card) => {
        const q = card.question || card.Question || card.q || card.text;
        const a = card.answer || card.Answer || card.a || card.definition;

        if (!q || !a) return null;

        return {
          question: q.trim(),
          answer: a.trim(),
          userId: req.user.id,
          subject: subject || "General",
          nextReviewDate: new Date(),
        };
      })
      .filter((card) => card !== null);

    if (flashcardsToSave.length === 0) {
      throw new Error("No valid question-answer pairs found.");
    }

    // Database save
    const savedCards = await Flashcard.insertMany(flashcardsToSave);

    // --- Terminal Log  ---
    console.log(`✅ Success: ${savedCards.length} flashcards saved for user ${req.user.id}`);

    res.status(201).json({
      success: true,
      count: savedCards.length,
      data: savedCards,
    });

  } catch (error) {
    console.error("❌ GROQ_ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "AI process failed.",
      error: error.message
    });
  }
};

/**
 * @desc    Update flashcard review stats
 * @route   PUT /api/v1/ai/review
 */
export const updateFlashcardReview = async (req, res) => {
  try {
    const { cardId, difficulty } = req.body;

    const card = await Flashcard.findById(cardId);
    if (!card) {
      return res.status(404).json({ success: false, message: "Flashcard not found." });
    }

    let newInterval = card.interval || 0;

    if (difficulty === "easy") {
      newInterval = newInterval === 0 ? 4 : newInterval * 2.5;
    } else if (difficulty === "good") {
      newInterval = newInterval === 0 ? 1 : newInterval * 1.5;
    } else if (difficulty === "hard") {
      newInterval = newInterval === 0 ? 0.2 : newInterval * 1.2;
    } else {
      newInterval = 0;
    }

    card.interval = newInterval;
    card.nextReviewDate = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
    
    await card.save();

    console.log(`Updated Review: Card ${cardId} next review in ${newInterval} days.`);

    res.status(200).json({
      success: true,
      nextReviewDate: card.nextReviewDate,
      interval: card.interval,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};