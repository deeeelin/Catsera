import { faker } from '@faker-js/faker';
import { posts } from 'src/_mock/courselist';
import React, { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  Chip,
  CardHeader,
  TextField,
  Avatar,
  Button
} from '@mui/material';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
import PostCard from '../app-course-list';




// ----------------------------------------------------------------------

export default function JourneyView() {

  const [pathView, setPathView] = useState([]);
  const [journeyDescription, setJourneyDescription] = useState('');
  const handleTextFieldChange = (event) => {
    setJourneyDescription(event.target.value);
  };
  // Function to handle the Button click
  const handleButtonClick = async () => {
    try {
      const response = await fetch(`http://localhost:3080/dbuser/createLearningPath/testid/${journeyDescription}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      // Handle the response data
      console.log(data);

      window.location.href = `view-courses?id=${data.data}`; // Make sure to use the full URL
  
    } catch (error) {
      // Handle any errors
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbuser/getLearningPathId/testid`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetch result:', data);
            resolve(data); // Resolve the promise with the fetched data
          })
          .catch(error => {
            console.error('Fetch error:', error);
            reject(error); // Reject the promise with the error
          });
      });
    };
  
    const fetchListData = async (data) => {
      return new Promise((resolve, reject) => {
        fetch(`http://localhost:3080/dbuser/getLearningPathList/testid/${data}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log('Fetch result:', data);
            resolve(data); // Resolve the promise with the fetched data
          })
          .catch(error => {
            console.error('Fetch error:', error);
            reject(error); // Reject the promise with the error
          });
      });
    };
  
    let ret_data = [];
  
    fetchLists().then(data => {
      const promises = data.data.map(item => {
        return fetchListData(item).then(detail => {
          const coursename = detail.data.items.map(item => item.courseId.courseName);
          console.log("COURSENAME", coursename);
          ret_data.push({ idd: item, pathstatus: detail.data.pathStatus, pathname: detail.data.pathName, coursename });
        });
      });
  
      Promise.all(promises).then(() => {
        setPathView(ret_data); // Set pathView state after all fetchListData calls are completed
      });
    });
  
  }, []);

  useEffect(() => {
    console.log(pathView)
  }, [pathView]);


  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Learning Journey
      </Typography>

        <Grid xs={12} md={12} lg={12}>
          <AppNewsUpdate
            title="Ongoing Journey"
            list={pathView.map((item, index) => ({
              id: item.idd,
              title: item.coursename[0],
              description: `-> ${item.coursename.slice(1).join(' -> ')}`,
              image: `/assets/images/covers/cover_${index%24+1}.jpg`,
              postedAt: item.pathstatus,
            }))}
          />
        </Grid>
        
        <Grid xs={12} md={12} lg={12} mt={3}>
          <Card>
          <CardHeader title={"Create Your Journey"} subheader={"Say something like: \"I would like to create a learning journey that helps me improve my English writing skills\"."}/>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                multiline
                rows={1}
                size="small"
                label="Describe your new journey"
                fullWidth
                value={journeyDescription} // Controlled component
                onChange={handleTextFieldChange} // Update the state on input change
                sx={{ mr: 1, flexGrow: 1 }} // Use flexGrow to allow the TextField to grow
              />
              <Button variant="contained" onClick={handleButtonClick}>
                Apply
              </Button>
            </Box>
          </Card>
        </Grid>
      {/* </Grid> */}
    </Container>
  );
}
