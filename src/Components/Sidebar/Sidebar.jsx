import './Sidebar.css'
import home from '../../assets/home.png'
import game_icon from '../../assets/game_icon.png'
import automobiles from '../../assets/automobiles.png'
import sports from '../../assets/sports.png'
import entertainment from '../../assets/entertainment.png'
import tech from '../../assets/tech.png'
import music from '../../assets/music.png'
import blogs from '../../assets/blogs.png'
import news from '../../assets/news.png'
import jack from '../../assets/jack.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const Sidebar = ({ sidebar, category, setCategory }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const subscriptions = user?.subscriptions || [];

  const handleCategoryClick = (catId) => {
    if (setCategory) {
      setCategory(catId);
    }
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleChannelClick = (channelName) => {
    navigate(`/search/${encodeURIComponent(channelName)}`);
  };

  const categories = [
    { id: 0, label: 'Home', icon: home },
    { id: 20, label: 'Gaming', icon: game_icon },
    { id: 2, label: 'Automobiles', icon: automobiles },
    { id: 17, label: 'Sports', icon: sports },
    { id: 24, label: 'Entertainment', icon: entertainment },
    { id: 28, label: 'Technology', icon: tech },
    { id: 10, label: 'Music', icon: music },
    { id: 22, label: 'Blogs', icon: blogs },
    { id: 25, label: 'News', icon: news },
  ];

  return (
    <aside className={`sidebar ${sidebar ? "" : "small-sidebar"}`} aria-label="Sidebar navigation">
      <div className="shortcut-links">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`side-link ${category === cat.id && location.pathname === '/' ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.id)}
            title={cat.label}
          >
            <img src={cat.icon} alt={cat.label} />
            <p>{cat.label}</p>
          </div>
        ))}
        <hr />
      </div>

      <div className="subscribed-list">
        <h3>Subscribed</h3>
        {subscriptions.length === 0 ? (
          <div className="empty-sub-notice">
            <p>No subscriptions yet</p>
            <span>Subscribe to channels while watching to see them here.</span>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <div
              key={sub.channelId || sub.title}
              className="side-link channel-link"
              onClick={() => handleChannelClick(sub.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleChannelClick(sub.title)}
              title={sub.title}
            >
              <img
                src={sub.thumbnail || jack}
                alt={sub.title}
                onError={(e) => {
                  e.target.src = jack;
                }}
              />
              <p>{sub.title}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
