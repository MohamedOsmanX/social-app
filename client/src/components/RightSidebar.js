import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Button,
  Badge,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MoreHoriz as MoreIcon,
  VideoCall as VideoCallIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const friendRequests = [
  {
    id: 1,
    name: 'Alex Johnson',
    mutualFriends: 3,
    avatar: '/static/images/avatar/2.jpg',
  },
  {
    id: 2,
    name: 'Emma Williams',
    mutualFriends: 5,
    avatar: '/static/images/avatar/3.jpg',
  },
];

const onlineFriends = [
  {
    id: 1,
    name: 'David Miller',
    avatar: '/static/images/avatar/4.jpg',
    online: true,
  },
  {
    id: 2,
    name: 'Sophie Taylor',
    avatar: '/static/images/avatar/5.jpg',
    online: true,
  },
  {
    id: 3,
    name: 'James Wilson',
    avatar: '/static/images/avatar/6.jpg',
    online: true,
  },
  {
    id: 4,
    name: 'Olivia Brown',
    avatar: '/static/images/avatar/7.jpg',
    online: true,
  },
  {
    id: 5,
    name: 'Daniel Davis',
    avatar: '/static/images/avatar/8.jpg',
    online: true,
  },
];

const RightSidebar = () => {
  return (
    <Box sx={{ p: 2 }}>
      {/* Friend Requests */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Friend Requests
        </Typography>

        <List sx={{ p: 0 }}>
          {friendRequests.map((request) => (
            <React.Fragment key={request.id}>
              <ListItem
                alignItems="flex-start"
                sx={{ px: 0, py: 1 }}
              >
                <ListItemAvatar>
                  <Avatar alt={request.name} src={request.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={request.name}
                  secondary={`${request.mutualFriends} mutual friends`}
                  sx={{ mb: 1 }}
                />
              </ListItem>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, ml: 7 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Delete
                </Button>
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        
        <Button
          fullWidth
          sx={{
            mt: 1,
            color: 'primary.main',
            textTransform: 'none',
            fontSize: '0.9rem',
          }}
        >
          See all friend requests
        </Button>
      </Paper>

      {/* Contacts */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2 
          }}
        >
          <Typography variant="h6">
            Contacts
          </Typography>
          <Box>
            <IconButton size="small">
              <VideoCallIcon />
            </IconButton>
            <IconButton size="small">
              <SearchIcon />
            </IconButton>
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ p: 0 }}>
          {onlineFriends.map((friend) => (
            <ListItem
              key={friend.id}
              button
              sx={{ 
                px: 1, 
                py: 0.5, 
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <OnlineBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar
                    alt={friend.name}
                    src={friend.avatar}
                    sx={{ width: 36, height: 36 }}
                  />
                </OnlineBadge>
              </ListItemAvatar>
              <ListItemText primary={friend.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default RightSidebar; 