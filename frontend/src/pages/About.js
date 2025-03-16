import React from 'react';
import { Typography, Box, Container, Button, Paper, Grid, Link as MuiLink, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';

function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          LectureFree
        </Typography>
        
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" paragraph>
            The app helps students at UTS find campus events that they can attend in between their classes.
          </Typography>
          
          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
            Developers
          </Typography>
          
          <List>
            <ListItem 
              component={MuiLink} 
              href="https://github.com/yunz-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="yunz-dev" />
              <GitHubIcon sx={{ ml: 1, fontSize: 20 }} />
            </ListItem>
            
            <ListItem 
              component={MuiLink} 
              href="https://github.com/MonkieeBoi" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="MonkieeBoi" />
              <GitHubIcon sx={{ ml: 1, fontSize: 20 }} />
            </ListItem>
            
            <ListItem 
              component={MuiLink} 
              href="https://github.com/Bageutter" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Bageutter" />
              <GitHubIcon sx={{ ml: 1, fontSize: 20 }} />
            </ListItem>
            
            <ListItem 
              component={MuiLink} 
              href="https://github.com/0melette" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="amy z" />
              <GitHubIcon sx={{ ml: 1, fontSize: 20 }} />
            </ListItem>
          </List>

          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
            Project Links
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<CodeIcon />}
                component={MuiLink}
                href="https://devpost.com/software/university-event-calendar"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ py: 1.5 }}
              >
                View on Devpost
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button 
                variant="contained" 
                color="inherit"
                fullWidth
                startIcon={<GitHubIcon />}
                component={MuiLink}
                href="https://github.com/yunz-dev/UEC"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ py: 1.5, bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } }}
              >
                View on GitHub
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 6 }}>
          Made with 🥒
        </Typography>
      </Box>
    </Container>
  );
}

export default About;
