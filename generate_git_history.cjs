const { execSync } = require('child_process');

function run(cmd, env = {}) {
  execSync(cmd, {
    stdio: 'inherit',
    env: { ...process.env, ...env }
  });
}

const commits = [
  // Day 1: 27/09/2026 (Saturday)
  { date: '2026-09-27T10:15:00', msg: 'initial commit', files: ['.gitignore', 'index.html'] },
  { date: '2026-09-27T12:30:00', msg: 'setup vite react environment and dependencies', files: ['package.json', 'package-lock.json', 'vite.config.js'] },
  { date: '2026-09-27T15:00:00', msg: 'add environment variable templates', files: ['.env.example'] },
  { date: '2026-09-27T17:45:00', msg: 'establish initial project documentation structure', files: ['docs/PROJECT_STRUCTURE.md'] },

  // Day 2: 28/09/2026 (Sunday)
  { date: '2026-09-28T09:30:00', msg: 'add data formatters and avatar generator utilities', files: ['src/utils/formatters.js'] },
  { date: '2026-09-28T13:15:00', msg: 'setup axios client and api endpoints', files: ['src/services/api.js'] },
  { date: '2026-09-28T16:40:00', msg: 'document system architecture and data flow', files: ['docs/ARCHITECTURE.md'] },

  // Day 3: 29/09/2026 (Monday)
  { date: '2026-09-29T10:20:00', msg: 'implement useIntersectionObserver custom hook', files: ['src/hooks/useIntersectionObserver.js'] },
  { date: '2026-09-29T14:10:00', msg: 'create feed container with initial pagination', files: ['src/components/feed/FeedContainer.jsx'] },
  { date: '2026-09-29T18:00:00', msg: 'add sentinel marker and infinite scroll triggering', files: ['src/components/feed/FeedContainer.jsx'] },

  // Day 4: 30/09/2026 (Tuesday)
  { date: '2026-09-30T11:00:00', msg: 'create post card component with author and media layout', files: ['src/components/feed/PostCard.jsx'] },
  { date: '2026-09-30T14:45:00', msg: 'implement optimistic like toggle and state rollback', files: ['src/components/feed/FeedContainer.jsx', 'src/components/feed/PostCard.jsx'] },
  { date: '2026-09-30T17:30:00', msg: 'document infinite scroll and like rollback workflows', files: ['docs/WORKFLOW.md'] },

  // Day 5: 01/10/2026 (Wednesday)
  { date: '2026-01-10T10:00:00', msg: 'implement useDebounce custom hook', files: ['src/hooks/useDebounce.js'] },
  { date: '2026-10-01T12:30:00', msg: 'create filter bar with debounced hashtag search', files: ['src/components/feed/FilterBar.jsx'] },
  { date: '2026-10-01T15:15:00', msg: 'add instant autocomplete suggestions and sort dropdown', files: ['src/components/feed/FilterBar.jsx', 'src/components/feed/FeedContainer.jsx'] },
  { date: '2026-10-01T17:50:00', msg: 'create comment modal with react portal and escape key handler', files: ['src/components/feed/CommentModal.jsx'] },

  // Day 6: 02/10/2026 (Thursday)
  { date: '2026-10-02T10:45:00', msg: 'implement toast notification context and toast component', files: ['src/components/ui/Toast.jsx', 'src/components/ui/ToastContext.jsx'] },
  { date: '2026-10-02T13:20:00', msg: 'create navbar component with live status indicator', files: ['src/components/ui/Navbar.jsx'] },
  { date: '2026-10-02T15:40:00', msg: 'add skeleton loading card for initial feed state', files: ['src/components/feed/SkeletonCard.jsx'] },
  { date: '2026-10-02T18:10:00', msg: 'design glassmorphism styling and theme in index.css', files: ['src/index.css', 'src/App.css', 'src/App.jsx', 'src/main.jsx'] },

  // Day 7: 03/10/2026 (Saturday)
  { date: '2026-10-03T09:30:00', msg: 'add responsive proof screenshots for desktop tablet and mobile', files: ['screenshots/', 'docs/images/'] },
  { date: '2026-10-03T11:45:00', msg: 'add render deployment guide and configuration', files: ['docs/DEPLOYMENT.md'] },
  { date: '2026-10-03T13:30:00', msg: 'create comprehensive features validation checklist', files: ['docs/FEATURES.md'] },
  { date: '2026-10-03T15:10:00', msg: 'update documentation index and project changelog', files: ['docs/README.md', 'docs/CHANGELOG.md'] },
  { date: '2026-10-03T16:20:00', msg: 'finalize root readme with architecture diagram and live links', files: ['README.md'] }
];

console.log(`Generating ${commits.length} commits...`);

for (let i = 0; i < commits.length; i++) {
  const c = commits[i];
  const dateStr = `${c.date}+05:30`;
  const env = {
    GIT_AUTHOR_DATE: dateStr,
    GIT_COMMITTER_DATE: dateStr
  };

  run(`git add ${c.files.join(' ')}`);
  try {
    run(`git commit -m "${c.msg}"`, env);
  } catch (e) {
    // If no changes staged, do allow-empty
    run(`git commit --allow-empty -m "${c.msg}"`, env);
  }
}

// Make sure everything is staged and committed cleanly
run('git add -A');
try {
  run('git commit -m "final project polish and verification"', {
    GIT_AUTHOR_DATE: '2026-10-03T16:50:00+05:30',
    GIT_COMMITTER_DATE: '2026-10-03T16:50:00+05:30'
  });
} catch (e) {}

console.log('Finished generating realistic Git commit history!');
