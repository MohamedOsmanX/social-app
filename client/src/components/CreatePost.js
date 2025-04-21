import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Photo as PhotoIcon,
  Videocam as VideoIcon,
  EmojiEmotions as EmojiIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../utils/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postText.trim() && !image) {
      setError('Post cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('text', postText);
      if (image) {
        formData.append('image', image);
      }
      
      const newPost = await createPost(formData);
      
      // Clear form
      setPostText('');
      setImage(null);
      setImagePreview('');
      
      // Notify parent component about the new post
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Avatar 
              src={user?.profilePicture}
              alt={user?.username}
              sx={{ mr: 1.5 }}
            />
            <TextField
              fullWidth
              placeholder={`What's on your mind, ${user?.username}?`}
              variant="outlined"
              multiline
              rows={2}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              InputProps={{
                sx: { 
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  '& fieldset': { border: 'none' },
                }
              }}
            />
          </Box>
          
          {imagePreview && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img 
                src={imagePreview} 
                alt="Post preview" 
                style={{ 
                  width: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                }} 
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
                onClick={removeImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                component="label" 
                startIcon={<PhotoIcon />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              
              <Button 
                startIcon={<VideoIcon />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                Video
              </Button>
              
              <Button 
                startIcon={<EmojiIcon />}
                sx={{ color: 'text.secondary', textTransform: 'none' }}
              >
                Feeling
              </Button>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || (!postText.trim() && !image)}
              sx={{ 
                borderRadius: 5,
                px: 3,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Post'
              )}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost; 