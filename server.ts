import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom user agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// "Things to Do" API powered by server-side Gemini 3.5 Flash
app.post("/api/suggestions", async (req, res) => {
  const { city } = req.body;
  
  if (!city) {
    return res.status(400).json({ error: "Missing required parameter 'city'" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide curated tourist recommendations for things to do in the city of '${city}'. Help travelers find top sights, local experiences, and dining options.`,
      config: {
        systemInstruction: "You are an expert global travel guide specialized in TripAdvisor-style curated recommendations. Provide outstanding local suggestions including pricing notes, brief locations, and unique details.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            attractions: {
              type: Type.ARRAY,
              description: "Must-see highlights and structural landmarks in the area.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Display title of the attraction" },
                  description: { type: Type.STRING, description: "Overview of what makes it legendary." },
                  category: { type: Type.STRING, description: "Category tag like Sight, Nature, Gallery" }
                },
                required: ["name", "description", "category"]
              }
            },
            restaurants: {
              type: Type.ARRAY,
              description: "Legendary spots or must-try local gastronomy.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Restaurant name" },
                  description: { type: Type.STRING, description: "What to order and atmosphere." },
                  cuisine: { type: Type.STRING, description: "Cuisine type like Traditional, Fine Dining, Seafood" }
                },
                required: ["name", "description", "cuisine"]
              }
            },
            activities: {
              type: Type.ARRAY,
              description: "Experiences, local walks, wellness, active excursions, or day guides.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Experience title" },
                  description: { type: Type.STRING, description: "Specific timeline or details." },
                  type: { type: Type.STRING, description: "Type of activity, like Outdoors, Food Walk, Historical" }
                },
                required: ["name", "description", "type"]
              }
            }
          },
          required: ["attractions", "restaurants", "activities"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response returned from Gemini API");
    }

    const resultData = JSON.parse(textOutput.trim());
    return res.json(resultData);
  } catch (error: any) {
    console.error("Gemini Suggestions Error:", error);
    return res.status(500).json({
      error: "Could not retrieve travel suggestions at this moment",
      details: error?.message || String(error)
    });
  }
});

// Configure Vite middleware or production static files asset serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
