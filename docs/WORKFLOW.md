# Workflow & Data Processing Pipelines

This document details the exact execution sequences of the core interactive workflows in SphereFeed.

---

## 1. Infinite Scroll Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Sentinel as Bottom Marker Sentinel
    participant Hook as useIntersectionObserver
    participant Feed as FeedContainer State
    participant API as JSONPlaceholder API

    User->>Sentinel: Scrolls down near bottom of feed (within 250px)
    Sentinel->>Hook: Triggers intersection callback
    Hook->>Feed: Checks (!loading && hasMore)
    Feed->>Feed: Sets loading = true
    Feed->>API: GET /posts?_page=X&_limit=10
    API-->>Feed: Returns batch of 10 posts
    Feed->>Feed: Transforms posts (adds likes, tags, dates)
    Feed->>Feed: Appends batch to posts array
    Feed->>Feed: Updates hasMore flag & resets loading = false
    Feed-->>User: Newly appended post cards render smoothly
```

---

## 2. Optimistic UI Like & Rollback Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Card as PostCard Component
    participant Feed as FeedContainer State
    participant API as REST API Backend
    participant Toast as Toast Notification

    User->>Card: Clicks 'Like' Button
    Card->>Feed: Dispatches handleLikeToggle(postId)
    Feed->>Feed: Saves snapshot (previousIsLiked, previousLikeCount)
    Feed->>Card: Synchronously flips isLiked and increments likeCount (+1)
    Card-->>User: Heart fills red and micro-animation plays immediately
    
    alt Network Request Succeeds
        Feed->>API: PATCH /posts/:id { isLiked: true }
        API-->>Feed: HTTP 200 OK
        Feed->>Toast: showToast("Post added to your liked posts!", "success")
        Toast-->>User: Displays green success pill (auto-dismiss 3s)
    else Network Request Fails / Timeout
        Feed->>API: PATCH /posts/:id (Network Drop / 404 / 500)
        API-->>Feed: Error caught in catch block
        Feed->>Feed: Reverts post to cached snapshot state
        Feed->>Card: Updates UI back to original likeCount & unliked
        Feed->>Toast: showToast("Could not update like. Changes were reverted.", "error")
        Toast-->>User: Displays red warning pill
    end
```

---

## 3. Search Debounce & Instant Autocomplete

```mermaid
flowchart TD
    A[User types in hashtag input] --> B[Immediate State: searchTerm]
    B --> C[Instant Filter: Autocomplete Suggestions Dropdown]
    B --> D[useDebounce Hook: 300ms Delay]
    D -->|Wait 300ms after user stops typing| E[debouncedSearch state updates]
    E --> F[In-memory filter posts array]
    F --> G[Re-render filtered feed list]
```
