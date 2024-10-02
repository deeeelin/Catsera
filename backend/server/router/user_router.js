const express = require('express');

const ShenUserCtrl = require('../db_controller/user_controller');

const routeru = express.Router();

routeru.post('/user', ShenUserCtrl.createUser);
routeru.get('/user/:id', ShenUserCtrl.getUserById);
routeru.get('/users', ShenUserCtrl.getUsers);
routeru.get('/getLearningPathList/:userId/:pathId', ShenUserCtrl.getPathListByuserIdAndPathId);
routeru.get('/getLearningPathId/:_Id', ShenUserCtrl.getPathListByUserId);
routeru.get('/createLearningPath/:userId/:text', ShenUserCtrl.createPathListByText);
// routeru.get('/createReccommendCourse/:userId', ShenUserCtrl.createRecommendCourse);
routeru.get('/getReccommendCourse/:userId', ShenUserCtrl.getRecommendCourse);
// routeru.get('/addTag/:userId/:tags', ShenUserCtrl.addTags);
routeru.get('/getTags/:userId', ShenUserCtrl.getTags);
routeru.get('/removeTag/:userId/:tags', ShenUserCtrl.removeTags);
routeru.get('/newUser/:userId/:userName', ShenUserCtrl.newUser);
routeru.get('/test', ShenUserCtrl.userTest);
routeru.get('/getQ1options/:text', ShenUserCtrl.getQ1options);
routeru.get('/getQ2options/:userId/:text', ShenUserCtrl.getQ2options);
routeru.get('/changeCourseStatus/:ids', ShenUserCtrl.changeCourseStatus);
routeru.get('/getCoursesStatus/:id', ShenUserCtrl.getCourseStatus );

module.exports = routeru;