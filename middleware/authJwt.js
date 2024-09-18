const { response } = require("../service/Response");
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return response(res, 'Token not found, please log in again!', {}, 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return response(res, 'Token not found, please log in again!', {}, 401);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return response(res, 'User session expired, please log in again!', {}, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return response(res, 'Authentication failed', { error: error.message }, 403);
  }
};

