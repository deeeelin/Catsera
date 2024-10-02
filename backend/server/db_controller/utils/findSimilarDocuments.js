const Course = require('../../models/Course')

async function findSimilarDocuments(embedding, projection, limit) {
    try {
        // 使用 Mongoose 模型进行查询
        const pipeline = [
            {
                "$vectorSearch": {
                    "queryVector": embedding,
                    "path": "embedding",
                    "numCandidates": limit*20,
                    "limit": limit,
                    "index": "vector_index",
                }
            }
        ];
        if (projection) {
            
            pipeline.push({
                "$project": projection
            });
        }
        //console.log("Embedding", embedding);
        //console.log("Pipeline:", pipeline);
        const documents = await Course.aggregate(pipeline).exec(); 
        //console.log("DOCS" ,documents);
        return documents;
    } catch (error) {
        throw error; // 传递错误
    }
}

module.exports.findSimilarDocuments = findSimilarDocuments;