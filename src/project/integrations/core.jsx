export async function InvokeLLM({
  prompt,
  add_context_from_internet = false,
  response_json_schema = null
}) {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  if (!API_KEY) {
    console.warn("⚠️ Gemini API Key not found. Check your .env file.");
    throw new Error("Missing Gemini API key.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const systemInstructions = add_context_from_internet
    ? "Use your knowledge and information from the internet to make suggestions current and practical."
    : "Rely only on your internal knowledge.";

  const finalPrompt = response_json_schema
    ? `${systemInstructions}\n\nRespond ONLY with valid JSON following this schema:\n${JSON.stringify(
        response_json_schema,
        null,
        2
      )}\n\nPrompt:\n${prompt}`
    : `${systemInstructions}\n\n${prompt}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: finalPrompt }]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  // ✅ Clean and parse JSON if schema is expected
  if (response_json_schema) {
    const cleanedResponse = responseText
      .replace(/```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    try {
      return JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("❌ Failed to parse JSON response from Gemini:", cleanedResponse);
      throw new Error("Invalid JSON format received from Gemini.");
    }
  }

  // ✅ Return raw text if no schema
  return responseText;
}
