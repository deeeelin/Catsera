const ShenUser = require('../models/ShenUser');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Course = require('../models/Course');
const { courseTest } = require('./course_controller');
const { getFromFinetuneGPT_1, getFromFinetuneGPT_2, getFromFinetuneGPT_3 } = require('./utils/GetFromFinetuneGPT')
const getEmbedding = require('./utils/getEmbedding').getEmbedding;
const findSimilarDocuments = require('./utils/findSimilarDocuments').findSimilarDocuments;
const addTags = require('./utils/addTags');

createUser = (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }
    const user = new ShenUser(body)
    if (!user) {
        return res.status(400).json({ success: false, error: 'User creation failed' })
    }
    const query = { userid: body.userid };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    ShenUser.findOneAndUpdate(query, body, options)
        .then(user => {
            res.status(200).json({
                success: true,
                id: user._id,
                message: user.isNew ? 'User created!' : 'User updated!',
            });
        })
        .catch(error => {
            res.status(500).json({
                error,
                message: 'User not created!',
            });
        });
}

changeCourseStatus = async (req, res) => {
    try {
        const ids = req.params.ids.split(',');
        if (!ids[0] || !ids[1] || !ids[2]) {
            return res.status(400).json({ success: false, error: 'Info is required' });
        }

        const userId = ids[0];
        const courseId = new mongoose.Types.ObjectId(ids[1]);
        const newStatus = ids[2];

        // Try to update the course status if it exists
        const updateResult = await ShenUser.updateOne(
            { "userid": userId, "statusList.courseId": courseId },
            { $set: { "statusList.$.status": newStatus } }
        );

        // If the course does not exist, add it to the statusList
        if (updateResult.matchedCount === 0 || updateResult.modifiedCount === 0) {
            const addResult = await ShenUser.updateOne(
                { "userid": userId },
                { $addToSet: { "statusList": { courseId: courseId, status: newStatus } } }
            );

            if (addResult.matchedCount === 0) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            if (addResult.modifiedCount === 0) {
                return res.status(304).json({ success: false, error: 'Course status not added' });
            }

            return res.status(200).json({ success: true, data: "Course status added successfully" });
        }

        res.status(200).json({ success: true, data: "Course status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

getCourseStatus = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ success: false, error: 'ID not found' });
        }
        const user = await ShenUser.findOne({ "userid": id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user.statusList});
    } catch (err) {
        res.status(400).json({ success: false, error: err, message: 'User not found' });
    }
}



getUserById = async (req, res) => {
    try {
        const user = await ShenUser.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, data: user});
    } catch (err) {
        res.status(400).json({ success: false, error: err, message: 'User not found' });
    }
}

getQ1options = async (req, res) => {
    try {
        const text = req.params.text;
        if (!text) {
            return res.status(400).json({ success: false, error: 'Text is required' });
        }
        const topicJSONString = await getFromFinetuneGPT_1(text);

        res.status(200).json({ success: true, data: topicJSONString }); // Send the object as a response
    } catch (error) {
        res.status(500).json({ success: false, error: error });

    }
}

getQ2options = async (req, res) => {
    let fields = ['_id'];
    const userId = req.params.userId; // 用户的 ID
    const projection = fields ? fields.reduce((proj, field) => {
        proj[field] = 1; // 包括字段
        return proj;
    }, {}) : null;
    try {
        const texts = req.params.text;
        const topic = texts.split(".")[0].trim()
        const related_topic = texts.split(".")[1]
        addTags(userId, related_topic)
        if (!texts) {
            return res.status(400).json({ success: false, error: 'Text is required' });
        }
        const topicJSONString = await getFromFinetuneGPT_2(topic, related_topic);
        const modifiedString = topicJSONString.replace(/\/+/g, '');
        embedding = await getEmbedding(modifiedString);
        const createRecommendList = await findSimilarDocuments(embedding, projection, 30);
        const result = createRecommendList.map(result => result?._id).slice(0, 30);
        courses = result.flat().map(id => ({ courseId: new mongoose.Types.ObjectId(id) }));
        await ShenUser.findOneAndUpdate(
            { userid: userId },
            { $set: { 'reccommendCourse': courses } }, // 使用 $ 来匹配数组中的第一个元素
            { new: true, safe: true, upsert: true }
        ).exec()
        res.status(200).json({ success: true, data: courses }); // Send the object as a response
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

getUsers = async (req, res) => {
    try {
        // use http://.......?fields=userid,userName to assign fields to return
        let fields = req.query.fields;
        if (fields) {
            fields = fields.split(',');
        }
        const users = await ShenUser.find({}, fields);
        if (!users) {
            return res.status(404).json({ success: false, error: 'Users not found' });
        }
        res.status(200).json({ success: true, data: users});
    } catch (err) {
        res.status(400).json({ success: false, error: err, message: 'Users not found' });
    }
}

getPathListByuserIdAndPathId = async (req, res) => {
    const userId = req.params.userId; // 用户的 ID
    const _id = req.params.pathId; // 指定的 pathId

    try {
        const user = await ShenUser.findOne({userid: userId})
                                  .select({ learningPaths: { $elemMatch: { _id: _id } } }) // 只选择匹配特定 pathId 的 learningPath  , .select({ learningPaths: { $elemMatch: { pathId: _id } } }) // 只选择匹配特定 pathId 的 learningPath
                                  .populate({
                                      path: 'learningPaths.items.courseId', 
                                      model: 'Course' 
                                  })
                                  .exec();

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        //console.log(user.learningPaths);

        // 检查是否有匹配的 learningPath
        if (user.learningPaths.length === 0) {
            return res.status(404).json({ success: false, error: 'Learning path not found for this user' });

        }

        const learningPath = user.learningPaths[0]; // 因为使用了 $elemMatch，所以结果是一个数组，取第一个元素即可

        res.status(200).json({ success: true, data: learningPath });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message, message: 'Error occurred while fetching the learning path' });
    }
}

getPathListByUserId = async (req, res) => {
    const userId = req.params._Id; // 用户的 ID

    try {
        const user = await ShenUser.findOne({ userid: userId })
                                  .select({ 'learningPaths._id': 1 }) // 仅选择 learningPaths 中的 pathId
                                  .exec();

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // 获取所有的 pathId
        const pathIds = user.learningPaths.map(path => path._id);

        if (pathIds.length === 0) {
            return res.status(404).json({ success: false, error: 'No learning paths found for this user' });
        }

        res.status(200).json({ success: true, data: pathIds });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message, message: 'Error occurred while fetching the learning paths' });
    }
}


createPathListByText = async (req, res) => {
    const userId = req.params.userId; // 用户的 ID
    let fields = ['_id'];
    const projection = fields ? fields.reduce((proj, field) => {
        proj[field] = 1; // 包括字段
        return proj;
    }, {}) : null;
    const text = req.params.text; 
    learningPath_list = await getFromFinetuneGPT_3(text);
    const splitData = learningPath_list.split('->').map(item => 
        item.replace(/\(|\)/g, '').trim()
        .split('/').map(subItem => subItem.trim())
        .join(' ')
    );
    try {
        // 创建一个数组来保存结果
        const results = [];

        // 使用 Promise.all 等待所有嵌入结果
        const embeddings = await Promise.all(
            splitData.map(item => getEmbedding(item))
        );
        //console.log(embeddings);
        //console.log(projection);
        const similarDocuments = await Promise.all(
            embeddings.map(async embedding => {
                const result = await findSimilarDocuments(embedding, projection, 1);
                return result[0]?._id; // 使用可選鏈接，以防返回的不是陣列或陣列是空的
            })
        );
        const uniqueDocumentIds = [...new Set(similarDocuments)];

        const itemSet = new Set(); // 使用 Set 來存儲唯一的 courseId
        const items = uniqueDocumentIds
            .map(id => new mongoose.Types.ObjectId(id)) // 轉換為 ObjectId
            .filter(id => {
                const isDuplicate = itemSet.has(id.toString());
                itemSet.add(id.toString());
                return !isDuplicate;
            })
            .map(id => ({ courseId: id })); // 轉換為 items 需要的格式

        const newLearningPathId = new mongoose.Types.ObjectId(); // 生成一個新的 _id
        const newLearningPath = {
            _id: newLearningPathId, // 將新生成的 _id 設為 learningPath 的 _id
            pathName: "uselessName",
            pathId: "uselessId",
            pathStatus: "ongoing",
            items: items
        };
        const updatedUser = await ShenUser.findOneAndUpdate(
            { userid: userId }, // 使用 userName 作為查詢條件
            { $push: { learningPaths: newLearningPath } },
            { new: true, safe: true, upsert: true }
        ).exec();
            // 所有异步操作完成后，发送包含结果的响应
            res.status(200).json({ success: true, data: newLearningPathId });
        } catch (error) {
            // 处理过程中出现错误
            res.status(500).json({ success: false, error: error.message, message: 'Error occurred while processing the data' });
        }
    }
        
createRecommendCourse = async (req, res) => {
    let fields = ['_id'];
    const projection = fields ? fields.reduce((proj, field) => {
        proj[field] = 1; // 包括字段
        return proj;
    }, {}) : null;
    const userId = req.params.userId; // 用户的 ID
    const tags = await ShenUser.findOne({ userid: userId }).select({ tags: 1 }).exec();
    try {
        // count total number of tags
        const tagsCount = tags.tags.length;
        //divide 30 courses into tagsCount par
        const courseCount = Math.floor(30 / tagsCount);
        //get courses from each tag
        const embeddings = await Promise.all(
            tags.tags.map(item => getEmbedding(item))
        );
        const similarDocuments = await Promise.all(
            embeddings.map(async embedding => {
                const results = await findSimilarDocuments(embedding, projection, courseCount);
                // 確保返回的是一個陣列，並取出每個相似文件的_id
                return results.map(result => result?._id).slice(0, courseCount); // 取前courseCount個結果的_id
            })
        );
        courses = similarDocuments.flat().map(id => ({ courseId: new mongoose.Types.ObjectId(id) }));
        await ShenUser.findOneAndUpdate(
            { userid: userId },
            { $set: { 'reccommendCourse': courses } }, // 使用 $ 来匹配数组中的第一个元素
            { new: true, safe: true, upsert: true }
        ).exec()
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        // 处理过程中出现错误
        res.status(500).json({ success: false, error: error.message, message: 'Error occurred while processing the data' });
    }
}

getRecommendCourse = async (req, res) => {
    const userId = req.params.userId; // 用户的 ID
    try {
        const user = await ShenUser.findOne({ userid: userId })
                                  .populate({path: 'reccommendCourse.courseId', model: 'Course'} ) // 這裡使用 populate 方法來填充 courseId 欄位
                                  .exec();

        if (user) {
            console.log(user.reccommendCourse); // 這裡將會顯示帶有完整課程詳情的推薦課程列表
            res.status(200).json({ success: true, data: user.reccommendCourse });
        } else {
            console.log('找不到用戶！');
            res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Error occurred while processing the data' });
    }
}

getTags = async (req, res) => {
    const userId = req.params.userId; // 用户的 ID
    try {
        const user = await ShenUser.findOne({ userid: userId })
                                    .select({ tags: 1 }) // 仅选择 tags 字段
                                    .exec();
        if (user) {
            res.status(200).json({ success: true, data: user.tags });
        }
        else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message, message: 'Error occurred while processing the data' });
    }
}

        

removeTags = async (req, res) => {
    const userId = req.params.userId; // 用户的 ID
    const tags = req.params.tags; // 用户的 ID
    try {
        await ShenUser.findOneAndUpdate(
            { userid: userId },
            { $pull: { 'tags': tags } }, // 使用 $ 来匹配数组中的第一个元素
            { new: true, safe: true, upsert: true }
        ).exec()
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        // 处理过程中出现错误
        res.status(500).json({ success: false, error: error.message, message: 'Error occurred while processing the data' });
    }
}

// addTags = async (req, res) => {
//     const userId = req.params.userId; // 用户的 ID
//     const tags = req.params.tags; // 用户的 ID
//     try {
//         await ShenUser.findOneAndUpdate(
//             { userid: userId },
//             { $push: { 'tags': tags } }, // 使用 $ 来匹配数组中的第一个元素
//             { new: true, safe: true, upsert: true }
//         ).exec()

//         res.status(200).json({ success: true, data: tags });
//     } catch (error) {
//         // 处理过程中出现错误
//         res.status(500).json({ success: false, error: error.message, message: 'Error occurred while processing the data' });
//     }
// }

newUser = async (req, res) => {
    const userId = req.params.userId; // 用户的 ID
    const userName = req.params.userName; // 用户的 ID
    try{
        const newUser = new ShenUser({
            userid: userId,
            userName: userName,
        });
        //check whther the user is already in the database
        const user = await ShenUser.findOne({ userid: newUser.userid });
        if (user) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        await newUser.save();
        res.status(200).json({ success: true, data: newUser});
    } catch (err) {
        res.status(400).json({ success: false, error: err, message: 'User not created' });
    }
}



userTest = async (req, res) => {
    try{
        const newUser = new ShenUser({
            userid: 'testid',
            userName: 'testname',
            statusList: [
                {
                    courseId: '6654aa975c12a5a4b430ef7b',
                    status: 'completed'
                }
            ],
            learningPaths: [
                {
                    pathName: 'testpath',
                    pathId: 'testpathid',
                    pathStatus: 'completed',
                    items: [
                        {
                            courseId: '6654aa975c12a5a4b430ef7b'
                        }
                    ]
                }
            ],
            reccommendCourse: [
                {
                    courseId: '6654aa975c12a5a4b430ef7b',
                }
            ],
            tags: ['testtag1', 'testtag2']
        });
        await newUser.save();
        res.status(200).json({ success: true, data: newUser});
    } catch (err) {
        res.status(400).json({ success: false, error: err, message: 'User not created' });
    }
};

module.exports = {
    createUser,
    getUserById,
    getUsers,
    userTest,
    getPathListByuserIdAndPathId,
    getPathListByUserId,
    createPathListByText,
    // createRecommendCourse,
    getRecommendCourse,
    removeTags,
    // addTags,
    getTags,
    newUser,
    getQ1options,
    getQ2options,
    changeCourseStatus,
    getCourseStatus 
}