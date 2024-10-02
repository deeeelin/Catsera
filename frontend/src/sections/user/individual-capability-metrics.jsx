//
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button'; 
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles'; 

import Chart, { useChart } from 'src/components/chart'; 

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppCurrentSubject({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { series, colors, categories, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.48,
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: [...Array(categories.length)].map(() => theme.palette.text.secondary),
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title || "Current Popular Subjects"} subheader={subheader || "Trending Topics in Learning"} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="radar"
        series={series}
        options={chartOptions}
        width="100%"
        height={340}
      />

      <Typography variant="body1" sx={{ m: 2 }}>
        Explore our top courses in each of these trending topics to enhance your skills.
      </Typography>

      <Button variant="contained" color="primary" sx={{ m: 2 }}>
        View Related Courses
      </Button>
    </Card>
  );
}

AppCurrentSubject.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
