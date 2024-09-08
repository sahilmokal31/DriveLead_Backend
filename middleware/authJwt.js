const { response } = require("../service/Response");
const jwt = require('jsonwebtoken');
const User = require('../model/user.model')


module.exports = verifyToken = async (req, res, next) => {

  console.log(req.headers)

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return response(res, 'token not found, please login again!', {}, 401)
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return response(res, 'token not found, please login again!', {}, 401)
  }

  const userId = await jwt.decode(token, process.env.ACCESS_SECRET)

  const user = await User.findOne({userId : userId.userId})

  if (!user || user === undefined) {
    return response(res,'user session expired!, please login again!',{},401)
  }

  req.user = user

  next();
};

