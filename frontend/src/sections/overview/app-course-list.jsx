import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { CardActionArea } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function PostCard({ post, index }) {
  const { cover, courseName, courseRating, university, difficultyLevel, courseUrl} = post;

  const latestPostLarge = index === 0;

  const latestPost = index === 1 || index === 2;

  const renderAvatar = (
    <Avatar
      src={`/assets/icons/coursera-logo.png`}
      sx={{
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
        ...((latestPostLarge || latestPost) && {
          zIndex: 9,
          top: 24,
          left: 24,
          width: 40,
          height: 40,
        }),
      }}
    />
  );

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {courseName}
    </Link>
  );

  const renderInfo = (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={1.5}
      justifyContent="flex-end"
      sx={{
        mt: 3,
        color: 'text.disabled',
      }}
    >
      {[
        { number: courseRating, icon: 'eva:award-outline' },
        { number: difficultyLevel, icon: 'eva:bar-chart-2-outline' },
      ].map((info, _index) => (
        <Stack
          key={_index}
          direction="row"
          sx={{
            ...((latestPostLarge || latestPost) && {
              opacity: 0.48,
              color: 'common.white',
            }),
          }}
        >
          <Iconify width={16} icon={info.icon} sx={{ mr: 0.5 }} />
          <Typography variant="caption">{info.number}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  const renderCover = (
    <Box
      component="img"
      alt={courseName}
      src={`/assets/images/covers/cover_${index%24+1}.jpg`}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 2,
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      {university}
    </Typography>
  );

  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  const handleCardClick = () => {
    window.open(courseUrl, '_blank');
  };

  const handleAddCourse = (courseId, status) => {
    const userId = 'testid'; 
    const url = `http://localhost:3080/dbuser/changeCourseStatus/${userId},${courseId},${status}`;
    
    fetch(url, { method: 'GET' }) 
        .then(response => response.json())
        .then(data => {
            console.log('Course status updated:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};


  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card>
      <CardActionArea onClick={handleCardClick}>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          {renderShape}

          {renderAvatar}

          {renderCover}
        </Box>
        <Button
            variant="contained"
            size="small"
            onClick={() => handleAddCourse(post._id, 'ongoing')} 
            sx={{ position: 'absolute', top: 16, right: 16 }}
        >
            Add Course
        </Button>
        <Box
          sx={{
            p: (theme) => theme.spacing(4, 3, 3, 3),
            ...((latestPostLarge || latestPost) && {
              width: 1,
              bottom: 0,
              position: 'absolute',
            }),
          }}
        >
          {renderDate}

          {renderTitle}

          {renderInfo}
        </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  
  index: PropTypes.number,
  onAddCourse: PropTypes.func.isRequired,
};
