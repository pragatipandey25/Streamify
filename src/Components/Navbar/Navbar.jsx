import { useState } from "react";
import "./Navbar.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/Streamify.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import notification_icon from "../../assets/notification.png";
import profile_icon from "../../assets/jack.png";
import voice_icon from "../../assets/voice-search.png";
import { Link, useNavigate } from "react-router-dom";
import { getApiKey, setApiKey } from "../../data";

const Navbar = ({ setSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [customKey, setCustomKey] = useState(getApiKey());
  const [videoInputUrl, setVideoInputUrl] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // Voice Search using Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.onstart = () => {
        setSearchQuery("Listening...");
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        navigate(`/search/${encodeURIComponent(transcript)}`);
      };
      recognition.onerror = () => {
        setSearchQuery("");
      };
      recognition.start();
    } else {
      alert("Voice search is not supported by your current browser.");
    }
  };

  const handleCustomVideoSubmit = (e) => {
    e.preventDefault();
    let videoId = videoInputUrl.trim();
    if (!videoId) return;

    // Check if it's a full YouTube URL
    try {
      if (videoId.includes("youtube.com/watch")) {
        const urlParams = new URL(videoId).searchParams;
        videoId = urlParams.get("v") || videoId;
      } else if (videoId.includes("youtu.be/")) {
        videoId = videoId.split("youtu.be/")[1].split("?")[0];
      }
    } catch {
      // not a valid URL, use raw string
    }

    setShowUploadModal(false);
    setVideoInputUrl("");
    navigate(`/video/0/${videoId}`);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setApiKey(customKey);
    setShowKeyModal(false);
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <div className="nav-left">
          <img
            className="menu-icon"
            onClick={() => setSidebar((prev) => !prev)}
            src={menu_icon}
            alt="Toggle navigation menu"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSidebar((prev) => !prev)}
            title="Toggle Sidebar"
          />

          <Link to="/" aria-label="Streamify Home">
            <img className="logo" src={logo} alt="Streamify Logo" />
          </Link>
        </div>

        <div className="nav-middle">
          <form className="search-box" onSubmit={handleSearch} role="search">
            <input
              type="text"
              placeholder="Search videos, creators, music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search Streamify"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search text"
              >
                &times;
              </button>
            )}
            <button
              type="submit"
              className="search-btn"
              aria-label="Submit search"
            >
              <img src={search_icon} alt="Search" />
            </button>
          </form>

          <button
            type="button"
            className="voice-search-btn"
            onClick={handleVoiceSearch}
            title="Search with voice"
            aria-label="Search with voice"
          >
            <img src={voice_icon} alt="Voice search" />
          </button>
        </div>

        <div className="nav-right">
          <button
            type="button"
            className="nav-btn"
            onClick={() => setShowUploadModal(true)}
            title="Watch custom video ID or URL"
            aria-label="Open custom video modal"
          >
            <img className="nav-icon" src={upload_icon} alt="Custom Video" />
          </button>

          <button
            type="button"
            className="nav-btn key-btn"
            onClick={() => setShowKeyModal(true)}
            title="YouTube API Key Settings"
            aria-label="Configure API Key"
          >
            <span className="api-badge">API</span>
          </button>

          <div className="dropdown-wrapper">
            <button
              type="button"
              className="nav-btn"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
              title="Notifications"
              aria-label="Notifications"
            >
              <img
                className="nav-icon"
                src={notification_icon}
                alt="Notifications"
              />
              <span className="notif-dot"></span>
            </button>

            {showNotifications && (
              <div className="dropdown-panel notifications-panel">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                </div>
                <div className="dropdown-list">
                  <div className="notif-item">
                    <p>🎉 Welcome to Streamify! Discover trending videos anytime.</p>
                    <span>Just now</span>
                  </div>
                  <div className="notif-item">
                    <p>🔥 MrBeast just dropped a new video!</p>
                    <span>2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="dropdown-wrapper">
            <img
              className="profile-icon"
              src={profile_icon}
              alt="Your profile"
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              role="button"
              tabIndex={0}
            />

            {showProfileMenu && (
              <div className="dropdown-panel profile-panel">
                <div className="profile-header">
                  <img src={profile_icon} alt="Avatar" />
                  <div>
                    <strong>Streamify Explorer</strong>
                    <span>user@streamify.app</span>
                  </div>
                </div>
                <hr />
                <button
                  className="dropdown-action"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowKeyModal(true);
                  }}
                >
                  ⚙️ API Key Settings
                </button>
                <button
                  className="dropdown-action"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/search/trending");
                  }}
                >
                  🔥 Trending Videos
                </button>
                <hr />
                <button
                  className="dropdown-action"
                  onClick={() => setShowProfileMenu(false)}
                >
                  🚪 Close
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Custom Video / URL Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Play Any Video</h3>
              <button
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="modal-desc">
              Paste any YouTube video URL or ID (e.g. <code>dQw4w9WgXcQ</code>) to watch it immediately in Streamify:
            </p>
            <form onSubmit={handleCustomVideoSubmit}>
              <input
                type="text"
                className="modal-input"
                placeholder="https://www.youtube.com/watch?v=... or Video ID"
                value={videoInputUrl}
                onChange={(e) => setVideoInputUrl(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn-primary">
                  Watch Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="modal-backdrop" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>YouTube API Configuration</h3>
              <button
                className="modal-close"
                onClick={() => setShowKeyModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="modal-desc">
              Streamify works automatically with live data and smart fallback cache. If you have your own Google Cloud YouTube Data API v3 key, you can enter it here:
            </p>
            <form onSubmit={handleSaveApiKey}>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter YouTube API Key (starts with AIza...)"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => {
                    setCustomKey("");
                    setApiKey("");
                    setShowKeyModal(false);
                    window.location.reload();
                  }}
                >
                  Reset to Default
                </button>
                <button type="submit" className="modal-btn-primary">
                  Save & Reload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
