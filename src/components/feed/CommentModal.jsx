import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageSquare, Loader2, User } from 'lucide-react';
import { fetchComments } from '../../services/api';

/**
 * CommentModal component rendered into document.body using React Portal
 * Ensures accessible focus management, Escape key handling, and lazy fetching.
 */
export default function CommentModal({ postId, postTitle, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const closeBtnRef = useRef(null);

  // Focus trap / auto-focus close button when modal opens
  useEffect(() => {
    if (isOpen) {
      // Focus close button on mount
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lazy fetch comments when modal opens for a given postId
  useEffect(() => {
    if (!isOpen || !postId) return;

    const abortController = new AbortController();
    setLoading(true);
    setError(null);

    fetchComments(postId, { signal: abortController.signal })
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError('Failed to load comments. Please try again.');
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [isOpen, postId]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="presentation"
    >
      <div 
        className="modal-container glass-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-badge">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">Comments</h2>
              <p className="modal-subtitle truncate">On: "{postTitle}"</p>
            </div>
          </div>
          <button 
            ref={closeBtnRef}
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close comment modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body custom-scrollbar">
          {loading && (
            <div className="modal-loading-state">
              <Loader2 className="spinner" size={28} />
              <p>Fetching discussion thread...</p>
            </div>
          )}

          {error && (
            <div className="modal-error-state" role="alert">
              <p>{error}</p>
              <button 
                type="button" 
                className="btn-retry"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchComments(postId)
                    .then((d) => { setComments(d); setLoading(false); })
                    .catch(() => { setError('Failed to load comments.'); setLoading(false); });
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && comments.length === 0 && (
            <div className="modal-empty-state">
              <p>No comments found for this post yet.</p>
            </div>
          )}

          {!loading && !error && comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author-bar">
                    <div className="comment-avatar">
                      <User size={14} />
                    </div>
                    <div className="comment-meta">
                      <span className="comment-name">{comment.name}</span>
                      <span className="comment-email">{comment.email}</span>
                    </div>
                  </div>
                  <p className="comment-body">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="comment-count-badge">
            {comments.length} {comments.length === 1 ? 'Response' : 'Responses'}
          </span>
          <button 
            type="button" 
            className="modal-done-btn"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
