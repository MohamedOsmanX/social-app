import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Divider,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Image as ImageIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, fetchUserPosts, followUser, unfollowUser } from '../utils/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  
  const isOwnProfile = currentUser?.username === username;
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const profileData = await fetchUserProfile(username);
        setUser(profileData);
        
        if (currentUser) {
          setIsFollowing(profileData.followers.includes(currentUser._id));
        }
        
        const postsData = await fetchUserPosts(username);
        setPosts(postsData.posts);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [username, currentUser]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleFollowToggle = async () => {
    if (!currentUser || isUpdatingFollow) return;
    
    try {
      setIsUpdatingFollow(true);
      
      if (isFollowing) {
        await unfollowUser(user._id);
        setUser(prev => ({
          ...prev,
          followers: prev.followers.filter(id => id !== currentUser._id),
          followersCount: prev.followersCount - 1
        }));
      } else {
        await followUser(user._id);
        setUser(prev => ({
          ...prev,
          followers: [...prev.followers, currentUser._id],
          followersCount: prev.followersCount + 1
        }));
      }
      
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error updating follow status:', err);
    } finally {
      setIsUpdatingFollow(false);
    }
  };
  
  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const handleUpdatePost = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))
    );
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Box sx={{ py: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            User not found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The user you're looking for doesn't exist or may have been removed.
          </Typography>
        </Card>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Cover and Profile Picture */}
      <Box sx={{ position: 'relative', mb: 8 }}>
        <Box
          sx={{
            height: { xs: 150, sm: 250, md: 300 },
            bgcolor: 'primary.light',
            borderRadius: 3,
            backgroundImage: user.coverPicture 
              ? `url(${user.coverPicture})` 
              : 'linear-gradient(to right, #1877F2, #4293ff)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {isOwnProfile && (
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <ImageIcon />
            </IconButton>
          )}
        </Box>
        
        <Avatar
          src={user.profilePicture}
          alt={user.username}
          sx={{
            width: { xs: 100, sm: 150, md: 180 },
            height: { xs: 100, sm: 150, md: 180 },
            border: '4px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'absolute',
            bottom: { xs: -50, sm: -75, md: -90 },
            left: { xs: 24, sm: 32, md: 40 },
          }}
        />
        
        {isOwnProfile ? (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              position: 'absolute',
              right: 16,
              bottom: -24,
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              bottom: -24,
              display: 'flex',
              gap: 1,
            }}
          >
            <Button
              variant={isFollowing ? 'outlined' : 'contained'}
              startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
              onClick={handleFollowToggle}
              disabled={isUpdatingFollow}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
            <Button variant="outlined" startIcon={<MessageIcon />}>
              Message
            </Button>
          </Box>
        )}
      </Box>
      
      {/* Profile Info */}
      <Box sx={{ px: { xs: 2, sm: 4 }, mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {user.username}
        </Typography>
        {user.bio && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {user.bio}
          </Typography>
        )}
        
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <b>{user.followersCount || 0}</b> followers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>{user.followingCount || 0}</b> following
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>{posts.length}</b> posts
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {user.location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {user.location}
              </Typography>
            </Box>
          )}
          
          {user.work && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {user.work}
              </Typography>
            </Box>
          )}
          
          {user.education && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {user.education}
              </Typography>
            </Box>
          )}
          
          {user.birthday && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CakeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Born {new Date(user.birthday).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      <Divider />
      
      {/* Tabs */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              minHeight: 48,
            },
          }}
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Friends" />
          <Tab label="Photos" />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      <Box sx={{ px: { xs: 0, sm: 2 } }}>
        {/* Posts Tab */}
        {tabValue === 0 && (
          <Box>
            {isOwnProfile && <CreatePost onPostCreated={handlePostCreated} />}
            
            {posts.length === 0 ? (
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  No posts yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isOwnProfile 
                    ? "You haven't created any posts yet. Share your first post now!" 
                    : `${user.username} hasn't posted anything yet.`}
                </Typography>
              </Card>
            ) : (
              posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  handleUpdatePost={handleUpdatePost} 
                />
              ))
            )}
          </Box>
        )}
        
        {/* About Tab */}
        {tabValue === 1 && (
          <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About {user.username}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                      Personal Information
                    </Typography>
                    
                    <List disablePadding>
                      <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemText 
                          primary="Email" 
                          secondary={isOwnProfile ? user.email : "• • • • • • • •"} 
                          primaryTypographyProps={{ 
                            variant: 'body2', 
                            color: 'text.secondary' 
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body1' 
                          }}
                        />
                      </ListItem>
                      
                      <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemText 
                          primary="Location" 
                          secondary={user.location || "Not specified"} 
                          primaryTypographyProps={{ 
                            variant: 'body2', 
                            color: 'text.secondary' 
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body1' 
                          }}
                        />
                      </ListItem>
                      
                      <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemText 
                          primary="Birthday" 
                          secondary={user.birthday 
                            ? new Date(user.birthday).toLocaleDateString() 
                            : "Not specified"
                          } 
                          primaryTypographyProps={{ 
                            variant: 'body2', 
                            color: 'text.secondary' 
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body1' 
                          }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                      Work and Education
                    </Typography>
                    
                    <List disablePadding>
                      <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemText 
                          primary="Work" 
                          secondary={user.work || "Not specified"} 
                          primaryTypographyProps={{ 
                            variant: 'body2', 
                            color: 'text.secondary' 
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body1' 
                          }}
                        />
                      </ListItem>
                      
                      <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemText 
                          primary="Education" 
                          secondary={user.education || "Not specified"} 
                          primaryTypographyProps={{ 
                            variant: 'body2', 
                            color: 'text.secondary' 
                          }}
                          secondaryTypographyProps={{ 
                            variant: 'body1' 
                          }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
              
              {isOwnProfile && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                  >
                    Edit About Information
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Friends Tab */}
        {tabValue === 2 && (
          <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Friends
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.followersCount || 0} friends
              </Typography>
              
              {user.followersCount === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No friends to show
                  </Typography>
                </Box>
              ) : (
                <List>
                  {/* This would be populated with actual friends data */}
                  {/* Placeholder items for demonstration */}
                  {[1, 2, 3].map((item) => (
                    <ListItem key={item} disablePadding>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar src={`/static/images/avatar/${item + 1}.jpg`} />
                        </ListItemAvatar>
                        <ListItemText primary={`Friend ${item}`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Photos Tab */}
        {tabValue === 3 && (
          <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Photos
              </Typography>
              
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No photos to show
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Profile; 