import { Card, CardContent, Typography, Button, Chip, Box, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 2,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)'
      }
    }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
          {job.title}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip 
            label={job.company} 
            size="small" 
            sx={{ backgroundColor: '#f0f4ff', color: '#3366ff' }} 
          />
          <Chip 
            label={job.location} 
            size="small" 
            sx={{ backgroundColor: '#f0f4ff', color: '#3366ff' }} 
          />
        </Stack>
        
        <Typography variant="body2" sx={{ 
          mb: 2, 
          color: 'text.secondary',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0',
          pt: 2
        }}>
          <Stack direction="row" spacing={1}>
            <Chip 
              label={job.employmentType} 
              size="small" 
              variant="outlined" 
            />
            {job.salary && (
              <Chip 
                label={`$${job.salary.toLocaleString()}`} 
                size="small" 
                color="success" 
                variant="outlined"
              />
            )}
          </Stack>
          
          <Button 
            variant="contained" 
            size="small" 
            component={Link} 
            to={`/jobs/${job.id}`}
            sx={{
              backgroundColor: '#3366ff',
              '&:hover': {
                backgroundColor: '#254eda'
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;