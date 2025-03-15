import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CalendarEvent = ({ title, startTime, duration, location, description, category, colStart }) => {
  const gridRow = Math.floor((startTime - 7) * 2) + 2;
  
  const span = Math.max(1, Math.floor(duration * 2));
  
  console.log(`Event: ${title}, startTime: ${startTime}, gridRow: ${gridRow}, span: ${span}, colStart: ${colStart}`);

  const getEventColor = () => {
    const categoryColors = {
      'Uncategoried': 'bg-blue-600', // add more
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
    <li className="relative mt-px" style={{
      gridRow: `${gridRow} / span ${span}`,
      gridColumn: `${colStart} / span 1`,
      minHeight: span > 1 ? `${span * 1.75}rem` : 'auto',
      zIndex: 20
    }}>
      <div
        className={`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5 shadow-md hover:shadow-lg transition-shadow border border-white/30 ${getEventColor()}`}
      >
        <p className="font-semibold text-white text-sm">{title}</p>
        
        <div className="flex flex-col space-y-1">
          <p className="text-white">
            {new Date(1970, 0, 1, startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            {' - '}
            {new Date(1970, 0, 1, startTime + duration).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            {' '}
            <span className="text-white/80 text-xs">({formatDuration()})</span>
          </p>
          
          {location && (
            <p className="text-white opacity-90 text-xs">
              📍 {location}
            </p>
          )}
          
          {category && category !== 'Event' && (
            <span className="inline-flex items-center rounded-full bg-white bg-opacity-25 px-1.5 py-0.5 text-xs font-medium text-white self-start">
              {category}
            </span>
          )}
          
          {description && description.length > 0 && (
            <p className="mt-1 text-white opacity-80 text-xs max-h-20 overflow-y-auto">
              {description.length > 100 ? `${description.substring(0, 100)}...` : description}
            </p>
          )}
        </div>
      </div>
    </li>
  );
};

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  const transformEventsForCalendar = (events) => {
    console.log("Processing events:", events);
    
    return events.map(event => {
      try {
        let startDate, endDate;
        
        if (event.start_time) {
          startDate = new Date(event.start_time);
        } else if (event.start) {
          startDate = new Date(event.start);
        } else {
          console.warn("Event missing start time:", event);
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
          console.warn("Invalid date in event:", event);
          return null;
        }
        
      
        const durationMs = endDate - startDate;
        const durationHours = Math.max(0.5, durationMs / (1000 * 60 * 60));
        const dayOfWeek = startDate.getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 

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
        
        const calendarEvent = {
          id: event.id || `event-${Math.random().toString(36).substring(2, 9)}`,
          title: title,
          description: event.description || '',
          location: event.location || '',
          category: category,
          dayOfWeek: adjustedDay < 5 ? adjustedDay : null,
          startTime: hours,
          duration: durationHours,
          date: startDate,
          rawStartDate: startDate,
          rawEndDate: endDate
        };
        
        console.log("Processed event:", calendarEvent);
        return calendarEvent;
      } catch (error) {
        console.error("Error processing event:", event, error);
        return null;
      }
    })
    .filter(event => event !== null) // Remove invalid events
    .filter(event => event.dayOfWeek !== null) // Filter out weekend events
    .sort((a, b) => a.startTime - b.startTime); // Sort by start time for better rendering
  };

  // Mock events generator function
  const generateMockEvents = () => {
    const today = new Date();
    const monday = new Date(today);
    // Set to Monday of current week
    monday.setDate(today.getDate() - today.getDay() + 1);

    const events = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Generate some events for each day
    for (let day = 0; day < 5; day++) {
      const eventsCount = 2 + Math.floor(Math.random() * 3); // 2-4 events per day

      for (let i = 0; i < eventsCount; i++) {
        const startHour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
        const startMin = Math.random() > 0.5 ? 0 : 30; // Either on the hour or half hour

        const eventDate = new Date(monday);
        eventDate.setDate(monday.getDate() + day);
        eventDate.setHours(startHour, startMin, 0, 0);

        const endDate = new Date(eventDate);
        const duration = 1 + Math.floor(Math.random() * 2); // 1-2 hours
        endDate.setHours(eventDate.getHours() + duration);

        events.push({
          id: `event-${day}-${i}`,
          title: `${days[day]} Event ${i + 1}`,
          description: `This is a mock event for ${days[day]}`,
          location: Math.random() > 0.3 ? `Room ${100 + i}` : '',
          start_time: eventDate.toISOString(),
          end_time: endDate.toISOString()
        });
      }
    }

    return events;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Check Local Storage
        const storedEvents = localStorage.getItem('calendarEvents');
        const icsUrl = localStorage.getItem('calendarIcsUrl');
        const fileName = localStorage.getItem('calendarFileName');

        let fetchedEvents = [];

        if (storedEvents) {
          try {
            const parsedEvents = JSON.parse(storedEvents);
            setStatus(`Displaying calendar file: ${fileName || 'Unknown file'}`);
            fetchedEvents = parsedEvents;
          } catch (error) {
            console.error("Error parsing stored events:", error);
            setError("Failed to parse stored calendar data.");

            // Clear the invalid data
            localStorage.removeItem('calendarEvents');

            // Fall back to mock data
            fetchedEvents = generateMockEvents();
          }
        } else if (icsUrl) {
          // If we have an ICS URL, use it to fetch events
          setStatus(`Fetching calendar from URL: ${icsUrl}`);

          try {
            // Import API service to fetch events from ICS URL
            const { getEventsFromIcsUrl } = await import('../services/api');
            fetchedEvents = await getEventsFromIcsUrl(icsUrl);

            if (!fetchedEvents || fetchedEvents.length === 0) {
              setStatus("No events found in this calendar URL. Using example data instead.");
              fetchedEvents = generateMockEvents();
            } else {
              setStatus(`Displaying ${fetchedEvents.length} events from: ${icsUrl}`);
            }
          } catch (error) {
            console.error("Failed to fetch from ICS URL:", error);
            setError(`Failed to fetch calendar data: ${error.message}`);
            fetchedEvents = generateMockEvents();
          }
        } else {
          // If no calendar input, use mock data
          setStatus("No calendar provided. Showing example data.");
          fetchedEvents = generateMockEvents();
        }

        // Transform events for calendar display
        const calendarEvents = transformEventsForCalendar(fetchedEvents);
        setEvents(calendarEvents);

      } catch (error) {
        console.error('Error loading calendar events:', error);
        setError(`Failed to load events: ${error.message}`);

        // Use mock data if there's an error
        const mockEvents = transformEventsForCalendar(generateMockEvents());
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    setTimeout(() => {
      if (container.current && containerNav.current && containerOffset.current) {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const scrollPosition = ((currentHour - 7) * 60 + currentMinute) * 1.5;
        container.current.scrollTop = scrollPosition;
      }
    }, 100);
  }, []);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentTimeRow = ((currentHour - 7) * 2) + (currentMinute >= 30 ? 3 : 2);

  return (
    <div className="mt-8 w-full max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mb-4">Your Calendar</h1>

      {status && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-2 mb-4 text-center">
          <p className="text-sm">{status}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center my-8">Loading your calendar...</div>
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div
            ref={container}
            className="flex flex-auto flex-col overflow-auto bg-white h-[600px]"
          >
            <div className="flex max-w-full flex-none flex-col">
              {/* Day of week header */}
              <div
                ref={containerNav}
                className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5"
              >
                <div className="grid grid-cols-5 text-sm font-semibold text-gray-900">
                  <div className="sticky left-0 z-10 bg-white pr-4 text-right text-gray-400" style={{ width: '3.5rem' }}></div>
                  <div className="py-3 text-center">Mon</div>
                  <div className="py-3 text-center">Tue</div>
                  <div className="py-3 text-center">Wed</div>
                  <div className="py-3 text-center">Thu</div>
                  <div className="py-3 text-center">Fri</div>
                </div>
              </div>

              <div className="flex flex-auto">
                <div className="sticky left-0 z-10 flex-none bg-white w-14 ring-1 ring-gray-200" />
                <div className="grid flex-auto grid-cols-1 grid-rows-1">
                  {/* Horizontal time lines */}
                  <div
                    className="col-start-1 col-end-2 row-start-1 grid"
                    style={{ gridTemplateRows: 'repeat(30, minmax(1.75rem, 1fr))' }}
                  >
                    <div ref={containerOffset} className="row-end-1 h-7" />

                    {/* Time slots - 7AM to 9PM */}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <React.Fragment key={i}>
                        <div className={`border-b border-gray-200 ${i * 2 + 2 === currentTimeRow ? 'bg-blue-50' : ''}`}>
                          <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-500">
                            {(i + 7) % 12 === 0 ? '12' : (i + 7) % 12}
                            {i + 7 < 12 ? 'AM' : 'PM'}
                          </div>
                        </div>
                        <div className={`border-b border-gray-100 ${i * 2 + 3 === currentTimeRow ? 'bg-blue-50' : ''}`} />
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Vertical column dividers */}
                  <div className="col-start-1 col-end-2 row-start-1 grid grid-cols-5 grid-rows-1 divide-x divide-gray-200">
                    <div className="col-start-1 row-span-full" />
                    <div className="col-start-2 row-span-full" />
                    <div className="col-start-3 row-span-full" />
                    <div className="col-start-4 row-span-full" />
                    <div className="col-start-5 row-span-full" />
                  </div>

                  {/* Calendar Events */}
                  <ol className="col-start-1 col-span-full row-start-1 grid grid-cols-5" style={{ 
                    gridTemplateRows: '1.75rem repeat(30, minmax(1.75rem, 1fr)) auto',
                    position: 'relative',
                    zIndex: 10 
                  }}>
                    {events.map((event, index) => (
                      <CalendarEvent 
                        key={`event-${index}`}
                        title={event.title}
                        startTime={event.startTime}
                        duration={event.duration}
                        location={event.location}
                        description={event.description}
                        category={event.category}
                        colStart={event.dayOfWeek + 1}
                      />
                    ))}
                    
                    {/* Current time indicator */}
                    {currentHour >= 7 && currentHour <= 21 && (
                      <div 
                        className="pointer-events-none"
                        style={{ 
                          position: 'absolute', 
                          top: `${((currentHour - 7) * 60 + currentMinute) * 0.7 + 35}px`,
                          left: '3.5rem', 
                          right: 0,
                          height: '2px',
                          backgroundColor: 'red',
                          zIndex: 30,
                          gridColumn: '1 / span 5'
                        }}
                      >
                        <div className="absolute -ml-4 -mt-2 h-4 w-4 rounded-full bg-red-600" />
                      </div>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-8">
        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Calendar;