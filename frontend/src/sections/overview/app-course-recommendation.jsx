import React from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import StarRating from '@mui/material/Rating';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  transition: '0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CourseMedia = styled(CardMedia)({
  height: 140,
});

const CourseCardContent = styled(CardContent)({
  textAlign: 'left',
});

const CourseButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));


const courses = [
  {
    id: 1,
    title: "Advanced Machine Learning",
    description: "Dive deeper into ML with this advanced course.",
    imageUrl: "path_to_ml_course_image",
    rating: 4.8
  },

];

export default function AppCourseRecommendation() {
  return (
    <div>
      <CardHeader title="Recommended Courses" subheader="Courses tailored for your learning path" />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {courses.map(course => (
          <StyledCard key={course.id}>
            <CourseMedia image={course.imageUrl} title={course.title} />
            <CourseCardContent>
              <Typography gutterBottom variant="h5" component="div">
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.description}
              </Typography>
              <StarRating value={course.rating} readOnly />
              <CourseButton variant="outlined" color="primary">
                Learn More
              </CourseButton>
            </CourseCardContent>
          </StyledCard>
        ))}
      </div>
    </div>
  );
}


