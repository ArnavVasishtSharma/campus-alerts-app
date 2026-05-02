import React, { useState, useEffect, useCallback } from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import { fetchNotifications, fetchAllNotifications } from '../api/notifications'
import { getTopPriorityNotifications } from '../utils/priority'
import { Log } from '../utils/logger'
import NotificationCard from '../components/NotificationCard'
import NotificationCardSkeleton from '../components/NotificationCardSkeleton'
import FilterBar from '../components/FilterBar'
import PaginationBar from '../components/PaginationBar'
import ErrorBanner from '../components/ErrorBanner'

export default function Home() {
  // All notifications state
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  // Priority notifications state
  const [priorityNotifs, setPriorityNotifs] = useState([])
  const [priorityLoading, setPriorityLoading] = useState(true)

  // Controls
  const [filterType, setFilterType] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [topN, setTopN] = useState(10)

  const totalPages = Math.max(1, Math.ceil(total / limit))

  // Fetch paginated / filtered notifications
  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    Log('Home.loadNotifications', 'INFO', 'page', `Loading: page=${page}, limit=${limit}, type=${filterType}`)
    try {
      const data = await fetchNotifications({ page, limit, type: filterType })
      // Support both { notifications: [...] } and { data: [...] } shapes
      const items = data?.notifications ?? data?.data ?? (Array.isArray(data) ? data : [])
      setNotifications(items)
      setTotal(data?.total ?? data?.count ?? items.length)
    } catch (err) {
      setError(err.message || 'Failed to load notifications. Check your network or token.')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [page, limit, filterType])

  // Fetch all notifications for priority panel (unfiltered, unpaginated)
  const loadPriorityNotifications = useCallback(async () => {
    setPriorityLoading(true)
    Log('Home.loadPriorityNotifications', 'INFO', 'page', `Loading priority top ${topN}`)
    try {
      const all = await fetchAllNotifications()
      setPriorityNotifs(getTopPriorityNotifications(all, topN))
    } catch (err) {
      Log('Home.loadPriorityNotifications', 'ERROR', 'page', `Failed: ${err.message}`)
      setPriorityNotifs([])
    } finally {
      setPriorityLoading(false)
    }
  }, [topN])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    loadPriorityNotifications()
  }, [loadPriorityNotifications])

  const handleFilterChange = (val) => {
    setFilterType(val)
    setPage(1)
  }

  const handleLimitChange = (val) => {
    setLimit(val)
    setPage(1)
  }

  const handleTopNChange = (val) => {
    setTopN(val)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--paper)' }}>

      {/* ── Header ── */}
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--border)',
          py: { xs: 3, md: 4 },
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--paper)',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
                  color: 'var(--ink)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Campus <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Notifications</em>
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  mt: 0.5,
                  fontWeight: 300,
                }}
              >
                Priority-sorted · Real-time
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1a6b3c', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-faint)', letterSpacing: '0.06em' }}>
                Live
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Main Layout ── */}
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 0, md: 5 }}>

          {/* ── LEFT: All Notifications ── */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Section header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  mb: 0,
                  pb: 2,
                  borderBottom: '2px solid var(--ink)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    color: 'var(--ink)',
                  }}
                >
                  All Notifications
                </Typography>
                {!loading && (
                  <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-faint)' }}>
                    {total} entries
                  </Typography>
                )}
              </Box>

              {/* Filter bar */}
              <FilterBar
                filterType={filterType}
                onFilterChange={handleFilterChange}
                topN={topN}
                onTopNChange={handleTopNChange}
              />

              {/* Error */}
              <Box sx={{ mt: 2 }}>
                <ErrorBanner message={error} onDismiss={() => setError(null)} />
              </Box>

              {/* Cards */}
              <Box>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <NotificationCardSkeleton key={i} />)
                  : notifications.length === 0
                    ? (
                      <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-display)',
                            fontStyle: 'italic',
                            fontSize: '1.1rem',
                            color: 'var(--ink-faint)',
                          }}
                        >
                          No notifications found.
                        </Typography>
                      </Box>
                    )
                    : notifications.map((n, i) => (
                      <NotificationCard key={n.id ?? i} notification={n} index={i} />
                    ))
                }
              </Box>

              {/* Pagination */}
              {!loading && notifications.length > 0 && (
                <PaginationBar
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  limit={limit}
                  onLimitChange={handleLimitChange}
                  total={total}
                />
              )}
            </Box>
          </Grid>

          {/* ── DIVIDER (desktop) ── */}
          <Grid item md={0.1} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ width: '1px', height: '100%', backgroundColor: 'var(--border)', mx: 'auto' }} />
          </Grid>

          {/* ── RIGHT: Priority Notifications ── */}
          <Grid item xs={12} md={4.9}>
            <Box
              sx={{
                mt: { xs: 5, md: 0 },
              }}
            >
              {/* Section header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  pb: 2,
                  borderBottom: '2px solid var(--ink)',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    color: 'var(--ink)',
                  }}
                >
                  Priority
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-faint)' }}>
                  Top {topN}
                </Typography>
              </Box>

              {/* Priority panel — black card */}
              <Box
                sx={{
                  mt: 2.5,
                  backgroundColor: 'var(--ink)',
                  p: { xs: 2.5, md: 3 },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    transform: 'translate(40px, -40px)',
                  },
                }}
              >
                {/* Priority label inside panel */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'rgba(248,246,241,0.5)',
                      fontWeight: 500,
                    }}
                  >
                    Placement &rarr; Result &rarr; Event
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f8f6f1', opacity: 0.6 }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f8f6f1', opacity: 0.35 }} />
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f8f6f1', opacity: 0.15 }} />
                  </Box>
                </Box>

                {/* Priority cards */}
                {priorityLoading
                  ? Array.from({ length: 4 }).map((_, i) => <NotificationCardSkeleton key={i} isDark />)
                  : priorityNotifs.length === 0
                    ? (
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          color: 'rgba(248,246,241,0.5)',
                          fontSize: '0.95rem',
                          py: 3,
                          textAlign: 'center',
                        }}
                      >
                        No priority notifications.
                      </Typography>
                    )
                    : priorityNotifs.map((n, i) => (
                      <NotificationCard key={n.id ?? i} notification={n} isPriority index={i} />
                    ))
                }
              </Box>

              {/* Legend */}
              <Box sx={{ mt: 2, display: 'flex', gap: 2.5, px: 0.5 }}>
                {[
                  { label: 'Placement', rank: '#1' },
                  { label: 'Result', rank: '#2' },
                  { label: 'Event', rank: '#3' },
                ].map(({ label, rank }) => (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--ink-faint)', letterSpacing: '0.04em' }}>
                      {rank}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink)', fontWeight: 500, letterSpacing: '0.05em' }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── Footer ── */}
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid var(--border)',
          py: 3,
          mt: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'var(--ink-faint)',
              }}
            >
              Campus Notifications
            </Typography>
            <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-faint)', letterSpacing: '0.06em' }}>
              {new Date().getFullYear()} · All rights reserved
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}