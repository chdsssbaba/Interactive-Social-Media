import React from 'react';
import { ToastProvider } from './components/ui/ToastContext';
import Navbar from './components/ui/Navbar';
import FeedContainer from './components/feed/FeedContainer';
import { Compass, TrendingUp, Sparkles, HeartHandshake } from 'lucide-react';

export default function App() {
  return (
    <ToastProvider>
      <div className="app-layout">
        {/* Dynamic Glassmorphism Background Spheres */}
        <div className="bg-glow bg-glow-1" aria-hidden="true" />
        <div className="bg-glow bg-glow-2" aria-hidden="true" />
        <div className="bg-glow bg-glow-3" aria-hidden="true" />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="main-viewport-wrapper">
          {/* Left / Sidebar Info (Desktop) */}
          <aside className="sidebar-info glass-container desktop-only" aria-label="Community highlights">
            <div className="sidebar-widget">
              <h3 className="widget-title">
                <Compass size={17} className="widget-icon" />
                <span>Explore Topics</span>
              </h3>
              <p className="widget-desc">
                Dynamic infinite-scroll social stream powered by React 18 &amp; Intersection Observer.
              </p>
              <div className="widget-pills">
                <span className="info-tag">⚡ 60 FPS Scroll</span>
                <span className="info-tag">🎯 Optimistic Likes</span>
                <span className="info-tag">🔍 300ms Debounce</span>
                <span className="info-tag">💬 Lazy Modals</span>
              </div>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">
                <TrendingUp size={17} className="widget-icon" />
                <span>Network Status</span>
              </h3>
              <div className="metrics-card">
                <div className="metric-row">
                  <span className="metric-label">API Gateway</span>
                  <span className="metric-val text-success">Online (REST)</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Cache Strategy</span>
                  <span className="metric-val">In-Memory + Abort</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Protocol</span>
                  <span className="metric-val">HTTP/2 TLS</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Central Feed Stream */}
          <main className="feed-main-content">
            <FeedContainer />
          </main>
        </div>

        {/* Minimal Footer */}
        <footer className="app-footer">
          <p>© 2026 SphereFeed • Interactive Social Media Feed • Built with React &amp; Intersection Observer</p>
        </footer>
      </div>
    </ToastProvider>
  );
}
