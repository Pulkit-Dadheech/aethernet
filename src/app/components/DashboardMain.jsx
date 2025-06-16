import { motion } from 'framer-motion';
import { ClipLoader } from "react-spinners";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import NewsFeed from "./NewsFeed.jsx";
import { FiGlobe, FiWind, FiCloud, FiActivity } from 'react-icons/fi';

export default function DashboardMain({ data, loading, historicalData, loadingHistory }) {
  // Prepare bar graph data from live API data
  const barData = data
    ? [
        { name: 'AQI', value: data.aqi },
        { name: 'PM2.5', value: data.pm2_5 },
        { name: 'PM10', value: data.pm10 },
        { name: 'NO₂', value: data.no2 },
      ]
    : [];

  // Card data from API
  const statCards = [
    {
      icon: <FiGlobe />,
      label: 'AQI',
      value: data?.aqi ?? '--',
      color: 'from-green-400 via-blue-500 to-purple-500',
    },
    {
      icon: <FiWind />,
      label: 'PM2.5',
      value: data?.pm2_5 ?? '--',
      color: 'from-blue-400 via-cyan-400 to-green-300',
    },
    {
      icon: <FiCloud />,
      label: 'PM10',
      value: data?.pm10 ?? '--',
      color: 'from-purple-400 via-pink-400 to-red-400',
    },
    {
      icon: <FiActivity />,
      label: 'NO₂',
      value: data?.no2 ?? '--',
      color: 'from-yellow-400 via-orange-400 to-red-400',
    },
  ];

  return (
    <main className="flex-1 flex flex-col gap-8 p-8 bg-transparent">
      {/* Top: Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.04 }}
            className={`relative bg-gradient-to-br ${card.color} rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-border group transition`}
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-3xl mb-2 text-white drop-shadow">{card.icon}</span>
            <span className="text-2xl font-bold text-white drop-shadow">{card.value}</span>
            <span className="text-sm text-white/80">{card.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Second Row: Live Data Card and News Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Data Card (Bar Graph) */}
        <div className="col-span-2 bg-card/90 rounded-2xl shadow-xl p-6 border border-border flex flex-col justify-center">
          <h2 className="text-lg font-bold mb-4 text-primary">Live AQI & Pollutant Levels</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <ClipLoader color="#6366f1" size={64} speedMultiplier={1.2} />
              <span className="mt-4 text-lg text-primary font-semibold animate-pulse">Loading AQI data...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* News Section */}
        <NewsFeed />
      </div>

      {/* Bottom: Historical AQI & Pollutant Trends (Full Width) */}
      <div className="w-full bg-card/90 rounded-2xl shadow-xl p-6 border border-border flex flex-col justify-center">
        <h2 className="text-lg font-bold mb-4 text-primary">Historical AQI & Pollutant Trends</h2>
        {loadingHistory ? (
          <div className="text-muted-foreground">Loading historical data...</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={historicalData}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="PM25" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="PM10" fill="#a78bfa" radius={[8, 8, 0, 0]} />
              <Bar dataKey="NO2" fill="#facc15" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </main>
  );
}