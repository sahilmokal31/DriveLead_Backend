const express = require('express');
const router = express.Router();
const { search } = require('../controller/search.controller');
const authMiddleware = require('../middleware/authJwt');

// Define the search route
router.post('/search', [authMiddleware], search);

module.exports = router;
