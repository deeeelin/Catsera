const url = 'http://localhost:3080/dbtest/getSimilarCourseFromText';

const data = {
    text: 'I want to learn how to use python to do data analysis',
    fields: ['courseName', 'courseUrl'],
    limit: 1
};

fetch(url, {
    method: 'POST', // 請求方法
    headers: {
        'Content-Type': 'application/json', // 設置內容類型為JSON
    },
    body: JSON.stringify(data), // 把JS對象轉換為JSON字符串
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // 如果響應不是ok，拋出錯誤
    }
    return response.json(); // 解析JSON數據
})
.then(data => {
    console.log('Success:', data); // 處理獲得的數據
})
.catch(error => {
    console.error('Error:', error); // 處理任何在請求中發生的錯誤
});
