'use client';
import React, { useState } from "react";
import SuggestionBox from "./SuggestionBox";
import "../globals.css";

export default function AiSuggestionPage({ location, aqi }) {
  const [formData, setFormData] = useState({
    age: "",
    asthma: false,
    smoker: false,
    heartIssues: false,
    diabetes: false,
    exercise: 'none'
  });

  const [showSuggestion, setShowSuggestion] = useState(false);
  const [ageError, setAgeError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === "age") {
      if (!value || isNaN(value) || value < 1 || value > 120) {
        setAgeError("Please enter a valid age (1-120).");
      } else {
        setAgeError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      setAgeError("Please enter a valid age (1-120).");
      return;
    }
    setShowSuggestion(true);
  };

  return (
    <div className="w-[85%] mx-auto">
    <div className="w-full mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Personalized AQI Health Suggestion</h2>
      <p className="text-center text-gray-500 mb-4">Fill in your details to get tailored air quality health advice.</p>
      <div className="border-b border-gray-200 mb-4" />

      {!showSuggestion && (
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Age <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${ageError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your age"
              min="1"
              max="120"
              required
            />
            {ageError && <p className="text-red-500 text-sm mt-1">{ageError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="asthma"
                checked={formData.asthma}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span className="text-gray-700">Asthma</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="smoker"
                checked={formData.smoker}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span className="text-gray-700">Smoker</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="heartIssues"
                checked={formData.heartIssues}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span className="text-gray-700">Heart Issues</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="diabetes"
                checked={formData.diabetes}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span className="text-gray-700">Diabetes</span>
            </label>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Exercise Frequency</label>
            <select
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="none">Rarely / None</option>
              <option value="moderate">Few times a week</option>
              <option value="active">Daily</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
            disabled={!formData.age || !!ageError}
          >
            Get Suggestions
          </button>
        </form>
      )}

      {showSuggestion && (
        <SuggestionBox data={{ ...formData, aqi }} />
      )}
    </div>
    </div>
  );
}
