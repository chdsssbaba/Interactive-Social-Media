import { Layers, Activity, Sparkles, Code2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar glass-nav">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo-icon">
            <Layers size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">SphereFeed</h1>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="live-status-indicator" title="Connected to REST API">
            <span className="pulse-dot" />
            <span className="status-label">Live Stream</span>
          </div>
          <a
            href="https://github.com/chdsssbaba"
            target="_blank"
            rel="noreferrer"
            className="nav-icon-link"
            aria-label="GitHub Profile"
          >
            <Code2 size={19} />
          </a>
        </div>
      </div>
    </header>
  );
}
