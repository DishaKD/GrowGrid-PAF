// src/components/JobForm.jsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { PhotoCamera, Videocam, Close } from "@mui/icons-material";

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary",
];

const validationSchema = Yup.object({
  title: Yup.string().required("Job title is required").max(100),
  description: Yup.string().required("Job description is required").max(2000),
  company: Yup.string().required("Company name is required"),
  location: Yup.string().max(200),
  employmentType: Yup.string().oneOf(employmentTypes),
  salary: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid salary")
    .nullable(),
  requirements: Yup.string().max(1000),
  contactEmail: Yup.string().email().required("Contact email is required"),
  deadline: Yup.date()
    .nullable()
    .required("Application deadline is required")
    .min(new Date(), "Deadline must be a future date"),
});

const JobForm = ({ initialValues = {}, onSubmit, isSubmitting }) => {
  const [skills, setSkills] = useState(initialValues.skills || []);
  const [photoFiles, setPhotoFiles] = useState([]); // New files
  const [photoURLs, setPhotoURLs] = useState(initialValues.photoUrls || []); // Existing URLs
  const [videoFile, setVideoFile] = useState(null); // New file
  const [videoURL, setVideoURL] = useState(initialValues.videoUrl || null); // Existing URL

  useEffect(() => {
    setSkills(initialValues.skills || []);
    setPhotoURLs(initialValues.photoUrls || []);
    setVideoURL(initialValues.videoUrl || null);
  }, [initialValues]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialValues.title || "",
      description: initialValues.description || "",
      company: initialValues.company || "",
      location: initialValues.location || "",
      employmentType: initialValues.employmentType || "",
      salary: initialValues.salary || "",
      requirements: initialValues.requirements || "",
      contactEmail: initialValues.contactEmail || "",
      deadline: initialValues.deadline?.substring(0, 10) || "", // Ensure date format
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      const jobPostBlob = new Blob(
        [JSON.stringify({ ...values, skills })],
        { type: "application/json" }
      );
      formData.append("jobPost", jobPostBlob);

      photoFiles.forEach((file) => formData.append("photos", file));
      if (videoFile) formData.append("video", videoFile);

      onSubmit(formData);
    },
  });

  const handleSkillAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      setSkills([...skills, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleSkillRemove = (i) => setSkills(skills.filter((_, idx) => idx !== i));

  const handlePhotoUpload = (files) => {
    setPhotoFiles([...photoFiles, ...files]);
  };

  const handleVideoUpload = (files) => {
    setVideoFile(files[0]);
    setVideoURL(null); // Remove existing video if new one is added
  };

  const removePhotoFile = (i) => {
    setPhotoFiles(photoFiles.filter((_, idx) => idx !== i));
  };

  const removePhotoURL = (i) => {
    setPhotoURLs(photoURLs.filter((_, idx) => idx !== i));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoURL(null);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        {/* Title */}
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Job Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          sx={{ mb: 2 }}
        />

        {/* Description */}
        <TextField
          fullWidth
          multiline
          rows={4}
          id="description"
          name="description"
          label="Job Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 2 }}
        />

        {/* Skills */}
        <Box sx={{ mb: 2 }}>
          <Typography>Skills</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1 }}>
            {skills.map((skill, i) => (
              <Chip key={i} label={skill} onDelete={() => handleSkillRemove(i)} />
            ))}
          </Box>
          <TextField
            placeholder="Add a skill and press Enter"
            onKeyDown={handleSkillAdd}
            fullWidth
          />
        </Box>

        {/* Company and Location */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="company"
              name="company"
              label="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
        </Grid>

        {/* Employment Type and Salary */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                id="employmentType"
                name="employmentType"
                label="Employment Type"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
              >
                {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="salary"
              name="salary"
              label="Salary"
              value={formik.values.salary}
              onChange={formik.handleChange}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
            />
          </Grid>
        </Grid>

        {/* Requirements */}
        <TextField
          fullWidth
          multiline
          rows={2}
          id="requirements"
          name="requirements"
          label="Requirements"
          value={formik.values.requirements}
          onChange={formik.handleChange}
          error={formik.touched.requirements && Boolean(formik.errors.requirements)}
          helperText={formik.touched.requirements && formik.errors.requirements}
          sx={{ mb: 2 }}
        />

        {/* Contact Email */}
        <TextField
          fullWidth
          id="contactEmail"
          name="contactEmail"
          label="Contact Email"
          value={formik.values.contactEmail}
          onChange={formik.handleChange}
          error={formik.touched.contactEmail && Boolean(formik.errors.contactEmail)}
          helperText={formik.touched.contactEmail && formik.errors.contactEmail}
          sx={{ mb: 2 }}
        />

        {/* Deadline */}
        <TextField
          fullWidth
          type="date"
          id="deadline"
          name="deadline"
          value={formik.values.deadline}
          onChange={formik.handleChange}
          error={formik.touched.deadline && Boolean(formik.errors.deadline)}
          helperText={formik.touched.deadline && formik.errors.deadline}
          sx={{ mb: 2 }}
        />

        {/* Media Upload */}
        <Box sx={{ mb: 2 }}>
          <Typography>Upload Media</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <IconButton component="label">
              <PhotoCamera />
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) =>
                  handlePhotoUpload(Array.from(e.target.files))
                }
              />
            </IconButton>
            <IconButton component="label">
              <Videocam />
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={(e) =>
                  handleVideoUpload(Array.from(e.target.files))
                }
              />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {photoURLs.map((url, i) => (
              <Box key={i} sx={{ position: "relative" }}>
                <img src={url} alt={`photo-${i}`} width={100} height={100} style={{ objectFit: "cover" }} />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => removePhotoURL(i)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {photoFiles.map((file, i) => (
              <Box key={`file-${i}`} sx={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`file-${i}`}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => removePhotoFile(i)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {(videoFile || videoURL) && (
              <Box sx={{ position: "relative" }}>
                <video
                  src={videoFile ? URL.createObjectURL(videoFile) : videoURL}
                  width={100}
                  height={100}
                  controls
                />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={removeVideo}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Update Job"}
        </Button>
      </Box>
    </Paper>
  );
};

export default JobForm;
