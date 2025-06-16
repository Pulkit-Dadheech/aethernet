import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function getCoords(cityName) {
  const geoRes = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
  );
  const geoData = geoRes.data[0];
  if (!geoData) return null;
  return { lat: geoData.lat, lon: geoData.lon, name: geoData.name };
}