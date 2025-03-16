import axios from 'axios';

const API_URL = 'https://uec-hb09.onrender.com';

/**
 * Get events from the backend
 * @param {Object} params - Query parameters
 * @param {Date} params.start_time - Start time to filter events
 * @param {Date} params.end_time - End time to filter events
 * @param {string} params.end_time - End time to filter events
 * @returns {Promise<Array>} List of events
 */
export const getEvents = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/events`, { params });
    return response.data.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Upload an ICS file to process
 * @param {File} file - The ICS file to upload
 * @returns {Promise<Object>} Processed calendar data with events
 */
export const uploadICSFile = async (file) => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/upload-ics`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading ICS file:', error);
    throw error;
  }
};

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