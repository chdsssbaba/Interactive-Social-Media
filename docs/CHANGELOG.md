# Changelog & Development History

All notable changes and milestones across the 7-day academic development cycle are documented below.

## Academic Timeline (27/09/2026 – 03/10/2026)

### Day 1: Setup & Project Initialization (27 Sep 2026)
- Initial project scaffolding with Vite and React
- Configured project environment variables and `.env.example`
- Established domain folder structure (`components/`, `hooks/`, `services/`, `utils/`)

### Day 2: Service Layer & Data Augmentation (28 Sep 2026)
- Implemented Axios client in `src/services/api.js`
- Added post entity transformation layer (`transformPost`)
- Created formatting utilities for relative dates and avatars in `src/utils/formatters.js`

### Day 3: Custom Hooks & Core Feed (29 Sep 2026)
- Created `useIntersectionObserver` custom hook with cleanup
- Built `FeedContainer` with initial 10-post batch loading
- Connected bottom sentinel for infinite scrolling triggers

### Day 4: Post Card & Optimistic Liking (30 Sep 2026)
- Developed `PostCard` component with semantic `<article>` and glassmorphism styling
- Implemented optimistic UI update with pre-update snapshot caching
- Added automatic rollback logic and error notification trigger

### Day 5: Comment Modal & Debounced Filtering (01 Oct 2026)
- Created `CommentModal` rendered via React Portal to `document.body`
- Added lazy fetching of post comments with keyboard `Escape` listener
- Implemented `useDebounce` hook (300ms) and `FilterBar` with hashtag search
- Added instant autocomplete suggestions dropdown and sort selector

### Day 6: UX Polish & Responsive Design (02 Oct 2026)
- Implemented `ToastContext` provider and glassmorphic toast notification component
- Created `SkeletonCard` shimmer placeholder for initial loading state
- Added mobile-first responsive layout tested from 320px to 1440px
- Added visible `:focus-visible` accessibility rings

### Day 7: Testing, Documentation & Deployment (03 Oct 2026)
- Conducted responsive viewport testing across mobile, tablet, and desktop
- Captured proof screenshots in `screenshots/` and `docs/images/`
- Compiled comprehensive documentation in `docs/` with Mermaid diagrams
- Prepared Render deployment configuration and verified production build
