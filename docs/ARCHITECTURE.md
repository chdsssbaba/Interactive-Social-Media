# System Architecture

## Overview

SphereFeed leverages a unidirectional data flow architecture designed to ensure high rendering performance, zero main-thread scroll lock, and immediate user feedback.

```mermaid
graph TD
    subgraph UI_Layer [User Interface]
        Navbar[Navbar Component]
        FilterBar[FilterBar Component]
        FeedContainer[FeedContainer]
        PostCard[PostCard Component (React.memo)]
        CommentModal[CommentModal (React Portal)]
        ToastSystem[Toast System]
    end

    subgraph Hooks_Layer [Custom React Hooks]
        useIntersectionObserver[useIntersectionObserver Hook]
        useDebounce[useDebounce Hook (300ms)]
        useToast[useToast Context Hook]
    end

    subgraph Service_Layer [Service Abstraction]
        ApiClient[Axios Client Instance]
        Transform[transformPost Adapter]
    end

    subgraph Backend [External REST API]
        JSONPlaceholder[JSONPlaceholder Mock Server]
    end

    FilterBar --> useDebounce
    FeedContainer --> useIntersectionObserver
    FeedContainer --> Transform
    Transform --> ApiClient
    ApiClient --> JSONPlaceholder
    PostCard --> FeedContainer
    CommentModal --> ApiClient
    FeedContainer --> ToastSystem
```

## Key Architectural Decisions

### 1. Zero Window-Scroll Listeners
Instead of attaching heavy `scroll` event listeners on `window`, visibility calculations are fully delegated to the browser's C++ rendering engine through the **Intersection Observer API**. A single sentinel `<div>` at the bottom of the feed triggers page increments with a `250px` lookahead `rootMargin`.

### 2. State Snapshot & Optimistic Rollback
When interacting with social buttons (e.g., Liking):
1. **Snapshot**: Current state (`isLiked`, `likeCount`) is captured locally.
2. **Immediate Update**: Feed state is synchronously toggled for a 0ms feedback response.
3. **Async Request**: A background HTTP `PATCH` is dispatched to the REST endpoint.
4. **Rollback**: If an error or network drop occurs, the state is seamlessly restored to the snapshot and an error toast notification informs the user.

### 3. Portal Isolation for Modals
Modals are rendered directly into `document.body` via `ReactDOM.createPortal`. This isolates z-index stacking contexts from parent cards, avoids clipping from `overflow: hidden` containers, and simplifies keyboard accessibility and focus trapping.

### 4. Debounced Pipeline
Typing into the hashtag search updates a local input state instantly (powering autocomplete suggestions in 0ms), while passing through `useDebounce(300ms)` before updating the filtered posts array. This guarantees that fast keystrokes never trigger layout recalculations or memory pressure.
