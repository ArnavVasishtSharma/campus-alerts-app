import React from 'react'
import { Box, Typography } from '@mui/material'
import { Log } from '../utils/logger'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Placement', label: 'Placement' },
  { value: 'Result', label: 'Result' },
  { value: 'Event', label: 'Event' },
]

/**
 * FilterBar
 * Horizontal row of pill-style type filters + Top-N input.
 * Matches the editorial / typographic design system.
 */
export default function FilterBar({ filterType, onFilterChange, topN, onTopNChange }) {

  const handleFilter = (val) => {
    Log('FilterBar.handleFilter', 'INFO', 'filter', `Filter changed to "${val}"`)
    onFilterChange(val)
  }

  const handleTopN = (e) => {
    const n = Math.max(1, Math.min(100, Number(e.target.value) || 1))
    Log('FilterBar.handleTopN', 'INFO', 'filter', `Top-N changed to ${n}`)
    onTopNChange(n)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        py: 2,
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      {/* ── Type pills ── */}
      <Box sx={{ display: 'flex', gap: 0.75 }}>
        {FILTER_OPTIONS.map(({ value, label }) => {
          const isActive = filterType === value
          return (
            <Box
              key={value}
              onClick={() => handleFilter(value)}
              sx={{
                px: 2,
                py: 0.6,
                fontSize: '11px',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--paper)' : 'var(--ink-faint)',
                backgroundColor: isActive ? 'var(--ink)' : 'transparent',
                border: isActive ? '1px solid var(--ink)' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                userSelect: 'none',
                '&:hover': {
                  color: isActive ? 'var(--paper)' : 'var(--ink)',
                  borderColor: 'var(--ink)',
                },
              }}
            >
              {label}
            </Box>
          )
        })}
      </Box>

      {/* ── Top N control ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          Top
        </Typography>
        <Box
          component="input"
          type="number"
          min={1}
          max={100}
          value={topN}
          onChange={handleTopN}
          sx={{
            width: '48px',
            padding: '4px 8px',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--ink)',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            '&:focus': {
              borderColor: 'var(--ink)',
            },
            /* Hide number spinners */
            '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            MozAppearance: 'textfield',
          }}
        />
      </Box>
    </Box>
  )
}
