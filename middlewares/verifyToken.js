const httpStatusText = require('../utils/httpStatusText');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const appError = require('../utils/appError');
dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']|| req.headers['Authorization'];
    if (authHeader) {

      const token = authHeader.split(' ')[1];

      try{
      const currentUser = jwt.verify(token, process.env.JWT_SECRET);
      req.currentUser = currentUser;
      console.log("current logged in user:", currentUser);

      next();}catch(err){
        const error =appError.create("Invalid token", 401, httpStatusText.ERROR);
        return next(error);
        // return res.status(401).json({ status: httpStatusText.FAIL, message: 'Invalid token' });
      }
      
  
    } else {
        const error =appError.create("Token is required", 401, httpStatusText.ERROR);
        return next(error);
        // return res.status(401).json({ status: httpStatusText.FAIL, message: 'Token is required' });
    }
  };
  
  module.exports = verifyToken;