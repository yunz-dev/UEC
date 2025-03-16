import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlaceIcon from '@mui/icons-material/Place';

const EventCard = styled(Card)(({ theme, category }) => {
  const getCategoryColor = () => {
    const categories = {
      'Unknown': '#9e9e9e',
      'Sport': '#2196f3',
      'Cultural': '#ff9800',
      'Academic': '#4caf50',
      'Networking': '#9c27b0',
      'Gaming': '#f44336',
      'Health': '#00bcd4'
    };

    return categories[category] || categories['Unknown'];
  };

  return {
    marginBottom: theme.spacing(2),
    position: 'relative',
    borderLeft: `5px solid ${getCategoryColor()}`,
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    }
  };
});

const EventCategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  fontSize: '0.75rem',
}));

const DateHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 500,
}));

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [icsUrl, setIcsUrl] = useState('');

  const transformEvents = (events) => {
    return events.map(event => {
      try {
        let startDate, endDate;

        if (event.start_time) {
          startDate = new Date(event.start_time);
        } else if (event.start) {
          startDate = new Date(event.start);
        } else {
          return null;
        }

        if (event.end_time) {
          endDate = new Date(event.end_time);
        } else if (event.end) {
          endDate = new Date(event.end);
        } else {
          endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return null;
        }

        const durationMs = endDate - startDate;
        const durationHours = Math.max(0.5, durationMs / (1000 * 60 * 60));
        const hours = startDate.getHours() + (startDate.getMinutes() / 60);

        const title = event.summary || event.title || 'Untitled Event';

        let category = 'Event';
        if (event.category) {
          if (Array.isArray(event.category) && event.category.length > 0) {
            category = event.category[0];
          } else if (typeof event.category === 'string') {
            category = event.category;
          }
        }

        const formattedEvent = {
          id: event.id || `event-${Math.random().toString(36).substring(2, 9)}`,
          title: title,
          description: event.description || '',
          location: event.location || '',
          category: category,
          startTime: hours,
          duration: durationHours,
          date: startDate,
          dayName: startDate.toLocaleDateString('en-US', { weekday: 'long' }),
          dateFormatted: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          link: event.link || '',
          cost: event.cost !== undefined ? event.cost : null
        };

        return formattedEvent;
      } catch (error) {
        return null;
      }
    })
      .filter(event => event !== null)
      .sort((a, b) => a.date - b.date);
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);

    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}hr`;
    } else {
      return `${hours}hr ${minutes}min`;
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        const storedIcsUrl = localStorage.getItem('calendarIcsUrl') || '';

        const apiUrl = process.env.REACT_APP_API_URL || "https://uec-hb09.onrender.com";

        let fetchUrl = `${apiUrl}/events?start_time=${startDate.toISOString()}`;

        if (storedIcsUrl) {
          const encodedIcsUrl = encodeURIComponent(storedIcsUrl.trim());
          fetchUrl += `&ics_url=${encodedIcsUrl}`;
          setStatus(`Fetching events from ICS URL: ${storedIcsUrl}`);
        }

        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'same-origin'
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format: Expected JSON");
        }

        const data = await response.json();

        if (Array.isArray(data.events) && data.events.length > 0) {
          setStatus(`Successfully found ${data.events.length} events!`);
          const formattedEvents = transformEvents(data.events);
          setEvents(formattedEvents);
        } else {
          setStatus("No events found");
        }
      } catch (error) {
        setError(`Failed to fetch events: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const groupedEvents = events.reduce((groups, event) => {
    const dateKey = event.dateFormatted;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});

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
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'primary.main',
            mb: 4,
          }}
        >
          Events on Campus
        </Typography>

        {status && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {status}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="warning" sx={{ my: 3 }}>
            {error}
          </Alert>
        ) : (
          <Box>
            {Object.keys(groupedEvents).length > 0 ? (
              Object.keys(groupedEvents).sort().map(dateKey => (
                <Box key={dateKey} sx={{ mb: 5 }}>
                  <DateHeader variant="h5">
                    {dateKey}
                  </DateHeader>
                  <Box sx={{ mb: 2 }}>
                    {groupedEvents[dateKey].map((event) => (
                      <EventCard
                        key={event.id}
                        category={event.category}
                        elevation={2}
                        onClick={() => {
                          if (event.link) {
                            window.open(event.link, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                            {event.title}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            {new Date(1970, 0, 1, event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            {' - '}
                            {new Date(1970, 0, 1, event.startTime + event.duration).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            {' '}
                            <span>({formatDuration(event.duration)})</span>
                          </Typography>

                          {event.cost !== null && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              <strong>Cost:</strong> {event.cost === 0 ? 'Free' : `$${event.cost.toFixed(2)}`}
                            </Typography>
                          )}

                          {event.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <PlaceIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {event.location}
                              </Typography>
                            </Box>
                          )}

                          {event.description && event.description.length > 0 && (
                            <Typography variant="body2" sx={{ mt: 1.5 }}>
                              {event.description.length > 150 ? `${event.description.substring(0, 150)}...` : event.description}
                            </Typography>
                          )}

                          {event.category && event.category !== 'Event' && (
                            <EventCategoryChip label={event.category} size="small" />
                          )}
                        </CardContent>
                      </EventCard>
                    ))}
                  </Box>
                </Box>
              ))
            ) : (
              <Paper sx={{ p: 5, textAlign: 'center' }}>
                <Typography color="text.secondary">No events found</Typography>
              </Paper>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              px: 4,
              py: 1,
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default EventsList;