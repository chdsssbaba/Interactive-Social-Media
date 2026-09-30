import React from 'react';
import { Heart, MessageCircle, Share2, Sparkles, Clock, Bookmark } from 'lucide-react';
import { formatRelativeTime, getAvatarUrl, getPostImageUrl, getAuthorName, getAuthorHandle } from '../../utils/formatters';

/**
 * PostCard component displaying augmented social post data
 * Implements accessible interactions, loading="lazy" for imagery, and testid.
 */
function PostCard({ post, onLike, onOpenComments, onTagClick }) {
  const authorName = getAuthorName(post.userId);
  const authorHandle = getAuthorHandle(post.userId);
  const avatarUrl = getAvatarUrl(post.userId);
  const coverImageUrl = getPostImageUrl(post.id);
  const relativeDate = formatRelativeTime(post.createdAt);

  return (
    <article 
      className="post-card glass-card"
      data-testid="post-card"
      aria-label={`Post by ${authorName}`}
    >
      {/* Post Author / Header */}
      <div className="post-header">
        <div className="post-author-info">
          <img 
            src={avatarUrl} 
            alt={`${authorName}'s avatar`}
            className="post-avatar"
            loading="lazy"
            width="44"
            height="44"
          />
          <div className="post-author-meta">
            <div className="post-author-name-row">
              <span className="post-author-name">{authorName}</span>
              <span className="post-author-badge" title="Verified Creator">
                <Sparkles size={13} />
              </span>
            </div>
            <div className="post-meta-sub">
              <span className="post-author-handle">{authorHandle}</span>
              <span className="meta-bullet">•</span>
              <span className="post-timestamp" title={new Date(post.createdAt).toLocaleString()}>
                <Clock size={12} className="meta-icon" />
                {relativeDate}
              </span>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          className="post-save-btn" 
          aria-label="Bookmark post"
          title="Save post"
        >
          <Bookmark size={17} />
        </button>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-body">{post.body}</p>
      </div>

      {/* Post Media / Cover Image */}
      {coverImageUrl && (
        <div className="post-media-container">
          <img 
            src={coverImageUrl} 
            alt={post.title}
            className="post-cover-image"
            loading="lazy"
          />
        </div>
      )}

      {/* Hashtags list */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="post-hashtags-container" aria-label="Post hashtags">
          {post.hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="hashtag-pill"
              onClick={() => onTagClick && onTagClick(tag)}
              title={`Filter by ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Post Action Bar */}
      <div className="post-action-bar">
        {/* Like Button with optimistic state */}
        <button
          type="button"
          className={`post-action-btn like-btn ${post.isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
          aria-label="Like post"
          aria-pressed={post.isLiked}
        >
          <Heart 
            size={18} 
            className={`action-icon ${post.isLiked ? 'heart-filled animate-pop' : ''}`} 
            fill={post.isLiked ? 'currentColor' : 'none'}
          />
          <span className="action-count">{post.likeCount}</span>
        </button>

        {/* Comments Button */}
        <button
          type="button"
          className="post-action-btn comment-btn"
          onClick={() => onOpenComments(post.id, post.title)}
          aria-label={`Open comments for ${post.title}`}
        >
          <MessageCircle size={18} className="action-icon" />
          <span className="action-label">Comments</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          className="post-action-btn share-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.title, text: post.body, url: window.location.href }).catch(() => {});
            }
          }}
          aria-label="Share post"
        >
          <Share2 size={18} className="action-icon" />
          <span className="action-label">Share</span>
        </button>
      </div>
    </article>
  );
}

export default React.memo(PostCard);
