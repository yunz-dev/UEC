import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const NavButton = styled(Button)(({ theme, active }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  fontWeight: active ? 600 : 400,
  borderBottom: active ? '2px solid white' : 'none',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottom: active ? '2px solid white' : '2px solid rgba(255, 255, 255, 0.5)',
  },
}));

function Navbar() {
  const location = useLocation();
  
  return (
    <AppBar position="static">
      <Container>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold',
              flexGrow: 1
            }}
          >
            LectureFree
          </Typography>
          
          <Box>
            <NavButton 
              component={Link} 
              to="/" 
              active={location.pathname === '/' ? 1 : 0}
            >
              Home
            </NavButton>
            
            <NavButton 
              component={Link} 
              to="/events" 
              active={location.pathname === '/events' ? 1 : 0}
            >
              Events
            </NavButton>
            
            <NavButton 
              component={Link} 
              to="/about" 
              active={location.pathname === '/about' ? 1 : 0}
            >
              About
            </NavButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
