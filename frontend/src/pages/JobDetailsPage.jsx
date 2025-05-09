import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Container,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import { Share, Edit, Delete } from "@mui/icons-material";
import ReactPlayer from "react-player";
import JobService from "../services/jobService";

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
        console.log("Fetched job:", data); // Check if this logs your data
        setJob(data);
      } catch (err) {
        setError(err.message || "Failed to fetch job details");
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
      setError(err.message || "Failed to share job");
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job post?"))
      return;

    setIsDeleting(true);
    try {
      await JobService.deleteJob(id);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="warning">Job not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={600}>
                {job.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {job.company} • {job.location}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={handleShare} disabled={isSharing}>
                <Share />
              </IconButton>
              <IconButton onClick={() => navigate(`/jobs/${id}/edit`)}>
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Delete />
              </IconButton>
            </Stack>
          </Box>

          {/* Tags */}
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
            <Chip label={job.employmentType} color="primary" />
            {job.salary && <Chip label={`$${job.salary.toLocaleString()}`} />}
            <Chip label={`Shared ${job.shareCount} times`} variant="outlined" />
          </Stack>

          {/* Description */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography>{job.description}</Typography>
          </Box>

          {/* Requirements */}
          {job.requirements && (
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Typography>{job.requirements}</Typography>
            </Box>
          )}

          {/* Contact Info */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography>Email: {job.contactEmail}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Media */}
          <Box>
            {/* Video */}
            {job.videoUrl && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Introduction Video
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                  }}
                >
                  <ReactPlayer
                    url={job.videoUrl}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </Box>
              </Box>
            )}

            {/* Photos */}
            {job.photoUrls?.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Photos
                </Typography>
                <Stack direction="row" spacing={2} mt={1}>
                  {job.photoUrls.map((url, index) => (
                    <Avatar
                      key={index}
                      src={url}
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetailsPage;
