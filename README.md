# Social Media Application

A full-stack social media application built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Register/Login)
- User Profiles
- Create, Read, Update, and Delete Posts
- Like/Unlike Posts
- Comment on Posts
- Follow/Unfollow Users
- User Search
- Real-time Updates

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Other**: bcrypt, mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MohamedOsmanX/social-app.git
cd social-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory and add the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the server:
```bash
npm start
```

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

