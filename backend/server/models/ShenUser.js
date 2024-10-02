const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ShenUserSchema = new Schema(
    {
        userid: { type: String, required: true },
        userName: { type: String, required: true },
        statusList: [
            {
                courseId: { type: ObjectId, ref: 'courses', required: false },
                status: { type: String, required: false}
            }
        ],
        learningPaths: [
            {
                pathName: { type: String, required: false },
                pathId: { type: String, required: false },
                pathStatus: { type: String, required: false },
                items: [
                    {
                        courseId: { type: ObjectId, ref: 'courses',required: false}, // 引用 Course 集合
                    }
                ]
            }
        ],
        reccommendCourse: [
            {
                courseId: { type: ObjectId, ref: 'courses', required: false},
            }
        ],
        tags: [{ type: [String], required: false }]
    },
    { timestamps: true }, 
);

module.exports = mongoose.model('ShenUser', ShenUserSchema);