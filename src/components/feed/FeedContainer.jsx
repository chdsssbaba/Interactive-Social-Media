import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchPosts, patchPostLike } from '../../services/api';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../ui/ToastContext';
import PostCard from './PostCard';
import CommentModal from './CommentModal';
import FilterBar from './FilterBar';
import SkeletonPostCard from './SkeletonCard';
import { Loader2, Sparkles, Inbox, RefreshCw } from 'lucide-react';

const PAGE_SIZE = 10;
const MAX_POSTS = 100; // JSONPlaceholder has 100 posts in total

/**
 * FeedContainer manages:
 * - Pagination state (page, hasMore, loading)
 * - Infinite scroll via useIntersectionObserver
 * - Optimistic UI updates with rollback for likes
 * - Lazy loaded CommentModal state
 * - Search debouncing and client-side filtering / sorting
 */
export default function FeedContainer() {
  const { showToast } = useToast();

  // Core Feed State
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [sortOption, setSortOption] = useState('all');

  // Modal State
  const [activeModal, setActiveModal] = useState({
    isOpen: false,
    postId: null,
    postTitle: ''
  });

  // Track in-flight request controller to support clean aborts on unmount
  const abortControllerRef = useRef(null);

  // Initial Fetch & Subsequent Infinite Scroll Fetching
  const loadPosts = useCallback(async (targetPage) => {
    // Guard against duplicate fetches
    if (loading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { posts: newPosts, totalCount } = await fetchPosts(targetPage, PAGE_SIZE, {
        signal: controller.signal
      });

      setPosts((prev) => {
        // Prevent duplicate posts if Strict Mode triggers double-mount
        const existingIds = new Set(prev.map((p) => p.id));
        const filteredNew = newPosts.filter((p) => !existingIds.has(p.id));
        return targetPage === 1 ? newPosts : [...prev, ...filteredNew];
      });

      // Calculate if more posts exist
      const totalLoaded = (targetPage - 1) * PAGE_SIZE + newPosts.length;
      if (newPosts.length < PAGE_SIZE || totalLoaded >= (totalCount || MAX_POSTS)) {
        setHasMore(false);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError('Failed to load posts. Please check your internet connection.');
        showToast('Network error: Unable to load posts', 'error');
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading, showToast]);

  // Initial mount fetch
  useEffect(() => {
    loadPosts(1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Run once on mount

  // Infinite Scroll Trigger Callback (stable reference via useCallback)
  const handleIntersect = useCallback(() => {
    if (!loading && hasMore && !initialLoading) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadPosts(nextPage);
        return nextPage;
      });
    }
  }, [loading, hasMore, initialLoading, loadPosts]);

  // Hook up IntersectionObserver to sentinel element at bottom of feed
  const sentinelRef = useIntersectionObserver(
    { rootMargin: '250px', threshold: 0.1 },
    handleIntersect
  );

  // Optimistic UI Update with rollback on error
  const handleLikeToggle = useCallback(async (postId) => {
    // 1. Locate current post to cache pre-update snapshot
    let snapshotPost = null;
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          snapshotPost = { ...post };
          const willLike = !post.isLiked;
          return {
            ...post,
            isLiked: willLike,
            likeCount: willLike ? post.likeCount + 1 : Math.max(0, post.likeCount - 1)
          };
        }
        return post;
      });
    });

    if (!snapshotPost) return;

    const nextIsLiked = !snapshotPost.isLiked;

    try {
      // 2. Background PATCH request to mock API
      await patchPostLike(postId, { isLiked: nextIsLiked });

      // 3. Inform user with non-intrusive toast
      showToast(
        nextIsLiked ? 'Post added to your liked posts!' : 'Post removed from liked posts',
        'success',
        2500
      );
    } catch (err) {
      // 4. Rollback to snapshot on network / HTTP failure
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? snapshotPost : post))
      );
      showToast('Could not update like. Changes were reverted.', 'error', 4000);
    }
  }, [showToast]);

  // Comment Modal open/close handlers
  const handleOpenComments = useCallback((postId, postTitle) => {
    setActiveModal({
      isOpen: true,
      postId,
      postTitle
    });
  }, []);

  const handleCloseComments = useCallback(() => {
    setActiveModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Collect distinct hashtags from all fetched posts for autocomplete
  const allHashtags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach((post) => {
      post.hashtags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  // Filter and Sort in-memory posts based on debounced search needle & dropdown
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter by debounced hashtag needle
    const needle = debouncedSearch.trim().toLowerCase();
    if (needle) {
      result = result.filter((post) =>
        post.hashtags.some((tag) => tag.toLowerCase().includes(needle))
      );
    }

    // Sort order
    if (sortOption === 'popular') {
      result.sort((a, b) => b.likeCount - a.likeCount);
    } else if (sortOption === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [posts, debouncedSearch, sortOption]);

  return (
    <div className="feed-container">
      {/* Search, Filter & Sort Controls */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        debouncedSearch={debouncedSearch}
        sortOption={sortOption}
        onSortChange={setSortOption}
        allHashtags={allHashtags}
        onSelectHashtag={(tag) => setSearchTerm(tag)}
        totalResultsCount={filteredAndSortedPosts.length}
      />

      {/* Initial Loading Skeleton */}
      {initialLoading && (
        <div className="posts-list" aria-busy="true">
          {[1, 2, 3].map((n) => (
            <SkeletonPostCard key={n} />
          ))}
        </div>
      )}

      {/* Main Feed List */}
      {!initialLoading && (
        <div className="posts-list" role="feed" aria-label="Social media feed">
          {filteredAndSortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLikeToggle}
              onOpenComments={handleOpenComments}
              onTagClick={(tag) => setSearchTerm(tag)}
            />
          ))}

          {/* Empty Search Result State */}
          {filteredAndSortedPosts.length === 0 && !loading && (
            <div className="empty-state glass-card">
              <div className="empty-icon-wrap">
                <Inbox size={42} />
              </div>
              <h3 className="empty-title">No posts found</h3>
              <p className="empty-description">
                {debouncedSearch
                  ? `No posts matched "${debouncedSearch}". Try another hashtag or clear the filter.`
                  : 'No posts currently available.'}
              </p>
              {debouncedSearch && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search filter
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Infinite Scroll Bottom Marker Sentinel */}
      <div 
        ref={sentinelRef} 
        className="feed-sentinel" 
        aria-hidden="true"
      />

      {/* Loading More Indicator */}
      {loading && !initialLoading && (
        <div className="feed-loading-more" aria-live="polite">
          <Loader2 className="spinner" size={24} />
          <span>Fetching more posts...</span>
        </div>
      )}

      {/* Feed End Message */}
      {!hasMore && posts.length > 0 && !loading && (
        <div className="feed-end-badge glass-badge">
          <Sparkles size={16} />
          <span>You have explored all the latest updates!</span>
        </div>
      )}

      {/* Global Error Banner with Retry */}
      {error && (
        <div className="feed-error-banner glass-card" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="btn-retry"
            onClick={() => loadPosts(page)}
          >
            <RefreshCw size={15} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Lazy Comment Modal */}
      <CommentModal
        isOpen={activeModal.isOpen}
        postId={activeModal.postId}
        postTitle={activeModal.postTitle}
        onClose={handleCloseComments}
      />
    </div>
  );
}
