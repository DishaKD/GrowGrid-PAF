import { Container, Typography, CircularProgress } from '@mui/material';
import JobForm from '../components/JobForm';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/jobService';

const EditJob = () => {
  const { id } = useParams(); // Get job ID from URL
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getJobById(id)
      .then((data) => {
        setJobData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching job:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Edit Job Post
      </Typography>
      <JobForm isEdit={true} initialData={jobData} onSubmit={(updatedData) => api.updateJob(id, updatedData)} />
    </Container>
  );
};

export default EditJob;
