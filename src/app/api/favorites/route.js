import { connectToDatabase } from "@/lib/mongodb";
import FavoriteCity from "@/models/FavoriteCity";// Ensure global variables are set up

export async function POST(request) {
  await connectToDatabase();
  const { cityName } = await request.json();
  if (!cityName) {
    return new Response(JSON.stringify({ error: "cityName is required" }), { status: 400 });
  }
  // Check for duplicate
  const existing = await FavoriteCity.findOne({ cityName });
  if (existing) {
    return new Response(JSON.stringify({ message: "City already exists" }), { status: 200 });
  }
  const city = await FavoriteCity.create({ cityName });
  return new Response(JSON.stringify(city), { status: 201 });
}

export async function GET() {
  await connectToDatabase();
  const cities = await FavoriteCity.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(cities), { status: 200 });
}
