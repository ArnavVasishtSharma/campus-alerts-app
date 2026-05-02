import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './pages/Home'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#111111',
      contrastText: '#f8f6f1',
    },
    secondary: {
      main: '#555555',
    },
    background: {
      default: '#f8f6f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#555555',
    },
    divider: '#d8d4cb',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 900,
    },
    h2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d8d4cb',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#111111',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#111111',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      },
    },
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  )
}