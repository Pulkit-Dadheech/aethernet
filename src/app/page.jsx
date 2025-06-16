'use client';

import { useState, useEffect, useContext } from 'react';
import { FiGlobe, FiWind, FiCloud, FiActivity, FiSettings } from 'react-icons/fi';
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import MainNavbar from "./components/Navbar/MainNavbar.jsx";
import { SidebarProvider, useSidebar } from '@/context/SidebarContext.jsx';
import './globals.css';
import DashboardMain from "./components/DashboardMain.jsx";
import AiSuggestionPage from './components/AiSuggestionPage.jsx';
import { ClipLoader } from 'react-spinners';

// Dummy news data
const newsData = [
  {
    title: "AQI improves in Pune after rainfall",
    date: "2025-06-14",
    summary: "Recent rainfall has led to a significant improvement in Pune's air quality.",
    link: "#"
  },
  {
    title: "PM2.5 levels drop in Pune",
    date: "2025-06-13",
    summary: "Authorities report a drop in PM2.5 levels this week.",
    link: "#"
  }
];

export default function Home() {
  const [location] = useState('Pune');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [networkData, setNetworkData] = useState(null);
  const [loadingNetworkData, setLoadingNetworkData] = useState(false);

  // NEW: Active section state
  const {activeSection, setActiveSection} = useSidebar('dashboard');

  useEffect(() => {
    fetchAQI({location, lat, lon});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);


  useEffect(() => {
    const fetchHistorical = async () => {
      setLoadingHistory(true);
      try {
        const res = await fetch(`/api/historical?city=${encodeURIComponent(location)}`);
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setHistoricalData(data.results);
      } catch (error) {
        if (error.code === 1) {
          alert("Permission denied. Please allow location access.");
        } else if (error.code === 2) {
          alert("Location unavailable. Please check your connection or try again later.");
        } else if (error.code === 3) {
          alert("Location request timed out.");
        }
        setHistoricalData([]);
      }
      setLoadingHistory(false);
    };

    fetchHistorical();
  }, [location]);

  const fetchAQI = async (props) => {
    setLoading(true);
    const { location, lat, lon } = props;
    try {
      const res = await fetch('/api/aqi', {
        method: 'POST',
        body: JSON.stringify({ location, lat, lon }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      setData(result);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

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
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#181c2a] via-[#232946] to-[#0f172a] dark:from-[#0f172a] dark:via-[#312e81] dark:to-[#000] transition-colors" />

      {/* Main Navbar at the top */}
      <MainNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Sidebar and content below navbar */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar with fixed width */}
        <div className="w-20 md:w-56 flex-shrink-0">
          <Sidebar
            titleName="AetherNet"
            activeSectionList={["dashboard", "suggestions", "multiple","map"]}
            sectionNames={["Dashboard", "AI Suggestions","Multiple Place Analysis","Pollution Map"]}
            LogoComponents={[FiGlobe, FiWind, FiCloud, FiSettings]}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Render content based on activeSection */}
          {activeSection === "dashboard" && (
            <DashboardMain
              data={data}
              loading={loading}
              historicalData={historicalData}
              loadingHistory={loadingHistory}
            />
          )}
          {activeSection === "suggestions" && (
            !data ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <ClipLoader color="#6366f1" size={64} speedMultiplier={1.2} />
                <span className="mt-4 text-lg text-primary font-semibold animate-pulse">
                  Loading suggestion data...
                </span>
              </div>
            ) : (
              <AiSuggestionPage aqi={data.aqi} location={location} />
            )
          )}

          {/* Multiple Place Analysis Section */}
          {activeSection === "multiple" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <h2 className="text-2xl font-semibold text-center">Multiple Place Analysis Coming Soon!</h2>
            </div>
          )}

          {/* Pollution Map Section */}
          {activeSection === "map" && (
            <div className="flex-1 flex items-center justify-center p-8">
              <h2 className="text-2xl font-semibold text-center">Pollution Map Coming Soon!</h2>
            </div>
          )}


          {}

          {/* News Section */}
          {/* You can add more sections here, e.g.:
          {activeSection === "network" && <NetworkComponent />}
          */}
        </div>
      </div>
    </>
  );
}
