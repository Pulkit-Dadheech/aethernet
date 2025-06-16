export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return Response.json({ suggestion: "Invalid or missing JSON body." }, { status: 400 });
  }

  const { age, aqi, asthma, smoker, heartIssues, diabetes, exercise } = body;

  const { OPENROUTER_API_KEY } = process.env;
  if (!OPENROUTER_API_KEY) {
    return Response.json({ suggestion: "API key missing." }, { status: 500 });
  }

  const healthSummary = `
    Age: ${age}
    AQI: ${4}
    Asthma: ${asthma ? "Yes" : "No"}
    Smoker: ${smoker ? "Yes" : "No"}
    Heart Issues: ${heartIssues ? "Yes" : "No"}
    Diabetes: ${diabetes ? "Yes" : "No"}
    Exercise Frequency: ${exercise}
  `;

  const prompt = `
    Based on the following health and air quality data that i get from openweathermap api, give a short, friendly, and clear health suggestion.
    Respond in 4-5 bullet points, each point should be 1-2 sentences and helpful:
    
    ${healthSummary}
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      let errorMsg = "Failed to fetch suggestion from AI.";
      try {
        const errorData = await response.json();
        errorMsg = errorData.error?.message || errorMsg;
      } catch {}
      return Response.json({ suggestion: errorMsg }, { status: 500 });
    }

    const data = await response.json();

    return Response.json({
      suggestion: data.choices?.[0]?.message?.content ?? "No suggestion generated.",
    });
  } catch (error) {
    return Response.json({ suggestion: "Failed to fetch suggestion." }, { status: 500 });
  }
}
