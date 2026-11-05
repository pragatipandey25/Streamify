import { MOCK_VIDEOS, MOCK_CHANNELS, MOCK_COMMENTS } from "./mockData";

export const getApiKey = () => {
  return (
    localStorage.getItem("streamify_custom_api_key") ||
    import.meta.env.VITE_YOUTUBE_API_KEY ||
    import.meta.env.VITE_API_KEY ||
    ""
  );
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem("streamify_custom_api_key", key.trim());
  } else {
    localStorage.removeItem("streamify_custom_api_key");
  }
};

export const API_KEY = getApiKey();

export const value_converter = (value) => {
  if (value === undefined || value === null || value === "") return "0";
  const num = typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
  if (isNaN(num)) return value;

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toLocaleString();
  }
};

// Safe helper to fetch video feed (by category or most popular)
export const fetchVideosByCategory = async (categoryId = 0) => {
  const key = getApiKey();
  const cat = Number(categoryId) || 0;
  
  if (key) {
    try {
      let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&key=${key}`;
      if (cat !== 0) {
        url += `&videoCategoryId=${cat}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        return { items: data.items, isFallback: false };
      }
      console.warn("YouTube API response error or empty, using fallback data:", data?.error?.message || "empty");
    } catch (err) {
      console.warn("YouTube API fetch failed, using fallback data:", err.message);
    }
  }

  // Fallback to mock data filtered by category
  let filtered = MOCK_VIDEOS;
  if (cat !== 0) {
    filtered = MOCK_VIDEOS.filter((v) => Number(v.snippet.categoryId) === cat);
    if (filtered.length === 0) {
      filtered = MOCK_VIDEOS;
    }
  }
  return { items: filtered, isFallback: true };
};

// Safe helper to search videos
export const fetchSearchResults = async (query) => {
  const key = getApiKey();
  const trimmed = (query || "").trim();
  if (!trimmed) return { items: [], isFallback: false };

  if (key) {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&type=video&q=${encodeURIComponent(trimmed)}&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        return { items: data.items, isFallback: false };
      }
      console.warn("YouTube Search API error or empty, using fallback search:", data?.error?.message || "empty");
    } catch (err) {
      console.warn("YouTube Search API failed, using fallback search:", err.message);
    }
  }

  // Filter fallback videos by title, channel or description
  const q = trimmed.toLowerCase();
  const filtered = MOCK_VIDEOS.filter((v) => {
    return (
      v.snippet.title.toLowerCase().includes(q) ||
      v.snippet.channelTitle.toLowerCase().includes(q) ||
      v.snippet.description.toLowerCase().includes(q)
    );
  });
  return { items: filtered.length > 0 ? filtered : MOCK_VIDEOS.slice(0, 8), isFallback: true };
};

// Safe helper to fetch single video details
export const fetchVideoDetails = async (videoId) => {
  const key = getApiKey();
  if (!videoId) return null;

  if (key) {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        return data.items[0];
      }
    } catch (err) {
      console.warn("Failed fetching video details from API:", err.message);
    }
  }

  // Check fallback videos
  const found = MOCK_VIDEOS.find((v) => v.id === videoId);
  if (found) return found;

  // Generic fallback if opened with an arbitrary videoId
  return {
    id: videoId,
    snippet: {
      categoryId: "0",
      channelId: "default",
      channelTitle: "Streamify Creator",
      title: "Streamify Featured Video",
      description: "Enjoy streaming high-definition video on Streamify with custom player controls and instant community reactions.",
      publishedAt: new Date().toISOString(),
      thumbnails: {
        medium: { url: MOCK_VIDEOS[0].snippet.thumbnails.medium.url },
      },
    },
    statistics: {
      viewCount: "125000",
      likeCount: "4800",
      commentCount: "120",
    },
  };
};

// Safe helper to fetch channel data
export const fetchChannelData = async (channelId) => {
  const key = getApiKey();
  if (channelId && channelId !== "default" && key) {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        return data.items[0];
      }
    } catch (err) {
      console.warn("Failed fetching channel data from API:", err.message);
    }
  }

  return MOCK_CHANNELS[channelId] || MOCK_CHANNELS.default;
};

// Safe helper to fetch video comments
export const fetchVideoComments = async (videoId) => {
  const key = getApiKey();
  if (videoId && key) {
    try {
      const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        return data.items;
      }
    } catch (err) {
      console.warn("Failed fetching comments from API (may be disabled or quota reached):", err.message);
    }
  }

  return MOCK_COMMENTS;
};

// Safe helper to fetch recommended videos
export const fetchRecommendedVideos = async (categoryId = 0) => {
  const key = getApiKey();
  const cat = Number(categoryId) || 0;

  if (key) {
    try {
      let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=30&regionCode=US&key=${key}`;
      if (cat !== 0) {
        url += `&videoCategoryId=${cat}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.items && data.items.length > 0) {
        return data.items;
      }
    } catch (err) {
      console.warn("Failed fetching recommended videos from API:", err.message);
    }
  }

  let list = MOCK_VIDEOS;
  if (cat !== 0) {
    const matched = MOCK_VIDEOS.filter((v) => Number(v.snippet.categoryId) === cat);
    if (matched.length > 0) list = matched;
  }
  return list;
};
