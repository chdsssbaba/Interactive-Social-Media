import React from 'react';

export default function SkeletonPostCard() {
  return (
    <div className="skeleton-card glass-card" aria-hidden="true">
      <div className="skeleton-header">
        <div className="skeleton-avatar skeleton-pulse" />
        <div className="skeleton-meta">
          <div className="skeleton-line skeleton-line-title skeleton-pulse" />
          <div className="skeleton-line skeleton-line-sub skeleton-pulse" />
        </div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-body skeleton-pulse" />
        <div className="skeleton-line skeleton-line-body-short skeleton-pulse" />
      </div>
      <div className="skeleton-media skeleton-pulse" />
      <div className="skeleton-actions">
        <div className="skeleton-pill skeleton-pulse" />
        <div className="skeleton-pill skeleton-pulse" />
      </div>
    </div>
  );
}
