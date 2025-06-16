"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";

export default function MultipleLocationPage() {
  const [search, setSearch] = useState("");
  const [savedCities, setSavedCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved cities
  async function fetchSavedCities() {
    const res = await fetch("/api/favorites");
    const data = await res.json();
    setSavedCities(data);
  }

  useEffect(() => {
    fetchSavedCities();
  }, []);

  // Save new cities (comma-separated)
  async function handleSave() {
    const cities = search
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (cities.length === 0) {
      alert("Please enter at least one city name.");
      return;
    }

    setLoading(true);
    let anySaved = false;
    for (const city of cities) {
      // Check if already exists
      if (savedCities.some((c) => c.cityName.toLowerCase() === city.toLowerCase())) {
        continue;
      }
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName: city }),
      });
      if (res.ok) anySaved = true;
    }
    setLoading(false);
    if (anySaved) {
      alert("City/cities saved!");
      fetchSavedCities();
    } else {
      alert("No new cities were saved (duplicates skipped).");
    }
    setSearch("");
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Favorite Cities</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          type="text"
          placeholder="Enter city names (comma separated)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {savedCities.map((city) => (
          <button
            key={city._id}
            className="bg-gray-200 hover:bg-blue-100 px-3 py-1 rounded"
            // You can add onClick to do something with the city
          >
            {city.cityName}
          </button>
        ))}
      </div>
    </div>
  );
}
