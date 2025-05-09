// src/components/JobForm.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Grid, MenuItem,
  FormControl, InputLabel, Select, Box,
  Typography, Paper, Chip, Divider, IconButton
} from '@mui/material';
import { PhotoCamera, Videocam, Close } from '@mui/icons-material';

// Employment options
const employmentTypes = [
  'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'
];

// Full validation schema with Yup
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Job title is required')
    .max(100, 'Title cannot exceed 100 characters'),

  description: Yup.string()
    .required('Job description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),

  company: Yup.string()
    .required('Company name is required'),

  location: Yup.string()
    .max(200, 'Location should be less than 200 characters'),

  employmentType: Yup.string()
    .oneOf(employmentTypes, 'Select a valid employment type'),

  salary: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid salary (e.g. 50000 or 50000.00)')
    .nullable(),

  requirements: Yup.string()
    .max(1000, 'Requirements should be less than 1000 characters'),

  contactEmail: Yup.string()
    .email('Enter a valid email')
    .required('Contact email is required'),

  deadline: Yup.date()
    .nullable()
    .required('Application deadline is required')
    .min(new Date(), 'Deadline must be a future date'),
});

const JobForm = ({ initialValues = {}, onSubmit, isSubmitting }) => {
  const [photos, setPhotos] = useState(initialValues.photos || []);
  const [video, setVideo] = useState(initialValues.video || null);
  const [skills, setSkills] = useState(initialValues.skills || []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialValues.title || '',
      description: initialValues.description || '',
      company: initialValues.company || '',
      location: initialValues.location || '',
      employmentType: initialValues.employmentType || '',
      salary: initialValues.salary || '',
      requirements: initialValues.requirements || '',
      contactEmail: initialValues.contactEmail || '',
      deadline: initialValues.deadline || ''
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== '') formData.append(key, val);
      });
      skills.forEach(skill => formData.append('skills', skill));
      photos.forEach(photo => formData.append('photos', photo));
      if (video) formData.append('video', video);
      onSubmit(formData);
    },
  });

  const handleSkillAdd = e => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      setSkills([...skills, e.target.value]);
      e.target.value = '';
    }
  };

  const handleSkillRemove = idx =>
    setSkills(skills.filter((_, i) => i !== idx));

  const handleMediaUpload = (type, files) => {
    if (type === 'photo') setPhotos([...photos, ...files]);
    else setVideo(files[0]);
  };

  const handleMediaRemove = (type, idx) => {
    if (type === 'photo') setPhotos(photos.filter((_, i) => i !== idx));
    else setVideo(null);
  };

  return (
    <Paper sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>New Job Listing</Typography>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>

        {/* Job Title */}
        <TextField
          fullWidth id="title" name="title"
          label="Job Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={!!formik.errors.title && formik.touched.title}
          helperText={formik.touched.title && formik.errors.title}
          sx={{ mb: 2 }}
        />

        {/* Description */}
        <TextField
          fullWidth id="description" name="description"
          label="Job Description" multiline rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={!!formik.errors.description && formik.touched.description}
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 2 }}
        />

        {/* Skills */}
        <Box sx={{ mb: 2 }}>
          <Typography>Skills Required</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {skills.map((s, i) => (
              <Chip key={i} label={s} onDelete={() => handleSkillRemove(i)} />
            ))}
          </Box>
          <TextField
            fullWidth placeholder="Add a skill and press Enter"
            onKeyDown={handleSkillAdd}
          />
        </Box>

        {/* Company & Location */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth id="company" name="company" label="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={!!formik.errors.company && formik.touched.company}
              helperText={formik.touched.company && formik.errors.company}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth id="location" name="location" label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={!!formik.errors.location && formik.touched.location}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
        </Grid>

        {/* Employment Type & Salary */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                id="employmentType" name="employmentType"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
                label="Employment Type"
                error={!!formik.errors.employmentType && formik.touched.employmentType}
              >
                {employmentTypes.map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth id="salary" name="salary" label="Compensation"
              value={formik.values.salary}
              onChange={formik.handleChange}
              error={!!formik.errors.salary && formik.touched.salary}
              helperText={formik.touched.salary && formik.errors.salary}
            />
          </Grid>
        </Grid>

        {/* Requirements */}
        <TextField
          fullWidth id="requirements" name="requirements"
          label="Requirements" multiline rows={2}
          value={formik.values.requirements}
          onChange={formik.handleChange}
          error={!!formik.errors.requirements && formik.touched.requirements}
          helperText={formik.touched.requirements && formik.errors.requirements}
          sx={{ mb: 2 }}
        />

        {/* Contact Email */}
        <TextField
          fullWidth id="contactEmail" name="contactEmail"
          label="Contact Email" type="email"
          value={formik.values.contactEmail}
          onChange={formik.handleChange}
          error={!!formik.errors.contactEmail && formik.touched.contactEmail}
          helperText={formik.touched.contactEmail && formik.errors.contactEmail}
          sx={{ mb: 2 }}
        />

        {/* Deadline */}
        <TextField
          fullWidth type="date" id="deadline" name="deadline"
          value={formik.values.deadline}
          onChange={formik.handleChange}
          error={!!formik.errors.deadline && formik.touched.deadline}
          helperText={formik.touched.deadline && formik.errors.deadline}
          sx={{ mb: 2 }}
        />

        {/* Media Upload */}
        <Box sx={{ mb: 2 }}>
          <Typography>Add Media</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton component="label">
              <PhotoCamera />
              <input
                type="file" hidden accept="image/*" multiple
                onChange={e => handleMediaUpload('photo', Array.from(e.target.files))}
              />
            </IconButton>
            <IconButton component="label">
              <Videocam />
              <input
                type="file" hidden accept="video/*"
                onChange={e => handleMediaUpload('video', Array.from(e.target.files))}
              />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {photos.map((p, i) => (
              <Box key={i} sx={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(p)}
                  alt={`photo-${i}`}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => handleMediaRemove('photo', i)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {video && (
              <Box sx={{ position: 'relative' }}>
                <video
                  src={URL.createObjectURL(video)}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                  controls
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => setVideo(null)}
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
          variant="contained"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </Button>
      </Box>
    </Paper>
  );
};

export default JobForm;
