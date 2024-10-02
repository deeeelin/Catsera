const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        courseName: { type: String, required: true },
        university: { type: String, required: true },
        difficultyLevel: { type: String, required: true },
        courseRating: { type: Number, required: true },
        courseUrl: { type: String, required: true },
        courseDescription: { type: String, required: true },
        skills: { type: String, required: true },
        embedding: { type: [Number], required: true }
        
    },
    { timestamps: true }, 
);

module.exports = mongoose.model('Course', CourseSchema);