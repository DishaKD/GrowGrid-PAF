import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Photo as PhotoIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';

const MediaUploader = ({
  photos,
  setPhotos,
  video,
  setVideo,
  existingPhotoUrls = [],
  existingVideoUrl = '',
}) => {
  const [previewVideo, setPreviewVideo] = useState(existingVideoUrl);

  const onDropPhotos = useCallback(
    (acceptedFiles) => {
      if (photos.length + acceptedFiles.length > 3) {
        alert('Maximum 3 photos allowed');
        return;
      }
      setPhotos([...photos, ...acceptedFiles]);
    },
    [photos, setPhotos]
  );

  const onDropVideo = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > 60 * 1024 * 1024) {
          alert('Video cannot be larger than 60MB');
          return;
        }
        setVideo(file);
        setPreviewVideo(URL.createObjectURL(file));
      }
    },
    [setVideo]
  );

  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps } = useDropzone({
    onDrop: onDropPhotos,
    accept: 'image/*',
    multiple: true,
  });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    onDrop: onDropVideo,
    accept: 'video/*',
    multiple: false,
  });

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const removeVideo = () => {
    setVideo(null);
    setPreviewVideo('');
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Media
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        {/* Photos Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Photos (Max 3)
          </Typography>
          <Box
            {...getPhotoRootProps()}
            sx={{
              border: '1px dashed grey',
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 2,
            }}
          >
            <input {...getPhotoInputProps()} />
            <Typography>Drag & drop photos here, or click to select</Typography>
            <PhotoIcon sx={{ fontSize: 40, color: 'action.active', mt: 1 }} />
          </Box>

          <Grid container spacing={1}>
            {/* Existing photos */}
            {existingPhotoUrls.map((url, index) => (
              <Grid item key={`existing-${index}`}>
                <Paper elevation={1} sx={{ p: 1, position: 'relative' }}>
                  <Avatar
                    variant="rounded"
                    src={url}
                    sx={{ width: 100, height: 100 }}
                  />
                </Paper>
              </Grid>
            ))}

            {/* New photos */}
            {photos.map((file, index) => (
              <Grid item key={file.name}>
                <Paper elevation={1} sx={{ p: 1, position: 'relative' }}>
                  <Avatar
                    variant="rounded"
                    src={URL.createObjectURL(file)}
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                    }}
                    onClick={() => removePhoto(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Video Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Video (Max 60 seconds)
          </Typography>
          <Box
            {...getVideoRootProps()}
            sx={{
              border: '1px dashed grey',
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 2,
            }}
          >
            <input {...getVideoInputProps()} />
            <Typography>Drag & drop video here, or click to select</Typography>
            <VideocamIcon sx={{ fontSize: 40, color: 'action.active', mt: 1 }} />
          </Box>

          {(previewVideo || existingVideoUrl) && (
            <Box sx={{ position: 'relative' }}>
              <ReactPlayer
                url={previewVideo || existingVideoUrl}
                width="100%"
                height="auto"
                controls
              />
              {(video || previewVideo) && (
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={removeVideo}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  Remove Video
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MediaUploader;