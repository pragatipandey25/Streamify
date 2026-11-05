import { useEffect, useState, useCallback } from "react";
import "./Recommended.css";
import { value_converter, fetchRecommendedVideos } from "../../data";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId = 0 }) => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetchRecommendedVideos(categoryId);
      setApiData(items || []);
    } catch (err) {
      console.error("Failed loading recommended videos:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="recommended">
      <h3 className="recommended-heading">Up next</h3>
      {loading ? (
        Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="side-video-list skeleton-side">
            <div className="skeleton-side-thumb"></div>
            <div className="skeleton-side-info">
              <div className="skeleton-line" style={{ width: "90%" }}></div>
              <div className="skeleton-line" style={{ width: "65%" }}></div>
              <div className="skeleton-line" style={{ width: "40%" }}></div>
            </div>
          </div>
        ))
      ) : (
        apiData.map((item, index) => {
          const videoId = typeof item.id === "string" ? item.id : item.id?.videoId;
          if (!videoId) return null;

          const itemCat = item.snippet?.categoryId || categoryId || 0;
          const thumbnail =
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.default?.url ||
            "";

          return (
            <Link
              to={`/video/${itemCat}/${videoId}`}
              key={videoId || index}
              className="side-video-list"
            >
              <div className="side-thumb-wrap">
                <img src={thumbnail} alt={item.snippet?.title || "Video"} loading="lazy" />
              </div>
              <div className="vid-info">
                <h4>{item.snippet?.title || "Untitled Video"}</h4>
                <p className="side-channel">{item.snippet?.channelTitle || "Creator"}</p>
                <p className="side-views">
                  {value_converter(item.statistics?.viewCount || 0)} Views
                </p>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default Recommended;
