import axios from "axios";
import { getCoords } from "@/utils/getCoords";

const WAQI_API_KEY = process.env.WAQI_API_KEY;
let cache = {};
let cacheExpiry = {};

export async function POST(request) {
  const { location, lat, lon } = await request.json();

  if (!location && (!lat || !lon)) {
    return new Response(JSON.stringify({ error: 'Location or coordinates are required' }), { status: 400 });
  }

  // Calculate next midnight
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);

  // Check cache
  if (
    cache[location] &&
    cacheExpiry[location] &&
    cacheExpiry[location] > now.getTime()
  ) {
    return new Response(JSON.stringify(cache[location]));
  }

  try {
    let coords = { lat, lon };
    if (!lat || !lon) {
      coords = await getCoords(location);
    }
    if (!coords) {
      return new Response(JSON.stringify({ error: 'Location not found' }), { status: 404 });
    }

    // Fetch AQI data from WAQI API
    const aqiRes = await axios.get(
      `https://api.waqi.info/feed/geo:${coords.lat};${coords.lon}/?token=${WAQI_API_KEY}`
    );
    const data = aqiRes.data.data;

    if (!data) {
      return new Response(JSON.stringify({ error: 'No data available for this location' }), { status: 404 });
    }

    const result = {
      name: data.city.name,
      aqi: data.aqi,
      pm2_5: data.iaqi.pm25?.v || '--',
      pm10: data.iaqi.pm10?.v || '--',
      no2: data.iaqi.no2?.v || '--',
      so2: data.iaqi.so2?.v || '--',
      co: data.iaqi.co?.v || '--',
      o3: data.iaqi.o3?.v || '--',
    };

    // Set cache
    cache[location] = result;
    cacheExpiry[location] = nextMidnight.getTime();

    return new Response(JSON.stringify(result));
  } catch (err) {
    console.error('Error fetching WAQI data:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}
