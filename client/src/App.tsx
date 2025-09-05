import React from 'react';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

export default function App() {
  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      {/* <AppBar position="sticky" elevation={1} color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AI Mail Support Assistant
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Header />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Dashboard />
      </Container>
    </Box>
  );
}
