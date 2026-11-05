import "./Logo.css";

const Logo = ({ size = "medium", className = "" }) => {
  return (
    <div className={`streamify-premium-logo ${size} ${className}`} aria-label="Streamify Premium Logo">
      <div className="logo-badge">
        <svg viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="play-svg">
          <defs>
            <linearGradient id="streamifyRedGrad" x1="0" y1="0" x2="36" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0033" />
              <stop offset="0.5" stopColor="#E60026" />
              <stop offset="1" stopColor="#B30018" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF0033" floodOpacity="0.4" />
            </filter>
          </defs>
          <rect width="36" height="26" rx="7" fill="url(#streamifyRedGrad)" filter="url(#logoGlow)" />
          <path d="M14 7.5L25 13L14 18.5V7.5Z" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="logo-text-group">
        <span className="brand-title">Streamify</span>
        <span className="premium-tag">PREMIUM</span>
      </div>
    </div>
  );
};

export default Logo;
