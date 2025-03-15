# UEC Events Frontend

This is the frontend application for UEC Events, built with React. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

1. Make sure you have Node.js and npm installed
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
   This will run the app in development mode at [http://localhost:3000](http://localhost:3000)

## Features

- View upcoming events on the home page
- Browse all events in the Calendar page
- Search and filter events by category
- Responsive design that works on mobile and desktop

## Backend Connection

The frontend connects to the backend API at `http://localhost:8000`. Make sure the backend server is running when developing the frontend.

You can modify the API URL in `src/services/api.js` if your backend is running on a different port or host.

## Available Scripts

- `npm start`: Runs the app in development mode. The page will reload when you make changes.
- `npm test`: Launches the test runner in the interactive watch mode.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm run eject`: **Note: this is a one-way operation. Once you `eject`, you can't go back!** Ejects the app from Create React App.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
