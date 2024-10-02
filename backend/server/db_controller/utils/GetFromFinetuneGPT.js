// download nvm and openai 
// nvm install 20.10.0
// nvm use 20.10.0
const OpenAI = require('openai');


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function model_1(prompt) {
    const response = await openai.chat.completions.create({
    messages: [ {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": `Given a prompt message like : 

    The prompt may be like: 
    Question 1: Please describe what you want to learn. 
    Ans: <describing the topic that you want to learn>.

    For example : 
    Question 1: Please describe what you want to learn. 
    Ans: I am interested in learning about  writing a  screenplay or script for film or television.

    Then Output the format :
    <the topic wanted to learn> / <six topic related to the topic wanted to learn>.
    
    For example : 
    Write a Full Length Feature Film Script / Story Development, Character Development, Genre, Tone, romantic comedy, screenplaying.
    
    

    Now I will give a new prompt, with the format mentioned :
    
    New prompt: 
    Question 1: Please describe what you want to learn. 
    Ans: ${prompt}

    Give me the output with the output format mentioned (<the topic wanted to learn> / <six topic related to the topic wanted to learn>.). You must follow the output format strictly !
    `
    }],
    model: "gpt-4",
    });



  
   // process.stdout.write(response.choices[0].message.content+'\n') ;
    return response.choices[0].message.content;
}


async function model_2(Topic,Related_Topics) {
    const response = await openai.chat.completions.create({
    messages: [ {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": ` Given a prompt message like : 

    The prompt may be like: 
    Topic: <A topic, denoted as T>. 
    Related topics: <Eight topics that is related to topic T, related topics are seprated in commas>
    

    For example : 
    Topic: Machine Learning.
    Related topics: Supervised Learning, Unsupervised Learning, Deep Learning, Linear Algebra, Neural Networks, Computer Vision, Big Data, Reinforcement Learning

    Then Output the format :
    <One possible course name that mainly matches to the Topic and envolves the Related Topic>. / <A brief description about the course, the content need to include the topic and a few of related topics, within three sentence.> / < 5 to 8 Skills that is envolve in this course, skills are seperated with whitespace, and the skills don't include conjunctions like "and" , "or" >.
    
    For example : 
    Introduction to Business Strategy. / This course aims in identifying and creating Business Model Canvas solutions based on previous high-level analyses and research data, to enable you to identify and map the elements required for new products and services. Furthermore, it is essential for generating positive results for your business venture. / Finance business plan persona business model canvas Planning Business project Product Development presentation Strategy business business-strategy
    
    Now I will give a new prompt, with the format mentioned :

    New prompt: 
    Topic:${Topic}
    Related topics:${Related_Topics}
    

    Give me the output with the output format mentioned (<One possible course name that mainly matches to the Topic and envolves the Related Topic>. / <A brief description about the course, the content need to include the topic and a few of related topics, within three sentence.> / < 5 to 8 Skills that is envolve in this course, skills are seperated with whitespace, and the skills don't include conjunctions like "and" , "or" >). You must follow the output format strictly !
    `
    }],
    model: "gpt-4",
    });
    
    
   // process.stdout.write(response.choices[0].message.content+'\n') ;
    return response.choices[0].message.content ;
  }







async function model_3(prompt) {
    const response = await openai.chat.completions.create({
    messages: [ {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": `Given a prompt message like : 

    The prompt may be like: 
    Question 1: Please describe what you want to learn. 
    Ans: <describing the topic that you want to learn>.


    For example : 
    Question 1: Please describe what you want to learn. 
    Ans: I am interested in learning about  writing a  screenplay or script for film or television.

    Then Output the format :
    (<Course 1 name> / <Course 1 description> / <Course 1 skills>) -> (<Course 2 name> / <Course 2 description> / <Course 2 skills>) -> (<Course 3 name> / <Course 3 description> / <Course 3 skills>) -> ... (<Course k name> / <Course k description> / <Course k skills>)

    For the prompt above, you will need to list 5 to 10 course that is required or needed in order to master the concept of the topic answered in Ans: section. Please sort the course from the most fundamental or basic to the most advance. For each course you will need to output the format "(<Course name> / <Course description> / <Course skills>)" , in which :

    Course name: One possible course name that mainly matches to the Topic and envolves the Related Topic.
    Course description: A brief description about the course, the content need to include the topic and a few of related topics, within three sentence.
    Course skills: 5 to 8 Skills that is envolve in this course, skills are seperated with whitespace, and the skills don't include conjunctions like "and" , "or". Also , we just only need the keyword for each skill.

    The courses information are combined starting from the most basic to the most advanced, and seperated with the symbol "->"
    
    For example : 
    (Introduction to Machine Learning / Acquire a foundational understanding of machine learning concepts and algorithms. / Machine-Learning Supervised Learning Unsupervised Learning) -> (Data Preprocessing and Feature Engineering / Explore techniques for preparing and cleaning data for machine learning applications. / Data Preprocessing Feature Scaling Feature Selection) -> (Model Training and Evaluation / Dive into the training and evaluation of machine learning models for predictive accuracy. / Model Training Model Evaluation Cross-Validation) -> (Deep Learning Fundamentals / Understand the principles and applications of deep learning in machine learning. / Deep Learning Neural Networks TensorFlow) -> (Advanced Machine Learning Applications / Apply machine learning to real-world problems in areas like natural language processing and computer vision. / NLP Computer Vision Applications Deployment)
    
    

    Now I will give a new prompt, with the format mentioned :
    
    New prompt: 
    Question 1: Please describe what you want to learn. 
    Ans: ${prompt}

    Give me the output with the output format mentioned  ((<Course 1 name> / <Course 1 description> / <Course 1 skills>) -> (<Course 2 name> / <Course 2 description> / <Course 2 skills>) -> (<Course 3 name> / <Course 3 description> / <Course 3 skills>) -> ... (<Course k name> / <Course k description> / <Course k skills>)). You must follow the output format strictly !
    `
    }],
    model: "gpt-4",
    });


    
    
   // process.stdout.write(response.choices[0].message.content+'\n') ;
    return response.choices[0].message.content ;
  }

/*
async function do_prompt(model, new_prompt, stop_message=" \n") {
    const data = {
        model: Models[model],
        prompt: new_prompt,
        max_tokens: 1000,
        temperature: 0.0,
        stop: stop_message
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', data, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const str = response.data.choices[0].text;
        
        const topicMatch = str.match(topicRegex);
        const relatedTopicsMatch = str.match(relatedTopicsRegex);

        const topic = topicMatch ? topicMatch[1].trim() : null;
        const relatedTopics = relatedTopicsMatch ? relatedTopicsMatch[1].split(',').map(s => s.trim()) : [];
        // return JSON.stringify({ topic, relatedTopics });
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
*/

//module.exports.getFromFinetuneGPT = do_prompt;

/*
async function executeModel() {
    try {
        model_1("I want to learn how to walk");
       
        model_2("Topic: Write A Feature Length Screenplay For Film Or Television.", "Related topics: Drama, Comedy, peering, screenwriting, film, Document, Review, dialogue, reative writing, Writing, unix shells, arts-and-humanities, music-and-art");
      
        model_3("I want to learn how to walk");
       //process.stdout.write(result);
    } catch (error) {
        console.error('Error:', error);
    }
}


executeModel();
*/


module.exports.getFromFinetuneGPT_1 = model_1;
module.exports.getFromFinetuneGPT_2 = model_2;
module.exports.getFromFinetuneGPT_3 = model_3;