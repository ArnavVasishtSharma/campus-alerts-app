import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Log } from '../utils/logger'

export default function PaginationBar({ page, totalPages, onPageChange, limit, onLimitChange, total }) {
  const handlePrev = () => {
    if (page > 1) {
      Log('PaginationBar.prev', 'INFO', 'ui', `Navigate to page ${page - 1}`)
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      Log('PaginationBar.next', 'INFO', 'ui', `Navigate to page ${page + 1}`)
      onPageChange(page + 1)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {/* Total count */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--ink-faint)',
          letterSpacing: '0.04em',
        }}
      >
        {total != null ? `${total} total` : ''}
      </Typography>

      {/* Page controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={handlePrev}
          disabled={page <= 1}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: page <= 1 ? 'var(--border-light)' : 'var(--border)',
            borderRadius: '2px',
            color: page <= 1 ? 'var(--ink-faint)' : 'var(--ink)',
            width: 32,
            height: 32,
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--ink)',
            minWidth: '80px',
            textAlign: 'center',
          }}
        >
          {page} / {totalPages || 1}
        </Typography>

        <IconButton
          onClick={handleNext}
          disabled={page >= totalPages}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: page >= totalPages ? 'var(--border-light)' : 'var(--border)',
            borderRadius: '2px',
            color: page >= totalPages ? 'var(--ink-faint)' : 'var(--ink)',
            width: 32,
            height: 32,
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Per page */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-faint)' }}>
          Per page:
        </Typography>
        {[5, 10, 20].map((n) => (
          <Box
            key={n}
            onClick={() => {
              Log('PaginationBar.limitChange', 'INFO', 'ui', `Limit changed to ${n}`)
              onLimitChange(n)
            }}
            sx={{
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: n === limit ? 700 : 400,
              color: n === limit ? 'var(--ink)' : 'var(--ink-faint)',
              borderBottom: n === limit ? '1.5px solid var(--ink)' : '1.5px solid transparent',
              px: 0.5,
              pb: '1px',
              transition: 'all 0.15s ease',
              '&:hover': { color: 'var(--ink)' },
            }}
          >
            {n}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
