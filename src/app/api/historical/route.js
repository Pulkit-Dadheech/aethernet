import { getCoords } from "@/utils/getCoords";

let cache = {};
let cacheExpiry = {};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cityName = searchParams.get('city') || 'delhi';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Calculate next midnight (12:00 AM of the next day)
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(0, 0, 0, 0); // set to today's midnight
  nextMidnight.setDate(nextMidnight.getDate() + 1); // move to next day

  // Check cache
  if (
    cache[cityName] &&
    cacheExpiry[cityName] &&
    cacheExpiry[cityName] > now.getTime()
  ) {
    return Response.json({ results: cache[cityName] });
  }

  try {
    // Use utility function
    const coords = await getCoords(cityName);
    if (!coords) {
      throw new Error('Location not found');
    }

    const url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.list || data.list.length === 0) {
      throw new Error('No forecast data available');
    }

    // Group by day and average values for each pollutant
    const dayMap = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      if (!dayMap[dayKey]) {
        dayMap[dayKey] = { PM25: [], PM10: [], NO2: [], date: dayKey };
      }
      dayMap[dayKey].PM25.push(item.components.pm2_5);
      dayMap[dayKey].PM10.push(item.components.pm10);
      dayMap[dayKey].NO2.push(item.components.no2);
    });

    // Prepare 7 days of data
    const processedData = Object.values(dayMap)
      .slice(0, 7)
      .map(day => ({
        date: day.date,
        name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        PM25: day.PM25.reduce((a, b) => a + b, 0) / day.PM25.length,
        PM10: day.PM10.reduce((a, b) => a + b, 0) / day.PM10.length,
        NO2: day.NO2.reduce((a, b) => a + b, 0) / day.NO2.length,
      }));

    // Set cache
    cache[cityName] = processedData;
    cacheExpiry[cityName] = nextMidnight.getTime();

    return Response.json({ results: processedData });
  } catch (error) {
    console.error('Error fetching OpenWeatherMap AQI data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}