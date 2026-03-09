const express = require('express');
const router=express.Router();
const verifyToken = require('../middlewares/verifyToken');

const { getAllCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
 } = require('../controllers/courses-controller');

//const { body } = require('express-validator');
const { validationSchema } = require('../middlewares/validationSchema');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');

router.route('/').
get(verifyToken,getAllCourses).//get all courses
post(verifyToken,allowedTo(userRoles.MANAGER),validationSchema() , addCourse); //create a new course with express-validator




// //create a new course witout express-validator
// app.post('/api/courses', (req, res) => {
//     const { title, price } = req.body;
//     if (!title) {
//         return res.status(400).json({ error: 'Title is required' });
//     }

//     const newCourse = { id: courses.length + 1, title, price };
//     courses.push(newCourse);
//     res.status(201).json(newCourse);
// });



router.route('/:courseId')
.get(verifyToken,getCourseById).//get a course by id
patch(verifyToken,updateCourse).//update a course by id
delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER) ,deleteCourse); // delete a course by id



module.exports = router;
