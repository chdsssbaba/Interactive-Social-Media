import React, { useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

/**
 * FilterBar component for hashtag searching, debounce handling, autocomplete suggestions,
 * and sort selection (All Posts, Popular, Recent).
 */
export default function FilterBar({
  searchTerm,
  onSearchChange,
  debouncedSearch,
  sortOption,
  onSortChange,
  allHashtags = [],
  onSelectHashtag,
  totalResultsCount
}) {
  // Autocomplete matching: instant feedback based on raw searchTerm
  const suggestions = useMemo(() => {
    const raw = searchTerm.trim().toLowerCase();
    if (!raw || raw === '#' || raw.length < 2) return [];

    const normalizedNeedle = raw.startsWith('#') ? raw : `#${raw}`;
    return allHashtags
      .filter((tag) => tag.toLowerCase().includes(normalizedNeedle.toLowerCase()))
      .slice(0, 5);
  }, [searchTerm, allHashtags]);

  return (
    <div className="filter-bar glass-container">
      <div className="filter-controls-row">
        {/* Search input with debounced querying */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search hashtags (e.g. #react, #frontend)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Filter posts by hashtag"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Autocomplete suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="autocomplete-dropdown glass-dropdown">
              <span className="autocomplete-header">Matching Hashtags</span>
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="autocomplete-item"
                  onClick={() => onSelectHashtag(tag)}
                >
                  <span className="autocomplete-tag-name">{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="sort-wrapper">
          <SlidersHorizontal size={16} className="sort-icon" />
          <select
            id="sort-select"
            className="sort-select glass-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort feed"
          >
            <option value="all">All Posts (Default)</option>
            <option value="popular">Popular (Most Liked)</option>
            <option value="recent">Recent (Newest First)</option>
          </select>
        </div>
      </div>

      {/* Filter status indicator / active tag badge */}
      {(debouncedSearch || sortOption !== 'all') && (
        <div className="active-filters-row">
          <span className="filters-label">Active Filters:</span>
          {debouncedSearch && (
            <span className="active-filter-badge">
              Tag: <strong>{debouncedSearch}</strong>
              <button 
                type="button" 
                onClick={() => onSearchChange('')}
                className="badge-remove-btn"
                aria-label="Remove search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {sortOption !== 'all' && (
            <span className="active-filter-badge sort-badge">
              Sorted by: <strong>{sortOption === 'popular' ? 'Popularity' : 'Recent'}</strong>
            </span>
          )}
          <span className="filtered-count">({totalResultsCount} matching)</span>
        </div>
      )}
    </div>
  );
}
