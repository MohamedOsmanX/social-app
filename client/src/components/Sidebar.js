import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Feed as FeedIcon,
  Event as EventIcon,
  VideoLibrary as VideoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const mainMenuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Friends', icon: <GroupIcon />, path: '/friends' },
  { text: 'Saved', icon: <BookmarkIcon />, path: '/saved' },
  { text: 'Events', icon: <EventIcon />, path: '/events' },
  { text: 'Videos', icon: <VideoIcon />, path: '/videos' },
  { text: 'News Feed', icon: <FeedIcon />, path: '/news' },
];

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: 'none',
        p: 2
      }}
    >
      {onClose && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <CloseIcon onClick={onClose} sx={{ cursor: 'pointer' }} />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar 
          src="/static/images/avatar/1.jpg" 
          alt={user?.username}
          sx={{ width: 60, height: 60 }}
        />
        <Box ml={2}>
          <Typography variant="h6">{user?.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            View your profile
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path === '/profile' ? `/profile/${user?.username}` : item.path}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" color="text.secondary" sx={{ mx: 2, mb: 1 }}>
        Shortcuts
      </Typography>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <GroupIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Web Developers Group" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <GroupIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="UI/UX Design Community" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <GroupIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="JavaScript Enthusiasts" />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © 2023 SocialApp • Privacy • Terms • Cookies
        </Typography>
      </Box>
    </Paper>
  );
};

export default Sidebar; 