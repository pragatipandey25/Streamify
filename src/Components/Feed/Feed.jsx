import { useEffect, useState, useCallback } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { value_converter, fetchVideosByCategory, fetchSearchResults } from "../../data";
import moment from "moment";

const Feed = ({ category = 0, searchQuery = "" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (searchQuery && searchQuery.trim()) {
        result = await fetchSearchResults(searchQuery);
      } else {
        result = await fetchVideosByCategory(category);
      }

      if (result && Array.isArray(result.items)) {
        setData(result.items);
        setIsFallback(Boolean(result.isFallback));
        if (result.items.length === 0) {
          setError("No videos found. Try searching for something else.");
        }
      } else {
        setError("Unable to load videos right now.");
      }
    } catch (err) {
      setError("Failed to load videos: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="feed-wrapper">
      {isFallback && (
        <div className="fallback-banner">
          <span>ℹ️ Showing curated Streamify video showcase (YouTube API offline or quota limit).</span>
        </div>
      )}

      {error && !loading && (
        <div className="feed-error">
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      <div className="feed">
        {loading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="card skeleton-card">
                <div className="skeleton-thumb"></div>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line channel"></div>
                <div className="skeleton-line meta"></div>
              </div>
            ))
          : data.map((item, index) => {
              const videoId =
                typeof item.id === "string" ? item.id : item.id?.videoId;
              if (!videoId) return null;

              const categoryId = item.snippet?.categoryId || 0;
              const views = item.statistics?.viewCount;
              const channelTitle = item.snippet?.channelTitle || "Streamify Creator";
              const title = item.snippet?.title || "Untitled Video";
              const publishedAt = item.snippet?.publishedAt;
              const thumbnail =
                item.snippet?.thumbnails?.medium?.url ||
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.default?.url ||
                "";

              return (
                <Link
                  to={`/video/${categoryId}/${videoId}`}
                  className="card"
                  key={videoId || index}
                >
                  <div className="thumb-container">
                    <img src={thumbnail} alt={title} loading="lazy" />
                  </div>
                  <h2>{title}</h2>
                  <h3>{channelTitle}</h3>
                  <p>
                    {views !== undefined ? `${value_converter(views)} Views • ` : ""}
                    {publishedAt ? moment(publishedAt).fromNow() : ""}
                  </p>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default Feed;
