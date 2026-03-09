const {validationResult} = require('express-validator');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const User = require('../models/user-model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const generateJWT = require('../utils/generateJWT');
dotenv.config();

const getAllUsers = asyncWrapper(async (req, res) => {
    //pagination for courses
  const limit = req.query.limit;
  const page = req.query.page;
  const skip = (page - 1) * limit;

  const users = await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users: users } });

});


const register =asyncWrapper(async(req,res,next)=>{
    const{ firstName, lastName, email, password, role}=req.body;

    if(!firstName || !lastName || !email || !password){
        appError.create("Name, email and password are required", 400, httpStatusText.FAIL);
        return next(appError);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        appError.create("Email/User already exists", 400, httpStatusText.FAIL);
        return next(appError);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
        firstName,
        lastName, 
        email,
        password: hashedPassword,
        role,
        avatar:req.file.filename
    });

        //generate token for the user
        const token = await generateJWT({
            email: newUser.email,
            id: newUser._id,
            role: newUser.role
        });
    newUser.token = token;
    await newUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login =asyncWrapper(async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){
        appError.create("Email and password are required", 400, httpStatusText.FAIL);
        return next(appError);
    }
    const user = await User.findOne({ email });
     if (!user) {
        appError.create("User not found", 400, httpStatusText.FAIL);
        return next(appError);
    }
   const matchedPassword =await bcrypt.compare(password, user.password);
   
   if(!matchedPassword){
    appError.create("Password not matched", 400, httpStatusText.FAIL);
    return next(appError);
   }
   if(user && matchedPassword){

        const token =  await generateJWT({
            email: user.email,
            id: user._id,
            role: user.role
        });
       
    res.json({ status: httpStatusText.SUCCESS, data: { token } });
   }else{
    appError.create("Invalid email or password", 500, httpStatusText.ERROR);
    return next(appError);
   }
});

module.exports = {
    getAllUsers,
    register,
    login
};



