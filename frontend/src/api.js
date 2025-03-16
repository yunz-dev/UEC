import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Fetch events from the API with optional ICS URL for clash detection
 * @param {Date} startTime - The start time for events to fetch
 * @param {Date} endTime - Optional end time for events to fetch
 * @param {string} icsUrl - Optional URL to an ICS calendar for clash detection
 * @returns {Promise<Array>} - Promise resolving to array of events
 */
export const getEvents = async (startTime, endTime = null, icsUrl = null) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Always include start_time parameter
    params.append('start_time', startTime.toISOString());
    
    // Add end_time if provided
    if (endTime) {
      params.append('end_time', endTime.toISOString());
    }
    
    // Add ICS URL if provided
    if (icsUrl) {
      params.append('ics_url', icsUrl);
    }

    // Make the API request
    const response = await axios.get(`${API_BASE_URL}/events`, { params });
    
    // Return the events data
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
