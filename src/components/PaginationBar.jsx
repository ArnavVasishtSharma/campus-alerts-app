import React from 'react'
import { Box, Typography } from '@mui/material'
import { Log } from '../utils/logger'

const LIMIT_OPTIONS = [5, 10, 20, 50]

/**
 * PaginationBar
 * Minimal editorial-style pagination with prev/next,
 * page indicator, and per-page limit selector.
 */
export default function PaginationBar({ page, totalPages, onPageChange, limit, onLimitChange, total }) {

  const handlePrev = () => {
    if (page > 1) {
      Log('PaginationBar', 'INFO', 'pagination', `Page back to ${page - 1}`)
      onPageChange(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      Log('PaginationBar', 'INFO', 'pagination', `Page forward to ${page + 1}`)
      onPageChange(page + 1)
    }
  }

  const handleLimit = (val) => {
    Log('PaginationBar', 'INFO', 'pagination', `Limit changed to ${val}`)
    onLimitChange(val)
  }

  const btnStyle = (disabled) => ({
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: disabled ? 'var(--border)' : 'var(--ink)',
    backgroundColor: 'transparent',
    border: `1px solid ${disabled ? 'var(--border-light)' : 'var(--border)'}`,
    padding: '6px 16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.18s ease',
    '&:hover': disabled ? {} : {
      backgroundColor: 'var(--ink)',
      color: 'var(--paper)',
      borderColor: 'var(--ink)',
    },
  })

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        pt: 3,
        mt: 1,
        borderTop: '1px solid var(--border-light)',
      }}
    >
      {/* Left: per-page selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
            fontWeight: 500,
          }}
        >
          Show
        </Typography>
        {LIMIT_OPTIONS.map((val) => (
          <Box
            key={val}
            component="button"
            onClick={() => handleLimit(val)}
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: limit === val ? 600 : 400,
              color: limit === val ? 'var(--paper)' : 'var(--ink-faint)',
              backgroundColor: limit === val ? 'var(--ink)' : 'transparent',
              border: limit === val ? '1px solid var(--ink)' : '1px solid var(--border)',
              padding: '3px 10px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              '&:hover': {
                borderColor: 'var(--ink)',
                color: limit === val ? 'var(--paper)' : 'var(--ink)',
              },
            }}
          >
            {val}
          </Box>
        ))}
      </Box>

      {/* Center: page indicator */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'var(--ink-light)',
          fontWeight: 400,
          letterSpacing: '0.02em',
        }}
      >
        {page} <span style={{ color: 'var(--ink-faint)' }}>/</span> {totalPages}
        <span style={{ color: 'var(--ink-faint)', marginLeft: 8, fontSize: '11px' }}>
          ({total} total)
        </span>
      </Typography>

      {/* Right: prev / next */}
      <Box sx={{ display: 'flex', gap: 0.75 }}>
        <Box
          component="button"
          onClick={handlePrev}
          disabled={page <= 1}
          sx={btnStyle(page <= 1)}
        >
          ← Prev
        </Box>
        <Box
          component="button"
          onClick={handleNext}
          disabled={page >= totalPages}
          sx={btnStyle(page >= totalPages)}
        >
          Next →
        </Box>
      </Box>
    </Box>
  )
}
