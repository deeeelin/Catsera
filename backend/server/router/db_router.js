const express = require('express');

const CourseCtrl = require('../db_controller/course_controller');

const router = express.Router();

router.post('/course', CourseCtrl.createCourse);
// router.put('/course/:id', CourseCtrl.updateCourse);
// router.delete('/course/:id', CourseCtrl.deleteCourse);
router.get('/course/:id', CourseCtrl.getCourseById);
router.get('/allcourses', CourseCtrl.getAllCourses);
router.post('/similarcourses', CourseCtrl.findSimilarCourses);
router.post('/getSimilarCourseFromText', CourseCtrl.getSimilarCourseFromText);
router.get('/test', CourseCtrl.courseTest);
router.get('/getQ2options/:text', CourseCtrl.getQ2options);
module.exports = router;
