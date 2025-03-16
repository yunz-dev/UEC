import React, { useState, useRef } from 'react';
import { Typography, Box, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const UploadContainer = styled(Paper)(({ theme }) => ({
  marginTop: '10px',
  padding: theme.spacing(4),
  border: '2px dashed #90caf9',
  borderRadius: theme.spacing(2),
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ToggleButton = styled(Button)(({ theme, active }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(2),
  textTransform: 'none',
  fontSize: '0.75rem',
  boxShadow: active ? theme.shadows[2] : 'none',
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(25, 118, 210, 0.04)',
  },
}));

function Home() {
  const [uploadMethod, setUploadMethod] = useState('link');
  const [isFetching, setIsFetching] = useState(false);
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [showTimetable, setShowTimetable] = useState(false);
  const [data, setData] = useState(null);
  
  const inputRef = useRef();
  const fileInputRef = useRef();
  
  const handleSubmit = async () => {
    if ((uploadMethod === "link" && !inputRef.current.value) || 
        (uploadMethod === "file" && !fileInputRef.current.files[0])) {
      setErrorMessage("Please provide your calendar");
      return;
    }

    setStatus("Processing calendar");
    setErrorMessage("");
    setIsFetching(true);
    
    try {
      if (uploadMethod === "link") {
        setStatus("Fetching calendar from URL");
        const url = inputRef.current.value;
        
        try {
          new URL(url); // This will throw if URL is invalid
        } catch(e) {
          setErrorMessage("Please enter a valid URL");
          setIsFetching(false);
          return;
        }
        
        localStorage.setItem('calendarIcsUrl', url);
        
        // Import API function here to avoid circular imports
        const { getEventsFromIcsUrl } = await import('../services/api');
        
        try {
          const events = await getEventsFromIcsUrl(url);
          
          if (!events || events.length === 0) {
            setStatus("No events found in this calendar");
            setTimeout(() => {
              setIsFetching(false);
              window.location.href = '/events';
            }, 1000);
            return;
          }
          
          setStatus(`Found ${events.length} events in calendar`);
          
          // Redirect to the events page
          setTimeout(() => {
            setIsFetching(false);
            window.location.href = '/events';
          }, 800);
        } catch (error) {
          setErrorMessage("Error fetching events from URL: " + error.message);
          setIsFetching(false);
          return;
        }
      } else {
        // Process uploaded file
        setStatus("Reading calendar file");
        const file = fileInputRef.current.files[0];
        
        if (!file.name.toLowerCase().endsWith('.ics')) {
          setErrorMessage("Please upload an ICS file");
          setIsFetching(false);
          return;
        }
        
        // Import API function here to avoid circular imports
        const { uploadICSFile } = await import('../services/api');
        
        try {
          const result = await uploadICSFile(file);
          
          if (!result.events || result.events.length === 0) {
            setStatus("No events found in this calendar file");
            setTimeout(() => {
              setIsFetching(false);
              window.location.href = '/events';
            }, 1000);
            return;
          }
          
          // Store the event data directly in localStorage
          localStorage.setItem('calendarEvents', JSON.stringify(result.events));
          localStorage.setItem('calendarFileName', file.name);
          
          setStatus(`Found ${result.events.length} events in calendar`);
          
          // Redirect to the calendar page
          setTimeout(() => {
            setIsFetching(false);
            window.location.href = '/events';
          }, 800);
        } catch (error) {
          setErrorMessage("Error processing ICS file: " + error.message);
          setIsFetching(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error processing calendar:", error);
      setErrorMessage("Error processing calendar: " + error.message);
      setIsFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setUploadMethod("file");
      
      // We can't directly set fileInputRef.current.files in React
      // But we can trigger a change event that simulates the file selection
      if (fileInputRef.current) {
        // In a real app, you'd need to handle this differently
        // This is just for demonstration purposes
        setFileName(file.name);
      }
    }
  };
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mt: 6,
        mb: 8,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'primary.main',
            mb: 4,
          }}
        >
          UniSync
        </Typography>
        
        <Typography 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            mx: 'auto',
            mb: 5,
          }}
        >
          Upload your calendar or paste a link below to get started!
        </Typography>
        
        <UploadContainer
          elevation={2}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButton 
              size="small"
              active={uploadMethod === 'link'}
              onClick={() => setUploadMethod('link')}
            >
              Paste Link
            </ToggleButton>
            <ToggleButton 
              size="small"
              active={uploadMethod === 'file'}
              onClick={() => setUploadMethod('file')}
            >
              Upload File
            </ToggleButton>
          </Box>
          
          {uploadMethod === 'link' ? (
            <TextField
              inputRef={inputRef}
              fullWidth
              placeholder="Paste your calendar link here..."
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                }
              }}
            />
          ) : (
            <Box sx={{ width: '100%', position: 'relative' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ics,.ical,.icalendar"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              />
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: 'white',
                }}
              >
                <Typography 
                  sx={{ 
                    flexGrow: 1,
                    color: fileName ? 'text.primary' : 'text.disabled'
                  }}
                >
                  {fileName || "Drop a calendar file here or click to browse..."}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ ml: 'auto' }}
                >
                  Browse
                </Button>
              </Box>
            </Box>
          )}
          
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
            Supported formats: ICS
          </Typography>
        </UploadContainer>
      </Box>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ 
          mt: 3,
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          px: 4,
          py: 1,
        }}
        onClick={handleSubmit}
        disabled={isFetching}
        startIcon={isFetching ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {!isFetching ? "Let's go!" : status}
      </Button>
      
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}

export default Home;
