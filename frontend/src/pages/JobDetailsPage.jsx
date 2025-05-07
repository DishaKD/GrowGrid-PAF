import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Avatar,
  Paper,
} from '@mui/material';
import { Share, Edit, Delete } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import JobService from '../services/jobService';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await JobService.getJobById(id);
        setJob(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const updatedJob = await JobService.shareJob(id);
      setJob(updatedJob);
    } catch (err) {
      setError(err.message || 'Failed to share job');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return;
    
    setIsDeleting(true);
    try {
      await JobService.deleteJob(id);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {job.title}
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<Share />}
            onClick={handleShare}
            disabled={isSharing}
            sx={{ mr: 2 }}
          >
            Share ({job.shareCount})
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate(`/jobs/${id}/edit`)}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Chip label={job.company} />
        <Chip label={job.location} />
        <Chip label={job.employmentType} />
        {job.salary && <Chip label={`$${job.salary.toLocaleString()}`} />}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography paragraph>{job.description}</Typography>

          {job.requirements && (
            <>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Typography paragraph>{job.requirements}</Typography>
            </>
          )}

          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Typography paragraph>Email: {job.contactEmail}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          {job.photoUrls && job.photoUrls.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Photos
              </Typography>
              <Grid container spacing={1}>
                {job.photoUrls.map((url, index) => (
                  <Grid item key={index} xs={6}>
                    <Paper elevation={1}>
                      <Avatar
                        variant="rounded"
                        src={url}
                        sx={{ width: '100%', height: 'auto' }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {job.videoUrl && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Video
              </Typography>
              <ReactPlayer
                url={job.videoUrl}
                width="100%"
                height="auto"
                controls
              />
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobDetailsPage;