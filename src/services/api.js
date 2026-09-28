import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Curated list of relevant tags to generate diverse, realistic hashtags
 */
const hashtagPool = [
  '#react',
  '#frontend',
  '#webdev',
  '#javascript',
  '#glassmorphism',
  '#performance',
  '#uiux',
  '#tech',
  '#design',
  '#coding',
  '#vite',
  '#developer'
];

/**
 * Transforms a raw API post into the application's required Post entity.
 * Augments with likeCount, isLiked, hashtags, and createdAt.
 * @param {Object} rawPost - The post from JSONPlaceholder.
 * @returns {Object} Augmented post with likes, date, and hashtags.
 */
export function transformPost(rawPost) {
  // Generate deterministic but realistic seed based on post ID
  const idSeed = rawPost.id || 1;
  const initialLikes = (idSeed * 17 + 23) % 95 + 5; // integer between 5 and 99

  // Select 2-3 hashtags including dynamic post tag
  const primaryTag = hashtagPool[(idSeed - 1) % hashtagPool.length];
  const secondaryTag = hashtagPool[(idSeed + 3) % hashtagPool.length];
  const postSpecificTag = `#post${idSeed}`;

  // Unique hashtags list
  const hashtags = Array.from(new Set([primaryTag, secondaryTag, postSpecificTag]));

  // Generate a realistic past timestamp (within last 30 days)
  const offsetDays = (idSeed % 28) + 1;
  const offsetHours = (idSeed % 24);
  const offsetMinutes = (idSeed * 7) % 60;
  const createdAtDate = new Date(Date.now() - (offsetDays * 86400000 + offsetHours * 3600000 + offsetMinutes * 60000));

  return {
    id: rawPost.id,
    userId: rawPost.userId,
    title: rawPost.title,
    body: rawPost.body,
    likeCount: initialLikes,
    isLiked: false,
    hashtags: hashtags,
    createdAt: createdAtDate.toISOString()
  };
}

/**
 * Fetch paginated posts from the REST API
 * @param {number} page 
 * @param {number} limit 
 * @param {Object} [options] 
 * @returns {Promise<{ posts: Array, totalCount: number }>}
 */
export async function fetchPosts(page = 1, limit = 10, options = {}) {
  const response = await apiClient.get('/posts', {
    params: {
      _page: page,
      _limit: limit
    },
    signal: options.signal
  });

  const totalCount = parseInt(response.headers['x-total-count'] || '100', 10);
  const transformedPosts = (response.data || []).map(transformPost);

  return {
    posts: transformedPosts,
    totalCount
  };
}

/**
 * Fetch comments for a specific post
 * @param {number|string} postId 
 * @param {Object} [options] 
 * @returns {Promise<Array>}
 */
export async function fetchComments(postId, options = {}) {
  const response = await apiClient.get(`/posts/${postId}/comments`, {
    signal: options.signal
  });
  return response.data || [];
}

/**
 * Simulate liking/updating a post on the mock API
 * @param {number|string} postId 
 * @param {Object} body 
 * @param {Object} [options] 
 * @returns {Promise<Object>}
 */
export async function patchPostLike(postId, body, options = {}) {
  const response = await apiClient.patch(`/posts/${postId}`, body, {
    signal: options.signal
  });
  return response.data;
}

export default apiClient;
