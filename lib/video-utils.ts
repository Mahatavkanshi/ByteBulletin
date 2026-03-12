export function getYoutubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      const id = parsedUrl.pathname.slice(1).split("/")[0];
      return isValidYoutubeId(id) ? id : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const watchId = parsedUrl.searchParams.get("v");
      if (isValidYoutubeId(watchId)) {
        return watchId;
      }

      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      const embedId = pathParts[0] === "embed" ? pathParts[1] : null;
      const shortId = pathParts[0] === "shorts" ? pathParts[1] : null;
      const candidateId = embedId || shortId;

      return isValidYoutubeId(candidateId) ? candidateId : null;
    }

    return null;
  } catch {
    return null;
  }
}

function isValidYoutubeId(value: string | null | undefined) {
  return Boolean(value && /^[A-Za-z0-9_-]{11}$/.test(value));
}

export function getYoutubeEmbedUrl(url: string) {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null;
}

export function getYoutubeThumbnailUrl(url: string) {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}
