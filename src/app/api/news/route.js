import RSSParser from 'rss-parser';

const parser = new RSSParser();
const FEED_URL = "https://news.google.com/rss/search?q=aqi+pune+air+quality&hl=en-IN&gl=IN&ceid=IN:en";

export async function GET() {
  const feed = await parser.parseURL(FEED_URL);
  // Map to a simpler structure
  const articles = feed.items.slice(0, 6).map(item => ({
    title: item.title,
    date: item.pubDate,
    summary: item.contentSnippet,
    link: item.link,
  }));
  return Response.json({ articles });
}