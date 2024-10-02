const ShenUser = require('../../models/ShenUser');

async function addTags(userId, tagsString) {
    try {
        const tagsArray = tagsString.split(','); // 將 tags 字符串以空白分隔轉換成陣列
        const result = await ShenUser.findOneAndUpdate(
            { userid: userId },
            { $push: { tags: { $each: tagsArray } } }, // 使用 $each 將 tagsArray 中的每個元素都加入到 tags 中
            { new: true, safe: true, upsert: true }
        ).exec();

       
    } catch (error) {
        // 處理過程中出現錯誤
        throw error;
    }
}

module.exports = addTags;