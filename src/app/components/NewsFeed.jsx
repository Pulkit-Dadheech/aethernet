'use client';
import { useEffect, useState } from "react";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch news on mount and every 24 hours
  useEffect(() => {
    let timeout;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNews(data.articles || []);
      } catch {
        setNews([]);
      }
      setLoading(false);
      timeout = setTimeout(fetchNews, 24 * 60 * 60 * 1000); // 24 hours
    };
    fetchNews();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="col-span-1 bg-card/90 rounded-2xl shadow-xl p-6 border border-border flex flex-col h-[300px] lg:h-[320px]">
      <h2 className="text-lg font-bold mb-4 text-primary">AQI News</h2>
      {loading ? (
        <div className="text-muted-foreground">Loading news...</div>
      ) : (
        <ul className="space-y-4 overflow-y-auto pr-2 flex-1">
          {news.map((item, idx) => (
            <li key={idx} className="border-b border-border pb-2 last:border-b-0">
              <div className="font-semibold">{item.title}</div>
              <div className="text-xs text-muted-foreground mb-1">{item.date && new Date(item.date).toLocaleString()}</div>
              <div className="text-sm text-foreground">{item.summary}</div>
              <a href={item.link} className="text-xs text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Show More</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}