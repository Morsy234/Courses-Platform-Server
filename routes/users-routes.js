const express = require('express');
const router = express.Router();
const multer = require('multer');
const appError = require('../utils/appError');
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const ext =file.mimetype.split('/')[1];
        const filename=`user-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        return cb(null, true);
    }else{
        return cb(appError.create('File type not allowed must be an image', 400), false);
    }
};
const upload = multer({ storage: diskStorage, fileFilter: fileFilter});
const { validationResult } = require("express-validator");
const { getAllUsers, register, login } = require('../controllers/users-controller');
const verifyToken = require('../middlewares/verifyToken');

// get all users
router.route('/').get(verifyToken, getAllUsers);

//Register
router.route('/register').post(upload.single('avatar'), register);

//Login
router.route('/login').post(login);




module.exports = router;