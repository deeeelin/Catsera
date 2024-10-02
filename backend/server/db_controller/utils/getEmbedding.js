async function getEmbedding(text) {
    const apiUrl = 'https://api.openai.com/v1/embeddings';
    const apiKey = process.env.OPENAI_API_KEY;
    const postData = {
        input: text,
        model: "text-embedding-ada-002",
        encoding_format: "float"
    };

    let attempts = 0;
    const maxAttempts = 6;
    
    while (attempts < maxAttempts) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data[0].embedding; // 返回獲得的embedding
        } catch (error) {
            console.error('Request failed:', error);
            const backoff = Math.pow(2, attempts) + Math.random();
            if (attempts < maxAttempts - 1) {
                console.log(`Retrying in ${backoff} seconds...`);
                await new Promise(resolve => setTimeout(resolve, backoff * 1000));
            } else {
                throw new Error('Max retry attempts reached.');
            }
        }
        attempts++;
    }
}

module.exports.getEmbedding = getEmbedding;