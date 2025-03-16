import React, { useState } from 'react';
import { getEvents } from '../services/api';

function Events() {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const [startDateInput, setStartDateInput] = useState(formatDateForInput(today));
  const [endDateInput, setEndDateInput] = useState(formatDateForInput(nextWeek));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date as YYYY-MM-DDThh:mm for input
  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = new Date(startDateInput);
      const endDate = new Date(endDateInput);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError("Please enter valid dates in the format YYYY-MM-DD HH:MM");
        setLoading(false);
        return;
      }
      
      console.log("start date", startDate.toISOString());
      console.log("end date", endDate.toISOString());
      console.log("Getting fetch events");
      const fetchedEvents = await getEvents({
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString()
      });
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get a random tailwind color class for category badges
  const getCategoryColor = (category) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-red-100 text-red-800',
      'bg-cyan-100 text-cyan-800'
    ];
    
    // Generate a consistent color based on category name
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 mb-8">
      <h1 className="text-2xl font-bold text-center mb-6">Browse Events</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Events by Date</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1">
              Start Date & Time
            </label>
            <input
              id="start-date"
              type="datetime-local"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDateInput}
              onChange={(e) => setStartDateInput(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">From when to show events</p>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
            <input
              id="end-date"
              type="datetime-local"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">Until when to show events</p>
          </div>
          
          <div className="flex items-end">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-300"
              onClick={fetchEvents}
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : "Search Events"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <div key={`event-${index}`} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <h2 className="text-lg font-semibold mb-2">
                  {event.summary}
                </h2>
                
                <div className="mb-3 space-y-1 text-gray-600">
                  <p>
                    <span className="font-medium">When:</span> {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                  </p>
                  
                  {event.location && (
                    <p>
                      <span className="font-medium">Where:</span> {event.location}
                    </p>
                  )}
                  
                  {event.cost !== undefined && (
                    <p>
                      <span className="font-medium">Cost:</span> ${event.cost}
                    </p>
                  )}
                </div>
                
                {event.category && event.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.category.map((cat, idx) => (
                      <span 
                        key={idx} 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(cat)}`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                
                {event.description && (
                  <p className="text-sm text-gray-500 mt-2 mb-4">
                    {event.description}
                  </p>
                )}
                
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 text-sm font-medium rounded hover:bg-blue-50"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 my-10">
          No events found for the selected dates. Try adjusting your search criteria.
        </p>
      )}
    </div>
  );
}

export default Events;