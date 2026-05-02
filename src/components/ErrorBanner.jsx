import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2,
        border: '1px solid #111111',
        borderLeft: '3px solid #111111',
        backgroundColor: 'rgba(0,0,0,0.03)',
        mb: 3,
        animation: 'slideIn 0.3s ease',
        '@keyframes slideIn': {
          from: { opacity: 0, transform: 'translateX(-8px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <WarningAmberIcon sx={{ fontSize: 18, mt: '1px', flexShrink: 0, color: 'var(--ink)' }} />
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--ink)',
          flex: 1,
          lineHeight: 1.6,
        }}
      >
        {message}
      </Typography>
      {onDismiss && (
        <IconButton
          size="small"
          onClick={onDismiss}
          sx={{ color: 'var(--ink-faint)', p: 0.25, mt: '-2px', flexShrink: 0 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}
