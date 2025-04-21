import axios from 'axios';

// Posts API
export const fetchPosts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPostById = async (postId) => {
  try {
    const response = await axios.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post('/api/posts', postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`/api/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await axios.post(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const commentOnPost = async (postId, commentData) => {
  try {
    const response = await axios.post(`/api/posts/${postId}/comment`, commentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User API
export const fetchUserProfile = async (username) => {
  try {
    const response = await axios.get(`/api/users/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserPosts = async (username, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/posts/user/${username}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    const response = await axios.post(`/api/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await axios.post(`/api/users/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search API
export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`/api/users?search=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 