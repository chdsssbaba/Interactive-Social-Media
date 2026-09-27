# Project Directory Structure

SphereFeed uses a modular, domain-driven structure that isolates UI primitives, domain-specific feed elements, reusable custom hooks, services, and utility helpers.

```text
├── .env.example                     # Sample configuration declaring external API endpoints
├── .env                             # Local environment variables
├── index.html                       # HTML5 entry with meta tags and Inter typography
├── package.json                     # Project manifest and build scripts
├── vite.config.js                   # Vite bundler configuration
│
├── docs/                            # Practical project documentation
│   ├── ARCHITECTURE.md              # Architectural breakdown & Mermaid diagram
│   ├── CHANGELOG.md                 # Project version history and commit tracking
│   ├── DEPLOYMENT.md                # Render deployment configuration guide
│   ├── FEATURES.md                  # Comprehensive requirements audit table
│   ├── PROJECT_STRUCTURE.md         # Folder and file responsibility matrix
│   ├── README.md                    # Documentation index
│   ├── WORKFLOW.md                  # Infinite scrolling & like rollback flows
│   └── images/                      # Rendered screenshots and visual diagrams
│       ├── desktop.png              # Desktop view (1280px)
│       ├── tablet.png               # Tablet view (768px)
│       ├── mobile.png               # Mobile view (375px)
│       └── modal-desktop.png        # Open comments modal
│
├── screenshots/                     # Viewport responsiveness proofs for submission
│   ├── desktop.png                  # Desktop layout verification
│   ├── tablet.png                   # Tablet layout verification
│   └── mobile.png                   # Mobile layout verification
│
└── src/                             # Source code root
    ├── main.jsx                     # Application bootstrap and React DOM mounting
    ├── App.jsx                      # App root container with ambient glow & layouts
    ├── App.css                      # App component CSS overrides
    ├── index.css                    # Design system (Glassmorphism, colors, resets)
    │
    ├── components/                  # Component library
    │   ├── feed/                    # Feed domain components
    │   │   ├── CommentModal.jsx     # Lazy comments dialog mounted via React Portal
    │   │   ├── FeedContainer.jsx    # Core feed orchestrator, pagination & state
    │   │   ├── FilterBar.jsx        # Search input, debounce & sort dropdown
    │   │   ├── PostCard.jsx         # Individual post card with optimistic like button
    │   │   └── SkeletonCard.jsx     # Shimmer skeleton loader for initial paint
    │   │
    │   └── ui/                      # Reusable UI controls
    │       ├── Navbar.jsx           # Global header navigation with live status
    │       ├── Toast.jsx            # Toast notification item with dismiss animation
    │       └── ToastContext.jsx     # Context provider for dispatching toasts
    │
    ├── hooks/                       # Custom reusable React hooks
    │   ├── useDebounce.js           # 300ms input debouncing hook
    │   └── useIntersectionObserver.js # Generic viewport intersection observer hook
    │
    ├── services/                    # API integration layer
    │   └── api.js                   # Axios client instance, endpoints & transformPost
    │
    └── utils/                       # Utility and mock helper functions
        └── formatters.js            # Relative time formatters and mock social attributes
```

## Component Boundaries

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `App.jsx` | Top-level layout container, background ambient glow, desktop sidebar | Global Providers |
| `Navbar.jsx` | Brand identity, live REST connection status | Presentation |
| `FeedContainer.jsx` | Orchestrates infinite scroll, manages in-memory posts, handles optimistic likes | Feed State, Page, Filters |
| `FilterBar.jsx` | Manages search query, displays autocomplete dropdown and sort select | `searchTerm`, `sortOption` |
| `PostCard.jsx` | Renders title, author info, image, hashtags, like count, comments trigger | Memoized Post object |
| `CommentModal.jsx` | Renders comments in portal, fetches data lazily on open, handles `Escape` | `isOpen`, `postId`, `onClose` |
| `ToastContext.jsx` | Provides `showToast(msg, type)` to trigger non-intrusive alerts | Global Toast State |
