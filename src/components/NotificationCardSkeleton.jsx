import React from 'react'
import { Box } from '@mui/material'

function SkeletonLine({ width = '100%', height = 14, mb = 0 }) {
  return (
    <Box
      sx={{
        width,
        height,
        mb: `${mb}px`,
        borderRadius: '3px',
        background: 'linear-gradient(90deg, #ece9e2 25%, #d8d4cb 50%, #ece9e2 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }}
    />
  )
}

export default function NotificationCardSkeleton({ isDark = false }) {
  const bg = isDark ? 'rgba(255,255,255,0.08)' : '#ece9e2'
  const bg2 = isDark ? 'rgba(255,255,255,0.14)' : '#d8d4cb'

  return (
    <Box
      sx={{
        py: 3,
        borderBottom: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'divider',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box
          sx={{
            width: 70,
            height: 22,
            borderRadius: '11px',
            background: bg2,
          }}
        />
        <Box sx={{ width: 90, height: 12, borderRadius: '3px', background: bg }} />
      </Box>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ width: '75%', height: 18, borderRadius: '3px', background: bg2, mb: '8px' }} />
        <Box sx={{ width: '45%', height: 18, borderRadius: '3px', background: bg2 }} />
      </Box>
      <Box sx={{ width: '90%', height: 13, borderRadius: '3px', background: bg, mb: '6px' }} />
      <Box sx={{ width: '60%', height: 13, borderRadius: '3px', background: bg }} />
    </Box>
  )
}
