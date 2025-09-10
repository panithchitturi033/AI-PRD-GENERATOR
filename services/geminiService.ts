export const generatePRD = async (idea: string): Promise<PRD> => {
  // --- START: Replace with your API Key ---
  const apiKey = "AIzaSyD0TmLVV1ZjAOxBR-yFUc9LmdHZlKNBmSM"; 
  // --- END: Replace with your API Key ---

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    throw new Error("API_KEY not set in geminiService.ts. Please replace 'YOUR_API_KEY_HERE' with your actual API key.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

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
    const parsedPrd: PRD = JSON.parse(jsonText);
    return parsedPrd;
  } catch (error) {
    console.error("Error generating or parsing PRD from Gemini API:", error);
    throw new Error("Failed to get a valid PRD from the AI model.");
  }
};
