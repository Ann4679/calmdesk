const QUOTES = [
  "The secret of getting ahead is getting started.",
  "Productivity is never an accident. It is always the result of a commitment to excellence.",
  "Focus on being productive instead of busy.",
  "Do the hard jobs first. The easy jobs will take care of themselves.",
  "The way to get started is to quit talking and begin doing.",
  "Your future is created by what you do today, not tomorrow.",
  "Small daily improvements are the key to staggering long-term results.",
  "Don't watch the clock; do what it does. Keep going.",
  "Great things are done by a series of small things brought together.",
  "It always seems impossible until it's done.",
];

export function getQuoteOfTheDay(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}
