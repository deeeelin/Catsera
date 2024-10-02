// 导入需要的模块和模型
const ShenUser = require('./path/to/ShenUserModel'); // 确保引入了 ShenUser 模型

// 定义函数
async function createPathListByUserId(userId, newPath) {
    try {
        const user = await ShenUser.findOne({ userid: userId });

        if (!user) {
            throw new Error('User not found');
        }

        // 向用户的学习路径数组中添加新的学习路径
        user.learningPaths.push(newPath);

        // 保存修改后的用户文档
        await user.save();

        return { success: true, data: newPath, message: 'Learning path created successfully' };
    } catch (err) {
        // 抛出错误，可以在函数调用时进行处理
        throw err;
    }
}

// 导出函数
module.exports = createPathListByUserId;
