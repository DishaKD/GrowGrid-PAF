import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera,
  Videocam,
  Code,
  Close,
} from '@mui/icons-material';

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').max(100, 'Title is too long'),
  description: Yup.string().required('Description is required').max(2000, 'Description is too long'),
  company: Yup.string().required('Company is required'),
  location: Yup.string(),
  employmentType: Yup.string(),
  salary: Yup.number().positive('Salary must be positive').nullable(),
  requirements: Yup.string(),
  contactEmail: Yup.string().email('Invalid email').required('Contact email is required'),
});

const JobForm = ({ initialValues, onSubmit, isSubmitting }) => {
  const [photos, setPhotos] = useState(initialValues.photos || []);
  const [video, setVideo] = useState(initialValues.video || null);
  const [skills, setSkills] = useState(initialValues.skills || []);

  const formik = useFormik({
    initialValues: {
      title: initialValues.title || '',
      description: initialValues.description || '',
      company: initialValues.company || '',
      location: initialValues.location || '',
      employmentType: initialValues.employmentType || '',
      salary: initialValues.salary || '',
      requirements: initialValues.requirements || '',
      contactEmail: initialValues.contactEmail || '',
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (value !== '') formData.append(key, value);
      });
      
      if (photos.length > 0) {
        photos.forEach((photo) => {
          formData.append('photos', photo);
        });
      }
      
      if (video) {
        formData.append('video', video);
      }
      
      onSubmit(formData);
    },
  });

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setSkills([...skills, e.target.value]);
      e.target.value = '';
    }
  };

  const handleSkillRemove = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleMediaUpload = (type, files) => {
    if (type === 'photo') {
      setPhotos([...photos, ...files]);
    } else if (type === 'video') {
      setVideo(files[0]);
    }
  };

  const handleMediaRemove = (type, index) => {
    if (type === 'photo') {
      setPhotos(photos.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setVideo(null);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        New Job Listing
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="title"
          name="title"
          placeholder="Job Title (Product Designer, Frontend Engineer, etc...)"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          sx={{ mb: 2 }}
          InputProps={{
            style: {
              fontSize: '1.2rem',
              fontWeight: 'bold',
            },
          }}
        />

        <TextField
          fullWidth
          id="description"
          name="description"
          placeholder="Job description..."
          multiline
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Skills Required
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleSkillRemove(index)}
                variant="outlined"
              />
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Add skills (UX Design, JavaScript, etc...)"
            onKeyDown={handleSkillAdd}
            sx={{ mb: 2 }}
          />
        </Box>

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
              label="Location (San Francisco, Remote, etc...)"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Employment Type</InputLabel>
              <Select
                id="employmentType"
                name="employmentType"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
                label="Employment Type"
                error={formik.touched.employmentType && Boolean(formik.errors.employmentType)}
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
              label="Compensation ($120k - $150k, $80/hr, etc...)"
              value={formik.values.salary}
              onChange={formik.handleChange}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          id="requirements"
          name="requirements"
          label="Requirements"
          multiline
          rows={2}
          value={formik.values.requirements}
          onChange={formik.handleChange}
          error={formik.touched.requirements && Boolean(formik.errors.requirements)}
          helperText={formik.touched.requirements && formik.errors.requirements}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          id="contactEmail"
          name="contactEmail"
          label="Contact Email"
          type="email"
          value={formik.values.contactEmail}
          onChange={formik.handleChange}
          error={formik.touched.contactEmail && Boolean(formik.errors.contactEmail)}
          helperText={formik.touched.contactEmail && formik.errors.contactEmail}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Application Deadline
          </Typography>
          <TextField
            fullWidth
            type="date"
            defaultValue="2022-10-31"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Add Media
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="primary" component="label">
              <PhotoCamera />
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) => handleMediaUpload('photo', Array.from(e.target.files))}
              />
            </IconButton>
            <IconButton color="primary" component="label">
              <Videocam />
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={(e) => handleMediaUpload('video', Array.from(e.target.files))}
              />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {photos.map((photo, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Preview ${index}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                  onClick={() => handleMediaRemove('photo', index)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            ))}
            {video && (
              <Box sx={{ position: 'relative' }}>
                <video
                  src={URL.createObjectURL(video)}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                  onClick={() => handleMediaRemove('video')}
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
          color="primary"
          disabled={isSubmitting}
          fullWidth
          sx={{ py: 1.5, fontWeight: 'bold' }}
        >
          {isSubmitting ? 'Posting Job...' : 'Post Job'}
        </Button>
      </Box>
    </Paper>
  );
};

export default JobForm;