import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Alert } from '@mui/material';
import JobForm from '../components/JobForm';
import JobService from '../services/jobService';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await JobService.createJob(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create job post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Job Post
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <JobForm
        initialValues={{
          title: '',
          description: '',
          company: '',
          location: '',
          employmentType: '',
          salary: '',
          requirements: '',
          contactEmail: '',
          photos: [],
          video: null,
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default CreateJobPage;