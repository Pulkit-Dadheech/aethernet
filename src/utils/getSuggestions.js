export function getSuggestion(aqi) {
    switch (aqi) {
      case 1: return "😊 Air is clean. Enjoy your day!";
      case 2: return "🙂 Fair air quality. Stay active.";
      case 3: return "😐 Moderate — avoid long outdoor exposure.";
      case 4: return "😷 Poor — stay indoors if sensitive.";
      case 5: return "🚨 Very Poor — use mask, avoid outside.";
      default: return "❓ AQI data not available.";
    }
  }
  