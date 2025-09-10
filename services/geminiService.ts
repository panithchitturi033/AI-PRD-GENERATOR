import { GoogleGenAI, Type } from "@google/genai";
import type { PRD } from '../types';

const prdSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A clear, concise title for the product or feature." },
    introduction: {
      type: Type.OBJECT,
      properties: {
        problemStatement: { type: Type.STRING, description: "What is the core problem this product solves for the user?" },
        solution: { type: Type.STRING, description: "How does this product solve the problem? A high-level overview." },
        targetAudience: { type: Type.STRING, description: "Who are the primary users of this product?" },
      },
      required: ["problemStatement", "solution", "targetAudience"],
    },
    userPersonas: {
      type: Type.ARRAY,
      description: "Fictional characters representing the target users.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          demographics: { type: Type.STRING, description: "Age, occupation, location, etc." },
          goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What this persona wants to achieve." },
          frustrations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "What pain points this persona has." },
        },
        required: ["name", "demographics", "goals", "frustrations"],
      },
    },
    features: {
      type: Type.ARRAY,
      description: "A list of key features for the product.",
      items: {
        type: Type.OBJECT,
        properties: {
          featureName: { type: Type.STRING },
          description: { type: Type.STRING, description: "What the feature is and the value it provides." },
          userStories: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Stories in the format 'As a [user], I want [goal], so that [benefit]'." },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["featureName", "description", "userStories", "priority"],
      },
    },
    nonFunctionalRequirements: {
      type: Type.ARRAY,
      description: "Requirements that define system attributes such as performance, security, and reliability.",
      items: {
        type: Type.OBJECT,
        properties: {
          requirement: { type: Type.STRING, description: "e.g., Performance, Security, Scalability" },
          details: { type: Type.STRING, description: "Specifics of the requirement." },
        },
        required: ["requirement", "details"],
      },
    },
    successMetrics: {
      type: Type.ARRAY,
      description: "Key Performance Indicators (KPIs) to measure the product's success.",
      items: { type: Type.STRING },
    },
  },
  required: ["title", "introduction", "userPersonas", "features", "nonFunctionalRequirements", "successMetrics"],
};


export const generatePRD = async (idea: string): Promise<PRD> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Based on the following product idea, generate a comprehensive Product Requirements Document (PRD).
    Act as a senior product manager creating a clear, concise, and well-structured document for your engineering and design teams.
    Flesh out the details logically and professionally. Ensure user stories are correctly formatted.

    Product Idea: "${idea}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: prdSchema,
      },
    });

    const jsonText = response.text.trim();
    // It is good practice to parse in a try-catch, even with schema enforcement.
    const parsedPrd: PRD = JSON.parse(jsonText);
    return parsedPrd;
  } catch (error) {
    console.error("Error generating or parsing PRD from Gemini API:", error);
    // You can re-throw a more specific error or handle it as needed.
    throw new Error("Failed to get a valid PRD from the AI model.");
  }
};