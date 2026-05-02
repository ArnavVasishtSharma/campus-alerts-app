import React from 'react'
import { Box } from '@mui/material'

/**
 * NotificationCardSkeleton
 * Shimmer loading placeholder that mirrors NotificationCard layout.
 * Supports dark variant for the priority panel.
 */
export default function NotificationCardSkeleton({ isDark = false }) {
  const base = isDark ? 'rgba(248,246,241,0.08)' : 'var(--border-light)'
  const shimmer = isDark ? 'rgba(248,246,241,0.14)' : 'var(--border)'

  const skeletonBar = (width, height = 14) => ({
    width,
    height,
    borderRadius: '4px',
    background: `linear-gradient(90deg, ${base} 25%, ${shimmer} 50%, ${base} 75%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  })

  return (
    <Box
      sx={{
        py: 3,
        borderBottom: '1px solid',
        borderColor: isDark ? 'rgba(248,246,241,0.08)' : 'divider',
        animation: 'fadeUp 0.3s ease both',
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }}
    >
      {/* Row 1: chip + date */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={skeletonBar('72px', 22)} />
        <Box sx={skeletonBar('90px', 12)} />
      </Box>

      {/* Row 2: title */}
      <Box sx={{ ...skeletonBar('65%', 18), mb: 1 }} />

      {/* Row 3: description line 1 */}
      <Box sx={{ ...skeletonBar('90%', 13), mb: 0.6 }} />

      {/* Row 4: description line 2 */}
      <Box sx={skeletonBar('60%', 13)} />
    </Box>
  )
}
