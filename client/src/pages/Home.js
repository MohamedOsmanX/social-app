import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, Button } from '@mui/material';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../utils/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetchPosts(1, 10);
      setPosts(response.posts);
      setHasMore(response.totalPages > 1);
      setPage(1);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetchPosts(nextPage, 10);
      
      setPosts((prevPosts) => [...prevPosts, ...response.posts]);
      setHasMore(nextPage < response.totalPages);
      setPage(nextPage);
    } catch (err) {
      console.error('Error fetching more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <Box>
      <CreatePost onPostCreated={handlePostCreated} />
      
      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: 200
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Card 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}
        >
          <Typography color="error" variant="body1">
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={loadPosts}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Card>
      ) : posts.length === 0 ? (
        <Card 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start by creating your first post or follow more users to see their posts here.
          </Typography>
        </Card>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              handleUpdatePost={handleUpdatePost}
            />
          ))}
          
          {hasMore && (
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Button
                variant="outlined"
                onClick={loadMorePosts}
                disabled={loadingMore}
                sx={{ px: 4 }}
              >
                {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Home; 