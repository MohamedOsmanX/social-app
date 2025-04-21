# Social Media Application

A full-stack social media application built with Node.js, Express, MongoDB and React.

## Features

- User Authentication (Register/Login)
- User Profiles
- Create, Read, Update, and Delete Posts
- Like/Unlike Posts
- Comment on Posts
- Follow/Unfollow Users
- User Search
- Modern Responsive UI
- Real-time Updates

## Tech Stack

### Backend
- **Server**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Other**: bcrypt, mongoose

### Frontend
- **Framework**: React.js
- **UI Library**: Material UI
- **Routing**: React Router
- **State Management**: Context API
- **HTTP Client**: Axios
- **Date Formatting**: date-fns

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-app.git
cd social-app
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a .env file in the root directory and add the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the development server:
```bash
# Start backend server
npm run dev

# In a separate terminal, start the frontend
cd client
npm start
```

## Project Structure

```
social-app/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   └── src/                 # React source files
│       ├── components/      # Reusable components
│       ├── context/         # Context providers
│       ├── pages/           # Page components
│       └── utils/           # Utility functions
├── controllers/             # Express route controllers
├── middlewares/             # Express middlewares
├── models/                  # Mongoose models
├── routes/                  # Express routes
└── server.js                # Express app
```

## UI Features

- Modern Facebook-inspired design
- Responsive layout for mobile, tablet, and desktop
- Clean and intuitive user interface
- Material Design components
- Dark mode support
- Interactive post and comment feeds
- User profiles with cover photos and avatar images
- Real-time notifications

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Users
- GET /api/users - Search users
- GET /api/users/:id - Get user profile
- PUT /api/users/profile - Update user profile
- POST /api/users/:id/follow - Follow a user
- POST /api/users/:id/unfollow - Unfollow a user

### Posts
- GET /api/posts - Get all posts
- POST /api/posts - Create a post
- GET /api/posts/:id - Get a post
- PUT /api/posts/:id - Update a post
- DELETE /api/posts/:id - Delete a post
- POST /api/posts/:id/like - Like a post
- POST /api/posts/:id/comment - Comment on a post

## Frontend Pages

- **Login/Register**: User authentication pages with form validation
- **Home Feed**: Main feed showing posts from followed users
- **Profile**: User profile with posts, about info, friends, and photos tabs
- **Post Detail**: Detailed view of a single post with comments
- **Not Found**: Custom 404 page

## Screenshots

*Coming soon*

## License

MIT


