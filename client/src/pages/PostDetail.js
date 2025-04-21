import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fetchPostById, likePost, commentOnPost } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await fetchPostById(postId);
        setPost(fetchedPost);
        
        if (user) {
          setLiked(fetchedPost.likes.includes(user._id));
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found or has been removed');
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [postId, user]);
  
  const handleLikeClick = async () => {
    try {
      await likePost(postId);
      setLiked(!liked);
      
      setPost(prevPost => {
        const updatedLikes = liked
          ? prevPost.likes.filter(id => id !== user._id)
          : [...prevPost.likes, user._id];
          
        return {
          ...prevPost,
          likes: updatedLikes,
        };
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const newComment = await commentOnPost(postId, { text: commentText });
      
      setPost(prevPost => ({
        ...prevPost,
        comments: [...prevPost.comments, newComment],
      }));
      
      setCommentText('');
    } catch (err) {
      console.error('Error commenting on post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !post) {
    return (
      <Card sx={{ mb: 3, p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error || 'Post not found'}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Card>
    );
  }
  
  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Card sx={{ mb: 3, borderRadius: 3, overflow: 'visible' }}>
        <CardHeader
          avatar={
            <Avatar 
              src={post.user.profilePicture} 
              alt={post.user.username}
              component={Link}
              href={`/profile/${post.user.username}`}
              sx={{ cursor: 'pointer' }}
            />
          }
          title={
            <Link
              href={`/profile/${post.user.username}`}
              underline="hover"
              color="inherit"
              sx={{ fontWeight: 600 }}
            >
              {post.user.username}
            </Link>
          }
          subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        />
        
        <CardContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
        
        {post.image && (
          <CardMedia
            component="img"
            image={post.image}
            alt="Post image"
            sx={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        )}
        
        <CardActions sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              aria-label="like"
              onClick={handleLikeClick}
              color={liked ? 'primary' : 'default'}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.likes.length}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {post.comments.length} comments
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={user?.profilePicture} 
              alt={user?.username}
              sx={{ width: 36, height: 36, mr: 1.5 }}
            />
            <TextField
              fullWidth
              placeholder="Write a comment..."
              variant="outlined"
              size="small"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <>
                    <IconButton size="small">
                      <EmojiIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      type="submit"
                      disabled={!commentText.trim() || isSubmitting}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </>
                ),
                sx: {
                  borderRadius: 20,
                  bgcolor: 'action.hover',
                  '& fieldset': { border: 'none' },
                }
              }}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Comments ({post.comments.length})
            </Typography>
            
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <ListItem 
                    key={comment._id} 
                    alignItems="flex-start"
                    sx={{ px: 0, py: 1.5 }}
                  >
                    <Avatar
                      src={comment.user.profilePicture}
                      alt={comment.user.username}
                      sx={{ 
                        mr: 1.5, 
                        width: 40, 
                        height: 40,
                      }}
                    />
                    <Box 
                      sx={{ 
                        bgcolor: 'action.hover',
                        borderRadius: 3,
                        p: 1.5,
                        flex: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography 
                          component={Link}
                          href={`/profile/${comment.user.username}`}
                          underline="hover"
                          color="inherit"
                          fontWeight={600}
                          variant="body2"
                        >
                          {comment.user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {comment.text}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No comments yet. Be the first to comment!
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default PostDetail; 