// Simple test script for API
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API...');
    const response = await axios.get('http://localhost:8000/events', {
      params: {
        start_time: new Date().toISOString()
      }
    });
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  }
}

testAPI();