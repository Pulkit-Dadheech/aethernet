import { useEffect, useState } from "react";

export default function SuggestionBox({ data }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await fetch("/api/ai-suggestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: data.age,
          aqi: data.aqi,
          asthma: data.asthma,
          smoker: data.smoker,
          heartIssues: data.heartIssues,
          diabetes: data.diabetes,
          exercise: data.exercise,
        }),
      });
      const result = await response.json();

      // If suggestion is a string with newlines or numbered points, split accordingly
      let parsed = [];
      if (Array.isArray(result.suggestion)) {
        parsed = result.suggestion;
      } else if (typeof result.suggestion === "string") {
        // Try to split by numbered points or newlines
        parsed = result.suggestion
          .split(/\n+|\d+\.\s/)
          .map(s => s.trim())
          .filter(Boolean);
      }
      setSuggestions(parsed);
      setLoading(false);
    }

    fetchData();
  }, [data]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-blue-50 p-8 rounded-2xl shadow-lg text-gray-800 mt-6">
      <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        Health Suggestions Based on Your Inputs
      </h3>
      {loading ? (
        <div className="text-center py-8 text-blue-600 font-semibold">Loading suggestions...</div>
      ) : (
        <ol className="space-y-6 list-decimal list-inside">
          {suggestions.map((s, i) => (
            <li key={i} className="bg-white/80 rounded-lg p-4 shadow text-base leading-relaxed border border-blue-100">
              {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
