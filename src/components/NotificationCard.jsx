import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { getTypeStyle, formatDate } from '../utils/priority'
import { Log } from '../utils/logger'

export default function NotificationCard({ notification, isPriority = false, index = 0 }) {
  const { type, title, message, description, timestamp, created_at, id } = notification
  const style = getTypeStyle(type)
  const dateStr = formatDate(timestamp || created_at)

  const handleClick = () => {
    Log('NotificationCard.onClick', 'INFO', 'ui', `User clicked notification #${id || index}`, { type, title })
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 3,
        px: isPriority ? 0 : 0,
        cursor: 'default',
        transition: 'background 0.18s ease',
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover': {
          backgroundColor: isPriority ? 'rgba(248,246,241,0.06)' : 'rgba(0,0,0,0.015)',
        },
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* Top row: type chip + date */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1 }}>
        <Chip
          label={style.label}
          size="small"
          sx={{
            backgroundColor: isPriority ? 'rgba(248,246,241,0.15)' : style.color,
            color: isPriority ? '#f8f6f1' : style.textColor,
            border: isPriority ? '1px solid rgba(248,246,241,0.3)' : 'none',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '0.1em',
            height: '22px',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'var(--font-body)',
            color: isPriority ? 'rgba(248,246,241,0.55)' : 'var(--ink-faint)',
            fontSize: '11px',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {dateStr}
        </Typography>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: { xs: '1rem', sm: '1.1rem' },
          color: isPriority ? '#f8f6f1' : 'var(--ink)',
          lineHeight: 1.3,
          mb: 0.75,
        }}
      >
        {title || 'Untitled Notification'}
      </Typography>

      {/* Message / Description */}
      {(message || description) && (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'var(--font-body)',
            color: isPriority ? 'rgba(248,246,241,0.7)' : 'var(--ink-light)',
            fontSize: '13.5px',
            lineHeight: 1.65,
            fontWeight: 300,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {message || description}
        </Typography>
      )}

      {/* Priority badge for priority section */}
      {isPriority && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            width: '2px',
            height: '60%',
            backgroundColor: 'rgba(248,246,241,0.25)',
            borderRadius: '1px',
          }}
        />
      )}
    </Box>
  )
}
