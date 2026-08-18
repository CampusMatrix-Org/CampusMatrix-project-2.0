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
        model: "openai/gpt-oss-20b",
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
    console.error("Groq Flashcards Error Details:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.error?.message || error.message 
    });
  }
};

/**
 * @desc    Get all saved flashcards
 * @route   GET /api/v1/flashcards
 */
export const getFlashcards = async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.user.id });
    const formatted = cards.map((c, i) => ({
      id: c._id,
      deck: c.subject || "General",
      question: c.question,
      answer: c.answer
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Save flashcards array
 * @route   POST /api/v1/flashcards
 */
export const saveFlashcards = async (req, res) => {
  try {
    const cardsArray = req.body; // Expects an array of flashcards
    const toSave = cardsArray.map(c => ({
      question: c.question,
      answer: c.answer,
      subject: c.deck || "General",
      userId: req.user.id
    }));

    await Flashcard.insertMany(toSave);
    res.status(201).json({ success: true, message: "Flashcards saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a flashcard
 * @route   DELETE /api/v1/flashcards/:id
 */
export const deleteFlashcard = async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Flashcard deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Generate a structured study plan using AI
 * @route   POST /api/v1/ai/study-plan/generate
 */
export const generateStudyPlan = async (req, res) => {
  try {
    const { targetDate, intensity, commitment, documentIds } = req.body;

    const apiKey = process.env.GROQ_API_KEY;
    const modelUrl = "https://api.groq.com/openai/v1/chat/completions";

    const prompt = `
      Act as an academic planner. Create a study plan based on:
      Target Date: ${targetDate}, Intensity: ${intensity}, Commitment: ${commitment}.
      Output a valid JSON object with a key named "tasks" containing an array of task objects.
      Each item in the array must strictly match this format:
      {
        "id": 1,
        "title": "string",
        "description": "string",
        "status": "to-do",
        "priority": "medium",
        "dueDate": "${targetDate || new Date().toISOString()}",
        "type": "task",
        "target": "A"
      }
    `;

    const response = await axios.post(
      modelUrl,
      {
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "You are a helpful assistant that outputs only valid JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const parsedData = JSON.parse(response.data.choices[0].message.content);
    const tasks = parsedData.tasks || parsedData.plan || [];

    // Map each item to guarantee integer id as requested by OpenAPI
    const formattedTasks = tasks.map((task, idx) => ({
      id: task.id || Date.now() + idx,
      title: task.title || "Study Session",
      description: task.description || "",
      status: task.status || "to-do",
      priority: task.priority || "medium",
      dueDate: task.dueDate || targetDate,
      type: task.type || "task",
      target: task.target || ""
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Groq API Error Details (Study Plan):", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.error?.message || error.message 
    });
  }
};