
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const catchAsync = require('./utils/catchAsync');



const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  
  const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
  
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };
  
  exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      
      email: req.body.email,
      password: req.body.password,
      
    });
  
    
    
  
    createSendToken(newUser, 201, req, res);
  });