import { Container, Typography } from '@mui/material';
import JobForm from '../components/JobForm';

const EditJob = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
        Edit Job Post
      </Typography>
      <JobForm isEdit={true} />
    </Container>
  );
};

export default EditJob;