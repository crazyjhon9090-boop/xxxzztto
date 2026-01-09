export function extractYouTubeId(iframe) {
  if (!iframe) return null;

  const match = iframe.match(/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}
