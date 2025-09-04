export function formatTimeAgo(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date)) / 1000 / 60);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} mins ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}
