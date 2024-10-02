import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import PostCard from '../app-course-list';
import { posts } from 'src/_mock/courselist';
import { useNavigate } from 'react-router-dom';

export default function AppView() {
  // const [searchInput, setSearchInput] = useState('');
  // const [searchResults, setSearchResults] = useState(posts);

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recResults, setRecResults] = useState([]);
  const [showResults, setShowResults] = useState([]);
  const navigate = useNavigate();

  const handleAddCourse = (courseName) => {
    const url = 'http://localhost:3080/api/user/addCourseToLearnList';
    const userId = 'testid'; 
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseName })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Updated LearnList:', data);
        
    })
    .catch(error => console.error('Error:', error));
};

  

useEffect(() => {
  const fetchPosts = async () => {
    const url = 'http://localhost:3080/dbuser/getReccommendCourse/testid';

    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // 如果響應不是ok，拋出錯誤
      }
      return response.json()
    })
    .then(data => {
      console.log('Success:', data); // 處理獲得的數據
      // Extract just the courseIds from the data
      const courseIds = data.data.map(item => item.courseId);
      setRecResults(courseIds.slice(0, 99));
      setShowResults(courseIds.slice(0, 99));
    })
    .catch(error => {
      console.error('Error:', error); // 處理任何在請求中發生的錯誤
    });
  };

  fetchPosts();
}, []);


  useEffect(() => {
    if (searchInput == '') {
      setShowResults(recResults)
    } else {
      const fetchPosts = async (search) => {

        const url = 'http://localhost:3080/dbtest/getSimilarCourseFromText';
  
        const data = {
            text: search,
            fields: ['courseName', 'courseUrl', 'courseRating', 'university', 'difficultyLevel'],
            limit: 23
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
            return response.json()
        })
        .then(data => {
            console.log('Success:', data); // 處理獲得的數據
            setShowResults(data.data.slice(0, 99))
        })
        .catch(error => {
            console.error('Error:', error); // 處理任何在請求中發生的錯誤
        })
      };
      fetchPosts(searchInput);

    }
    // console.log(showResults)
  }, [searchInput]);
  
  useEffect(() => {
    console.log(showResults)
  }, [showResults]);
  

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi 👋 Explore courses only for you
      </Typography>

      <div>
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search courses..."
          sx={{
            width: '100%', // Make it full width
            fontSize: '18px', // Adjust the font size to make it larger
            mb: 3, // Add margin bottom for spacing
          }}
        />
        {/* <Button variant="contained">
          Search
        </Button> */}
      </div>

      <Grid container spacing={3}>
        <Grid container spacing={3}>
            {showResults.map((post, index) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    index={index} 
                    onAddCourse={handleAddCourse} // 将 handleAddCourse 作为 prop 传递
                />
            ))}
        </Grid>
    </Grid>
    </Container>
  );
}