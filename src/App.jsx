import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './pages/Home'
import Register from './pages/Register'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#111111', contrastText: '#f8f6f1' },
    secondary: { main: '#555555' },
    background: { default: '#f8f6f1', paper: '#ffffff' },
    text: { primary: '#111111', secondary: '#555555' },
    divider: '#d8d4cb',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 },
    h2: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
    h3: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
    h4: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
    h5: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
    h6: { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 } } },
    MuiSelect: { styleOverrides: { root: { fontFamily: "'DM Sans', sans-serif" } } },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: "'DM Sans', sans-serif" } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d4cb' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#111111' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#111111', borderWidth: '1px' },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' },
      },
    },
  },
})

export default function App() {
  // Simple client-side routing without react-router
  const path = window.location.pathname

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {path === '/register' ? <Register /> : <Home />}
    </ThemeProvider>
  )
}
