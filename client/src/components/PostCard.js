import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Divider,
  TextField,
  Button,
  Collapse,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { likePost, commentOnPost } from '../utils/api';

const PostCard = ({ post, handleUpdatePost }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [saved, setSaved] = useState(false);
  const open = Boolean(anchorEl);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeClick = async () => {
    try {
      await likePost(post._id);
      setLiked(!liked);
      
      // Update post in parent component
      const updatedLikes = liked
        ? post.likes.filter((id) => id !== user._id)
        : [...post.likes, user._id];
        
      handleUpdatePost({
        ...post,
        likes: updatedLikes,
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleSaveClick = () => {
    setSaved(!saved);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await commentOnPost(post._id, { text: commentText });
      
      // Update post in parent component
      handleUpdatePost({
        ...post,
        comments: [...post.comments, newComment],
      });
      
      setCommentText('');
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <CardHeader
        avatar={
          <Avatar 
            component={Link}
            to={`/profile/${post.user.username}`}
            src={post.user.profilePicture} 
            alt={post.user.username}
            sx={{ cursor: 'pointer' }}
          />
        }
        action={
          <IconButton aria-label="settings" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography 
            component={Link}
            to={`/profile/${post.user.username}`}
            variant="subtitle1" 
            fontWeight={500}
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            {post.user.username}
          </Typography>
        }
        subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      />
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user?._id === post.user._id ? (
          [
            <MenuItem key="edit" onClick={handleMenuClose}>Edit Post</MenuItem>,
            <MenuItem key="delete" onClick={handleMenuClose}>Delete Post</MenuItem>
          ]
        ) : (
          [
            <MenuItem key="save" onClick={handleMenuClose}>Save Post</MenuItem>,
            <MenuItem key="report" onClick={handleMenuClose}>Report Post</MenuItem>
          ]
        )}
      </Menu>
      
      <CardContent sx={{ py: 1 }}>
        <Typography variant="body1" color="text.primary">
          {post.text}
        </Typography>
      </CardContent>
      
      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{ maxHeight: 500, objectFit: 'contain' }}
        />
      )}
      
      <CardActions sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            aria-label="like post"
            onClick={handleLikeClick}
            color={liked ? 'primary' : 'default'}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.likes.length}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <IconButton 
            aria-label="comment"
            onClick={handleExpandClick}
          >
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.comments.length}
          </Typography>
        </Box>
        
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton 
          aria-label="bookmark"
          onClick={handleSaveClick}
          color={saved ? 'primary' : 'default'}
        >
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
      
      <Divider />
      
      <Box sx={{ px: 2, py: 1 }}>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={user?.profilePicture} 
            alt={user?.username}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            variant="outlined"
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
                    disabled={!commentText.trim()}
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
            sx={{ my: 1 }}
          />
        </Box>
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 2 }}>
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 2, display: 'flex' }}>
                <Avatar
                  src={comment.user.profilePicture}
                  alt={comment.user.username}
                  sx={{ width: 32, height: 32, mr: 1.5 }}
                />
                <Box 
                  sx={{ 
                    bgcolor: 'action.hover',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '85%'
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    component="span"
                    sx={{ fontWeight: 500 }}
                  >
                    {comment.user.username}
                  </Typography>
                  <Typography variant="body2">
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard; 