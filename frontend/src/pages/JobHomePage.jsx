import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import JobService from "../services/jobService";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await JobService.getAllJobs();
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          throw new Error("Response data is not an array");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Available Jobs
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/create-job")}>
          Post Job
        </Button>
      </Box>

      {jobs.length === 0 ? (
        <Typography variant="body1">No jobs available at the moment.</Typography>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </Container>
  );
};

export default HomePage;
