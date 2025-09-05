import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2c3e50' },
    secondary: { main: '#3498db' },
    background: { default: '#f4f7fa' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
  typography: {
    h6: { fontWeight: 700 },
  },
});
