import React from 'react'
import {
  Box, FormControl, InputLabel, Select, MenuItem,
  TextField, Typography,
} from '@mui/material'
import { Log } from '../utils/logger'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'placement', label: 'Placement' },
  { value: 'result', label: 'Result' },
  { value: 'event', label: 'Event' },
]

export default function FilterBar({ filterType, onFilterChange, topN, onTopNChange }) {
  const handleTypeChange = (e) => {
    const val = e.target.value
    Log('FilterBar.handleTypeChange', 'INFO', 'filter', `Filter changed to: ${val}`)
    onFilterChange(val)
  }

  const handleNChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) {
      Log('FilterBar.handleNChange', 'INFO', 'filter', `Top N changed to: ${val}`)
      onTopNChange(val)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Filter label */}
      <Typography
        sx={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          mr: 0.5,
        }}
      >
        Filter
      </Typography>

      {/* Type dropdown */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={filterType}
          onChange={handleTypeChange}
          displayEmpty
          sx={{
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            '& .MuiSelect-select': { py: 1 },
          }}
        >
          {TYPE_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Divider */}
      <Box sx={{ width: '1px', height: '24px', backgroundColor: 'divider', display: { xs: 'none', sm: 'block' } }} />

      {/* Top N */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
          }}
        >
          Top
        </Typography>
        <TextField
          type="number"
          value={topN}
          onChange={handleNChange}
          inputProps={{ min: 1, max: 100, style: { padding: '7px 10px', fontFamily: 'var(--font-body)', fontSize: '13px', width: '48px', textAlign: 'center' } }}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& input': { textAlign: 'center' },
            },
          }}
        />
        <Typography
          sx={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-faint)',
          }}
        >
          Priority
        </Typography>
      </Box>
    </Box>
  )
}
