import React from 'react'
import { Box, Typography } from '@mui/material'
import { Log } from '../utils/logger'

/**
 * ErrorBanner
 * Minimal, editorial-style error message with dismiss action.
 * Renders nothing when message is falsy.
 */
export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  const handleDismiss = () => {
    Log('ErrorBanner.dismiss', 'INFO', 'ui', 'User dismissed error banner')
    onDismiss?.()
  }

  return (
    <Box
      role="alert"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2,
        border: '1px solid #c0392b',
        backgroundColor: 'rgba(192, 57, 43, 0.04)',
        animation: 'fadeUp 0.35s ease both',
      }}
    >
      {/* Icon */}
      <Typography
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          lineHeight: 1,
          mt: '1px',
          color: '#c0392b',
          flexShrink: 0,
        }}
      >
        ✕
      </Typography>

      {/* Message */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: '#c0392b',
          lineHeight: 1.55,
          flex: 1,
          fontWeight: 400,
        }}
      >
        {message}
      </Typography>

      {/* Dismiss */}
      <Box
        component="button"
        onClick={handleDismiss}
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#c0392b',
          backgroundColor: 'transparent',
          border: '1px solid rgba(192, 57, 43, 0.3)',
          padding: '4px 12px',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.18s ease',
          '&:hover': {
            backgroundColor: 'rgba(192, 57, 43, 0.08)',
            borderColor: '#c0392b',
          },
        }}
      >
        Dismiss
      </Box>
    </Box>
  )
}
