const CatchAsynError = require("../middleware/CatchAsynError");
const { response } = require("../service/Response");
const { z } = require('zod');
const User = require('../model/user.model'); // Ensure this path is correct
const Token = require('../model/token.model'); // Ensure this path is correct
const generateOtp = require('../utils/generateOtp'); // Utility function to generate OTP
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const ISignup = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
});

const IVerify = z.object({
  email : z.string().email(),
  otp : z.number()
})

const ILogin = z.object({
  email : z.string().email(),
  password : z.string()
})

exports.Signup = CatchAsynError(async (req, res) => {
  try {
    const { email, password, confirmPassword } = ISignup.parse(req.body);

    if (password !== confirmPassword) {
      return response(res, 'Passwords do not match!', {}, 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 'Email already exists!', {}, 400);
    }

    const hashPassword = await bcrypt.hash(password,10)
    
    const otp = generateOtp();
    // await new Token({ email, otp,password : hashPassword }).save(); 
    const updatedToken = await Token.findOneAndUpdate(
      { email },
      { otp, password: hashPassword },  
      { upsert: true, new: true, runValidators: true }
    );
    console.log(updatedToken)

    return response(res, 'OTP sent to your email.', {}, 200);
  } catch (error) {
    return response(res, error.message, {}, 401);
  }
});




exports.VerifyOtp = CatchAsynError(async (req, res) => {
  try {
    const { email, otp } = IVerify.parse(req.body)

    const token = await Token.findOne({ email, otp });

    if (!token) {
      return response(res, 'Invalid OTP!', {}, 401);
    }

    if(email !== email){
      return response(res,'Otp is invalid!',{},401)
    }

    await new User({ email : token.email, password: token.password,userId : await User.countDocuments() }).save();
    await Token.deleteOne({ email, otp });

    return response(res, 'OTP verified, please login!', {}, 200);
  } catch (error) {
    return response(res, error.message, {}, 401);
  }
});

exports.Login = CatchAsynError(async (req, res) => {
  try {
    const { email, password } = ILogin.parse(req.body)
    
    const user = await User.findOne({ email });

    if (!user) {
      return response(res, 'User not found!', {}, 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return response(res, 'Invalid credentials!', {}, 401);
    }

    const token = jwt.sign({ userId: user.userId }, process.env.ACCESS_SECRET, { expiresIn: '10h' });

    // Send token in response and set in cookie
    res.cookie('access_token', token, { httpOnly: true });
    return response(res, 'Login successful!', { token }, 200);
  } catch (error) {
    return response(res, error.message, {}, 401);
  }
});


exports.Logout = CatchAsynError(async (req, res) => {
  try {
    res.clearCookie('access_token'); 
    return response(res, 'Logged out successfully!', {}, 200);
  } catch (error) {
    return response(res, error.message, {}, 401);
  }
});

exports.Me = CatchAsynError(async(req,res) => {
  return response(res,'user data fetched!',{data : req.user},401)
})