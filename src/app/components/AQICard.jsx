export default function AQICard({ data }) {

    function getAQIColor(aqi) {
      const colors = {
        1: "bg-green-500",
        2: "bg-blue-500",
        3: "bg-yellow-500",
        4: "bg-red-500",
        5: "bg-purple-800"
      };
      return colors[aqi] || "bg-gray-400";
    }
    return (
      <div className="mt-8 bg-card text-card-foreground rounded-lg shadow-md p-6 w-full max-w-md border border-border transition-colors">
        <span className={`inline-block w-4 h-4 rounded-full mr-2 ${getAQIColor(data.aqi)}`}></span>
        <strong className="text-primary">AQI:</strong> {data.aqi}

        <h2 className="text-xl font-semibold mb-4">{/*📍*/} {data.name}</h2>
        <ul className="space-y-2">
          <li><strong className="text-primary">AQI:</strong> {data.aqi}</li>
          <li><strong className="text-primary">PM2.5:</strong> {data.pm2_5}</li>
          <li><strong className="text-primary">PM10:</strong> {data.pm10}</li>
          <li><strong className="text-primary">NO₂:</strong> {data.no2}</li>
        </ul>
      </div>
    );
}