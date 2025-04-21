const express = require('express');
const searchRouter = express.Router();
const { searchUsers, searchPosts } = require('../controllers/searchController');

searchRouter.get('/users', searchUsers);
searchRouter.get('/posts', searchPosts);

module.exports = searchRouter;