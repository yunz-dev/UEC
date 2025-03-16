import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ title, startTime, duration, location, description, category }) => {
  const getEventColor = () => {
    const categoryColors = {
      'Uncategoried': 'bg-blue-600',
      'Meeting': 'bg-purple-600',
      'Social': 'bg-green-600',
      'Academic': 'bg-amber-600',
      'Sports': 'bg-red-600'
    };
    
    if (category && categoryColors[category]) {
      return categoryColors[category];
    }
    
    const colors = Object.values(categoryColors);
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const formatDuration = () => {
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

  return (
    <div
      className={`flex flex-col rounded-lg p-4 mb-4 text-sm leading-5 shadow-md hover:shadow-lg transition-shadow border border-white/30 ${getEventColor()}`}
    >
      <p className="font-semibold text-white text-base">{title}</p>
      
      <div className="flex flex-col space-y-2 mt-2">
        <p className="text-white">
          {new Date(1970, 0, 1, startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          {' - '}
          {new Date(1970, 0, 1, startTime + duration).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          {' '}
          <span className="text-white/80">({formatDuration()})</span>
        </p>
        
        {location && (
          <p className="text-white opacity-90">
            📍 {location}
          </p>
        )}
        
        {category && category !== 'Event' && (
          <span className="inline-flex items-center rounded-full bg-white bg-opacity-25 px-2 py-1 text-xs font-medium text-white self-start">
            {category}
          </span>
        )}
        
        {description && description.length > 0 && (
          <p className="mt-1 text-white opacity-80">
            {description.length > 150 ? `${description.substring(0, 150)}...` : description}
          </p>
        )}
      </div>
    </div>
  );
};

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
          dateFormatted: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        
        return formattedEvent;
      } catch (error) {
        return null;
      }
    })
    .filter(event => event !== null)
    .sort((a, b) => a.date - b.date);
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
    <div className="mt-8 w-full max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Events on Campus</h1>
      
      {status && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-2 mb-4 text-center">
          <p className="text-sm">{status}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center my-8">Loading events...</div>
      ) : error ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 my-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {Object.keys(groupedEvents).length > 0 ? (
            Object.keys(groupedEvents).sort().map(dateKey => (
              <div key={dateKey} className="mb-8">
                <h2 className="text-lg font-medium mb-4">{dateKey}</h2>
                <div className="space-y-4">
                  {groupedEvents[dateKey].map((event) => (
                    <EventCard
                      key={event.id}
                      title={event.title}
                      startTime={event.startTime}
                      duration={event.duration}
                      location={event.location}
                      description={event.description}
                      category={event.category}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No events found</div>
          )}
        </div>
      )}
      
      <div className="flex justify-center mt-8 mb-8">
        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default EventsList;