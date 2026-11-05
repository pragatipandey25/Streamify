import { useEffect, useState, useCallback } from "react";
import "./PlayVideo.css";
import likeIcon from "../../assets/like.png";
import dislikeIcon from "../../assets/dislike.png";
import shareIcon from "../../assets/share.png";
import saveIcon from "../../assets/save.png";
import userProfile from "../../assets/user_profile.jpg";
import {
  value_converter,
  fetchVideoDetails,
  fetchChannelData,
  fetchVideoComments,
} from "../../data";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../context/useAuth";

const PlayVideo = ({ videoId: propVideoId }) => {
  const { user, isSubscribed, toggleSubscribe } = useAuth();
  const currentUserName = user?.name || "You";
  const currentUserAvatar = user?.avatar || userProfile;

  const params = useParams();
  const videoId = propVideoId || params.videoId;

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const loadVideo = useCallback(async () => {
    if (!videoId) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setApiData(null);
    setChannelData(null);
    setCommentData([]);
    setIsLiked(false);
    setIsDisliked(false);

    const video = await fetchVideoDetails(videoId);
    if (video) {
      setApiData(video);

      const channelId = video.snippet?.channelId;
      const channel = await fetchChannelData(channelId);
      setChannelData(channel);

      const comments = await fetchVideoComments(videoId);
      setCommentData(comments || []);
    }
  }, [videoId]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
      showToast("Added to Liked Videos");
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("Video link copied to clipboard!");
      });
    } else {
      showToast("Link: " + url);
    }
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
    showToast(!isSaved ? "Saved to Watch Later" : "Removed from Watch Later");
  };

  const channelId = channelData?.id || apiData?.snippet?.channelId || "default";
  const channelTitle = apiData?.snippet?.channelTitle || channelData?.snippet?.title || "Creator";
  const channelThumbnail =
    channelData?.snippet?.thumbnails?.default?.url ||
    channelData?.snippet?.thumbnails?.medium?.url ||
    currentUserAvatar;

  const userIsSubscribed = isSubscribed(channelId, channelTitle);

  const handleSubscribe = () => {
    const subscribed = toggleSubscribe({
      channelId,
      title: channelTitle,
      thumbnail: channelThumbnail,
    });
    if (subscribed) {
      showToast(`Subscribed to ${channelTitle}!`);
    } else {
      showToast(`Unsubscribed from ${channelTitle}`);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: "comment-" + Date.now(),
      snippet: {
        topLevelComment: {
          snippet: {
            authorDisplayName: currentUserName,
            authorProfileImageUrl: currentUserAvatar,
            textDisplay: newCommentText.trim(),
            likeCount: 0,
            publishedAt: new Date().toISOString(),
          },
        },
      },
    };

    setCommentData([newComment, ...commentData]);
    setNewCommentText("");
    showToast("Comment posted!");
  };

  const rawLikes = Number(apiData?.statistics?.likeCount || 0);
  const displayedLikes = isLiked ? rawLikes + 1 : rawLikes;

  const rawSubs = Number(channelData?.statistics?.subscriberCount || 100000);
  const displayedSubs = userIsSubscribed ? rawSubs + 1 : rawSubs;

  const description = apiData?.snippet?.description || "";
  const shouldTruncate = description.length > 250;
  const displayedDesc =
    shouldTruncate && !showFullDesc
      ? description.slice(0, 250) + "..."
      : description;

  return (
    <div className="play-video">
      {toastMessage && <div className="video-toast">{toastMessage}</div>}

      <div className="iframe-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={apiData?.snippet?.title || "Streamify Video Player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <h3 className="video-title">
        {apiData?.snippet?.title || "Loading video title..."}
      </h3>

      <div className="play-video-info">
        <p>
          {value_converter(apiData?.statistics?.viewCount || 0)} Views &bull;{" "}
          {apiData?.snippet?.publishedAt
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "Recently"}
        </p>

        <div className="video-actions">
          <button
            className={`action-btn ${isLiked ? "active" : ""}`}
            onClick={handleLike}
            aria-label="Like video"
          >
            <img src={likeIcon} alt="" />
            <span>{value_converter(displayedLikes)}</span>
          </button>

          <button
            className={`action-btn ${isDisliked ? "active" : ""}`}
            onClick={handleDislike}
            aria-label="Dislike video"
          >
            <img src={dislikeIcon} alt="" />
          </button>

          <button
            className="action-btn"
            onClick={handleShare}
            aria-label="Share video"
          >
            <img src={shareIcon} alt="" />
            <span>Share</span>
          </button>

          <button
            className={`action-btn ${isSaved ? "active" : ""}`}
            onClick={handleSave}
            aria-label="Save to playlist"
          >
            <img src={saveIcon} alt="" />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      <hr />

      <div className="publisher">
        <img
          src={
            channelData?.snippet?.thumbnails?.default?.url ||
            channelData?.snippet?.thumbnails?.medium?.url ||
            userProfile
          }
          alt={apiData?.snippet?.channelTitle || "Publisher"}
        />
        <div>
          <p>{apiData?.snippet?.channelTitle || "Streamify Creator"}</p>
          <span>{value_converter(displayedSubs)} Subscribers</span>
        </div>
        <button
          className={`subscribe-btn ${userIsSubscribed ? "subscribed" : ""}`}
          onClick={handleSubscribe}
        >
          {userIsSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      <div className="vid-description">
        <p className="desc-text">{displayedDesc || "No description provided."}</p>
        {shouldTruncate && (
          <button
            className="desc-toggle-btn"
            onClick={() => setShowFullDesc((prev) => !prev)}
          >
            {showFullDesc ? "Show less" : "Show more"}
          </button>
        )}

        <hr />

        <h4>
          {value_converter(
            (apiData?.statistics?.commentCount
              ? Number(apiData.statistics.commentCount)
              : 0) + (commentData.length > 0 ? 0 : 0)
          )}{" "}
          Comments
        </h4>

        {/* Add comment box */}
        <form className="add-comment-form" onSubmit={handleCommentSubmit}>
          <img src={currentUserAvatar} alt={currentUserName} className="user-comment-avatar" />
          <div className="comment-input-box">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            {newCommentText.trim() && (
              <div className="comment-btn-group">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setNewCommentText("")}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-comment-btn">
                  Comment
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Comment list */}
        <div className="comments-list">
          {commentData.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            commentData.map((item, index) => {
              const snippet = item.snippet?.topLevelComment?.snippet;
              if (!snippet) return null;

              return (
                <div key={item.id || index} className="comment">
                  <img
                    src={snippet.authorProfileImageUrl || userProfile}
                    alt={snippet.authorDisplayName || "User"}
                    onError={(e) => {
                      e.target.src = userProfile;
                    }}
                  />
                  <div>
                    <h3>
                      {snippet.authorDisplayName || "User"}{" "}
                      <span>{moment(snippet.publishedAt).fromNow()}</span>
                    </h3>
                    <p>{snippet.textDisplay}</p>
                    <div className="comment-action">
                      <img src={likeIcon} alt="Like comment" />
                      <span>{value_converter(snippet.likeCount || 0)}</span>
                      <img src={dislikeIcon} alt="Dislike comment" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;
