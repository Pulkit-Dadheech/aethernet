import mongoose from "mongoose";

const FavoriteCitySchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FavoriteCity ||
  mongoose.model("FavoriteCity", FavoriteCitySchema);
