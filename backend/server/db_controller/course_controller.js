const Course = require('../models/Course')
const mongoose = require('mongoose');
const validFields = ['courseName', 'university', 'difficultyLevel', 'courseRating', 'courseUrl', 'courseDescription', 'skills', 'embedding'];
const findSimilarDocuments = require('./utils/findSimilarDocuments').findSimilarDocuments;
const getEmbedding = require('./utils/getEmbedding').getEmbedding;
const getFromFinetuneGPT = require('./utils/GetFromFinetuneGPT').getFromFinetuneGPT;

createCourse = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a course',
        })
    }

    const course = new Course(body)

    if (!course) {
        return res.status(400).json({ success: false, error: 'Course creation failed' })
    }

    const query = { courseName: body.courseName };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    Course.findOneAndUpdate(query, body, options)
        .then(course => {
            res.status(200).json({
                success: true,
                id: course._id,
                message: course.isNew ? 'Course created!' : 'Course updated!',
            });
        })
        .catch(error => {
            res.status(500).json({
                error,
                message: 'Course not created!',
            });
        });
}

getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course});
    } catch (err) {
        res.status(400).json({ success: false, error: err, message: 'Course not found' });
    }
}

getAllCourses = async (req, res) => {
    try {
        // use http://.......?fields=courseName,university,difficultyLevel to assign fields to return
        let fields = req.query.fields;
        if (fields) {
            fields = fields.split(',');
            const allFieldsValid = fields.every(field => validFields.includes(field.trim()));
            if (!allFieldsValid) {
                return res.status(400).json({ success: false, error: "One or more field names are invalid." });
            }
            fields = fields.join(' '); 
        }
        const courses = await Course.find({}, fields); 
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

findSimilarCourses = async (req, res) => {
    try {
        const embedding = req.body.embedding; 
        const limit = req.body.limit || 5;
        if (!embedding) {
            return res.status(400).json({ success: false, error: 'Embedding is required' });
        }
        
        let fields = req.body.fields;
        if (fields && Array.isArray(fields)) { 
            const allFieldsValid = fields.every(field => validFields.includes(field.trim()));
            if (!allFieldsValid) {
                return res.status(400).json({ success: false, error: "One or more field names are invalid." });
            }
            fields = fields.map(field => field.trim()); 
        } else {
            return res.status(400).json({ success: false, error: 'Fields must be an array' });
        }

        const projection = fields ? fields.reduce((proj, field) => {
            proj[field] = 1; // 包括字段
            return proj;
        }, {}) : null;
        const documents = await findSimilarDocuments(embedding, projection, limit);
        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

getSimilarCourseFromText = async (req, res) => {
    try {
        const text = req.body.text;
        const limit = req.body.limit || 5;
        if (!text) {
            return res.status(400).json({ success: false, error: 'Text is required' });
        }
        
        let fields = req.body.fields;
        if (fields && Array.isArray(fields)) { 
            const allFieldsValid = fields.every(field => validFields.includes(field.trim()));
            if (!allFieldsValid) {
                return res.status(400).json({ success: false, error: "One or more field names are invalid." });
            }
            fields = fields.map(field => field.trim()); 
        } else {
            return res.status(400).json({ success: false, error: 'Fields must be an array' });
        }

        const projection = fields ? fields.reduce((proj, field) => {
            proj[field] = 1; // 包括字段
            return proj;
        }, {}) : null;
        const embedding = await getEmbedding(text);
        
        const documents = await findSimilarDocuments(embedding, projection, limit); // 使用embedding進行後續操作
        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

getQ2options = async (req, res) => {
    try {
        const text = req.params.text;
        if (!text) {
            return res.status(400).json({ success: false, error: 'Text is required' });
        }
        const topicJSONString = await getFromFinetuneGPT('model_1', text);
        const topicObject = JSON.parse(topicJSONString); // Parse the JSON string to an object
        res.status(200).json({ success: true, data: topicJSONString }); // Send the object as a response
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

courseTest = async (req, res) => {
    try {
        // 創建一個新的 course 實例
        const newCourse = new Course({
            _id: new mongoose.Types.ObjectId(),
            courseName: 'Course Name2',
            university: 'University Name',
            difficultyLevel: 'Easy',
            courseRating: '4.5',
            courseUrl: 'http://example.com',
            courseDescription: 'This is a sample course description.',
            skills: 'Skill1, Skill2',
            embedding: 'Sample Embedding'
        });
  
        // 儲存到資料庫
        await newCourse.save();
  
        // 回應成功信息
        res.status(201).send('Course created successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  };


module.exports = {
    createCourse,
    // updateCourse,
    // deleteCourse,
    findSimilarCourses,
    getAllCourses,
    getCourseById,
    getSimilarCourseFromText,
    getQ2options,
    courseTest
}
