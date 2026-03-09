// let { courses } = require('../data/courses');
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const Course = require("../models/course-models");
const asyncWrapper = require("../middlewares/asyncWrapper");
const getAllCourses = async (req, res) => {
  //pagination for courses
  const limit = req.query.limit;
  const page = req.query.page;
  const skip = (page - 1) * limit;

  const courses = await Course.find().limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses: courses } });
};

const getCourseById = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    // const error = new Error();
    // error.message = "Course not found";
    // error.statusCode = 404;
    appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(appError);
    //return res.status(404).json({ status: httpStatusText.FAIL, data: null, msg: 'Course not found', code: 404 });
  }
  res.json({ status: httpStatusText.SUCCESS, data: { course: course } });
  // } catch(err){
  //   return res.status(400).json({ status: httpStatusText.ERROR,data: null, msg: err.message,code:400 });
  // }
});

const addCourse = asyncWrapper(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json( {status: httpStatusText.FAIL, data:{errors: errors.array()}} );
    const error = new Error();
    // error.message = "Validation failed";
    // error.statusCode = 400;
    // error.data = { errors: errors.array() };
    appError.create("Validation failed", 400, httpStatusText.FAIL);
    return next(appError);
  }

  // const newCourse= await Course.create(req.body);
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  courseId = req.params.courseId;

  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    { $set: { ...req.body } },
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { course: updatedCourse },
  });

  // } catch (err) {
  // return res
  //   .status(400)
  //   .json({
  //     status: httpStatusText.ERROR,
  //     data: null,
  //     msg: err.message,
  //     code: 400,
  //   });
  // }
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.deleteOne({ _id: courseId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
};
