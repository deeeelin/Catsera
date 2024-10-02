# Catsera

## What is it

* Catsera is an AI course recommendation system based on coursera course datas. Involves multiple features allowing users to find the best suitable courses, set their own customized field preference to explore new interests, auto create course study path, and also provided intellegence service to keep track on their learning progress.
* Combined with GPT-4 LLM chat completion and Embedding features and vector search supported Mongo database. Frontend is built on React JS and well designed.

## Features

* Text Similarity search engine:
* Field extend, preference forming
* Construct learning path
* Real data mapped with coursera
* Categorized field achievements

## Project Structure
* Frontend built on React JS
* Connected with OpenAI API using GPT-4 completion and embeddding service
* Utilizing MongoDB for storage and text similarity vector search
* Containerized through Docker

## Setting up Project
* Prerequisites:
  * **Make sure you have Docker Compose installed**: https://docs.docker.com/compose/install/   

1. Clone this project
* `$ git clone https://github.com/deeeelin/Catsera.git`
   *    Please use git clone method instead of directly downloading the zip , since there are files mangesd by git lfs , if you directly download, then those managed files will only be reference pointer files

2. Create your database (**THIS IS REQUIRED BEFORE RUNNING PROEJCT**)
   1. Go to Mongodb Atlas : https://www.mongodb.com/cloud/atlas/register

   2. Login and create a cluster (used Shared plan with M0 sandbox which is free for the first use)

   3. Go back to Atlas dashboard , and click connect button on the cluster info -> select "Compass" -> i have mongodb compass installed --> copy the connection string , ex : `mongodb+srv://username:password@cluster0.ex3w4ts.mongodb.net/`

   4. Download Mongodb compass on your machine, go inside and use the connection string to connect to the cluster

   5. Execute `$ backend/server/utils/upload.py` , enter your connection string 
       * now a database `hackathon` is created in the cluster
       * with a collection(a.k.a folder) `courses` created , stores all the information of the course

   6. Under backend folder, in docker-compose.yml , change service-->express-server-->environment-->MONGODB_URI to equal "your connection string"

   7. On the leftside of the menu on Atlas dashboard , press "Atlas Search" , ( Or press browse collection on the cluster info , and then select Atlas Search)
       * Then press "CREATE SEARCH INDEX" button 
       * Under Atlas Vector Search , select JSON editor
       * Select hackathon/courses , and "vector_index" as Index name
       * In the editor , write this : 
       ```
       {
       "fields": [
           {
           "numDimensions": 1536,
           "path": "embedding",
           "similarity": "cosine",
           "type": "vector"
           }
       ]
       }
       ```
       * Then press Create Search Index
       * This search index is for the dependency of the "findSimilarDocuments.js" pipeline, to enable vector search

## Run Project
1. Set your openai api key: 
    * Export your key: `$ export OPENAI_API_KEY=<Your api key>`
    * Export your MongoDB connection string: `$ export MONGODB_URI=<Your MongoDB connection string, ex: mongodb+srv://username:password@cluster0.ex3w4ts.mongodb.net/>`

2. Start backend server
    * Run `$ docker-compose build` then `docker-compose up`

3. Run `$ curl "http://localhost:3080/dbuser/test" | jq .` in database_manual.ipynb
    * Creates a collection "shenusers" , and a test user under it (see mongo compass for detail)

4. Run frontend `$ yarn install`(or `$ yarn add`) , then `$ yarn dev`


5. **Quit chrome**, then in terminal : 
    * For MacOS:
        * `$ open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security `

6. Go to the webpage address by using the special browser

## Known Issues : 

* There will be nothing in the home page at first, since there are no recommmend course in the user data
* You should add tags , and the frontend will call `getQ2options` service (see database manual) , to use embedding find similar course and add into recommend courses in user data
* Then you go back to homepage , you will see now there are recommended courses

## Notes for Developer

* Frontend uses the connection of service to fetch wanted data , (exactly same like using the commands in `database manual.ipynb`)
* The service are defined in `backend/server/router/` , for `db_router.js` and `user_router.js`
* And the implementation of service is stored in `backend/server/db_controller/course_controller` and `user_controller.js`
* the models/ are database structure definitions

## Additional Notes for setting up database
* You can use the /Manual/Example_database to manually import collections in the hackathon database in mongo compass , to rebuild one old database state , there are four collections in hackathon database : courses, sessions, shenusers, users ( empty ) 
* If cannot connect to database in compass , maybe you can go to ATlas and accept this ip address to connect 
