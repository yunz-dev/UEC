import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsList from './pages/EventsList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<EventsList />} />
      </Routes>
    </Router>
  );
}

export default App;