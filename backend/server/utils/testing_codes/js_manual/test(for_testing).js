const { ObjectId } = require('mongodb');

const data = ["65b20df9ec0a006cb8a21726", "65b20f01ec0a006cb8a3a9c9", "65b211ddec0a006cb8a71f22", "65b20ecaec0a006cb8a34f95", "65b20d4bec0a006cb8a13ca7", "65b20feaec0a006cb8a4dab6", "65b20edeec0a006cb8a367d5", "65b20fb4ec0a006cb8a49ac7", "65b20fb4ec0a006cb8a49ac7"];

const objectIds = data.map(id => ObjectId(id));
console.log(objectIds);