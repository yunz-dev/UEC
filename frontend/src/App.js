import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsList from './pages/EventsList';
import Navbar from './components/Navbar';
import About from './pages/About';
import './index.css';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;