// s
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'; 
import Chart, { useChart } from 'src/components/chart'; 

import PropTypes from 'prop-types';

// ----------------------------------------------------------------------
// 

// ----------------------------------------------------------------------

export default function AppCourseCompletionRates({ title, subheader, chart, ...other }) {
  const { colors, series, options } = chart;

  const chartSeries = series.map((course) => ({
    name: course.label,
    data: [course.value]
  }));

  const chartOptions = useChart({
    colors,
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Completion Rate'],
    },
    yaxis: {
      title: {
        text: 'Percentage (%)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%` 
      }
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title || "Course Completion Rates"} subheader={subheader || "Overview of Course Engagement"} />
      <Box sx={{ p: 3 }}>
        <Chart
          type="bar"
          height={350}
          series={chartSeries}
          options={chartOptions}
        />
      </Box>
    </Card>
  );
}

AppCourseCompletionRates.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

