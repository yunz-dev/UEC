import axios from 'axios';

const API_URL = 'https://uec-hb09.onrender.com';


/**
 * Get events directly from an ICS URL
 * @param {string} icsUrl - URL of the ICS calendar
 * @returns {Promise<Array>} List of events from the ICS calendar
 */
export const getEventsFromIcsUrl = async (icsUrl) => {
  try {
    const response = await axios.get(`${API_URL}/events`, { 
      params: { 
        start_time: new Date().toISOString(), // Required parameter
        ics_url: icsUrl
      } 
    });
    
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events from ICS URL:', error);
    throw error;
  }
};