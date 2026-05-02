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

const TYPE_STATS = {
  placement: { color: 'var(--placement)', bg: 'var(--placement-bg)', label: 'Placements' },
  result:    { color: 'var(--result)',    bg: 'var(--result-bg)',    label: 'Results'    },
  event:     { color: 'var(--event)',     bg: 'var(--event-bg)',     label: 'Events'     },
}

export default function Home() {
  const [notifications, setNotifications]       = useState([])
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState(null)
  const [total, setTotal]                       = useState(0)
  const [priorityNotifs, setPriorityNotifs]     = useState([])
  const [priorityLoading, setPriorityLoading]   = useState(true)
  const [filterType, setFilterType]             = useState('all')
  const [page, setPage]                         = useState(1)
  const [limit, setLimit]                       = useState(10)
  const [topN, setTopN]                         = useState(10)
  const [allForStats, setAllForStats]           = useState([])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const loadNotifications = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await fetchNotifications({ page, limit, type: filterType })
      setNotifications(data.notifications)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [page, limit, filterType])

  const loadPriorityAndStats = useCallback(async () => {
    setPriorityLoading(true)
    try {
      const all = await fetchAllNotifications()
      setAllForStats(all)
      setPriorityNotifs(getTopPriorityNotifications(all, topN))
    } catch (err) {
      Log('Home', 'ERROR', 'page', err.message)
      setPriorityNotifs([])
    } finally {
      setPriorityLoading(false)
    }
  }, [topN])

  useEffect(() => { loadNotifications() },     [loadNotifications])
  useEffect(() => { loadPriorityAndStats() },  [loadPriorityAndStats])

  // Compute counts per type
  const typeCounts = allForStats.reduce((acc, n) => {
    const t = (n.type || '').toLowerCase()
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  const handleFilterChange = (val) => { setFilterType(val); setPage(1) }
  const handleLimitChange  = (val) => { setLimit(val); setPage(1) }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>

      {/* ── HEADER ── */}
      <Box
        component="header"
        sx={{
          background: 'linear-gradient(135deg, #0f1117 0%, #1c2033 60%, #2a1f3d 100%)',
          pt: { xs: 4, md: 5 },
          pb: { xs: 5, md: 6 },
          px: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position:'absolute', top:-60, right:-60, width:240, height:240, borderRadius:'50%', background:'rgba(232,98,42,0.12)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', bottom:-80, left:'30%', width:300, height:300, borderRadius:'50%', background:'rgba(107,72,200,0.08)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', top:'20%', left:-40, width:180, height:180, borderRadius:'50%', background:'rgba(14,124,107,0.1)', pointerEvents:'none' }} />

        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 5 }, position:'relative', zIndex:1 }}>
          {/* Top bar */}
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb: 4 }}>
            <Box sx={{ display:'flex', alignItems:'center', gap: 1.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, #e8622a, #f59a6b)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow: '0 4px 12px rgba(232,98,42,0.4)',
              }}>
                <Typography sx={{ fontSize:18, lineHeight:1 }}>🔔</Typography>
              </Box>
              <Typography sx={{ fontFamily:'var(--font-body)', fontWeight:700, fontSize:'13px', color:'rgba(255,255,255,0.5)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
                Campus Hub
              </Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
              <Box sx={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#4ade80', animation:'pulse 2s infinite', '@keyframes pulse':{ '0%,100%':{opacity:1,transform:'scale(1)'},'50%':{opacity:0.6,transform:'scale(0.8)'} } }} />
              <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'rgba(255,255,255,0.4)', letterSpacing:'0.08em' }}>
                Live Feed
              </Typography>
            </Box>
          </Box>

          {/* Hero title */}
          <Typography variant="h1" sx={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: { xs:'2.2rem', sm:'3rem', md:'3.8rem' },
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            mb: 1.5,
          }}>
            Stay in the{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #e8622a, #f5a05a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontStyle: 'italic',
            }}>
              Loop.
            </Box>
          </Typography>
          <Typography sx={{
            fontFamily: 'var(--font-body)',
            color: 'rgba(255,255,255,0.45)',
            fontSize: { xs:'13px', md:'15px' },
            fontWeight: 300,
            mb: 5,
            letterSpacing: '0.01em',
          }}>
            Placements · Results · Events — sorted by what matters most.
          </Typography>

          {/* Stat pills */}
          <Box sx={{ display:'flex', gap: 2, flexWrap:'wrap' }}>
            {Object.entries(TYPE_STATS).map(([type, s]) => (
              <Box key={type} sx={{
                display:'flex', alignItems:'center', gap:1.25,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '50px',
                px: 2, py: 0.85,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor:'rgba(255,255,255,0.12)', transform:'translateY(-1px)' },
              }}
              onClick={() => { handleFilterChange(type); Log('Home.statPill','INFO','ui',`Clicked ${type} pill`) }}
              >
                <Box sx={{ width:8, height:8, borderRadius:'50%', backgroundColor: s.color, boxShadow:`0 0 6px ${s.color}` }} />
                <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.75)', letterSpacing:'0.04em' }}>
                  {typeCounts[type] ?? '—'} {s.label}
                </Typography>
              </Box>
            ))}
            {allForStats.length > 0 && (
              <Box sx={{
                display:'flex', alignItems:'center', gap:1.25,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '50px',
                px: 2, py: 0.85,
              }}>
                <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.4)', letterSpacing:'0.04em' }}>
                  {allForStats.length} Total
                </Typography>
              </Box>
            )}
          </Box>
        </Container>

        {/* Bottom wave */}
        <Box sx={{ position:'absolute', bottom:0, left:0, right:0, height:'24px', overflow:'hidden' }}>
          <svg viewBox="0 0 1440 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
            <path d="M0,24 C360,0 1080,0 1440,24 L1440,24 L0,24 Z" fill="#f5f3ee"/>
          </svg>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>

          {/* ── LEFT: All Notifications ── */}
          <Grid item xs={12} md={7}>
            <Box sx={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              {/* Section header */}
              <Box sx={{
                px: 3, pt: 3, pb: 0,
                borderBottom: '1px solid var(--border)',
              }}>
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb: 2.5 }}>
                  <Box sx={{ display:'flex', alignItems:'center', gap: 1.5 }}>
                    <Typography variant="h5" sx={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: { xs:'1.15rem', md:'1.3rem' },
                      color: 'var(--ink)',
                    }}>
                      All Notifications
                    </Typography>
                    {!loading && total > 0 && (
                      <Box sx={{
                        backgroundColor: 'var(--placement-bg)',
                        border: '1px solid var(--placement-border)',
                        borderRadius: '20px',
                        px: 1.25, py: 0.25,
                      }}>
                        <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, color:'var(--placement)' }}>
                          {total} entries
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <FilterBar filterType={filterType} onFilterChange={handleFilterChange} topN={topN} onTopNChange={setTopN} />
              </Box>

              {/* Error */}
              {error && (
                <Box sx={{ px:3, pt:2 }}>
                  <ErrorBanner message={error} onDismiss={() => setError(null)} />
                </Box>
              )}

              {/* Cards */}
              <Box sx={{ px: 3 }}>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <NotificationCardSkeleton key={i} />)
                  : notifications.length === 0
                    ? (
                      <Box sx={{ py:10, textAlign:'center' }}>
                        <Typography sx={{ fontSize:'2.5rem', mb:1.5 }}>📭</Typography>
                        <Typography sx={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1.1rem', color:'var(--ink-light)' }}>
                          Nothing here yet.
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
                <Box sx={{ px:3 }}>
                  <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} limit={limit} onLimitChange={handleLimitChange} total={total} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* ── RIGHT: Priority ── */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: { md:'sticky' }, top: { md:'24px' } }}>

              {/* Priority card */}
              <Box sx={{
                background: 'linear-gradient(145deg, #0f1117 0%, #1c2033 50%, #2a1f3d 100%)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(15,17,23,0.25)',
                position: 'relative',
              }}>
                {/* Decorative blobs */}
                <Box sx={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(232,98,42,0.15)', filter:'blur(30px)', pointerEvents:'none' }} />
                <Box sx={{ position:'absolute', bottom:-20, left:-20, width:100, height:100, borderRadius:'50%', background:'rgba(107,72,200,0.2)', filter:'blur(25px)', pointerEvents:'none' }} />

                {/* Header */}
                <Box sx={{ px:3, pt:3, pb:2.5, borderBottom:'1px solid rgba(255,255,255,0.08)', position:'relative', zIndex:1 }}>
                  <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:0.5 }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                      <Box sx={{
                        width:32, height:32, borderRadius:'8px',
                        background:'linear-gradient(135deg,#e8622a,#f5a05a)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 4px 12px rgba(232,98,42,0.5)',
                        fontSize:'16px',
                      }}>🏆</Box>
                      <Typography variant="h5" sx={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#ffffff', fontSize:'1.2rem' }}>
                        Priority Feed
                      </Typography>
                    </Box>
                    <Box sx={{
                      backgroundColor:'rgba(232,98,42,0.2)',
                      border:'1px solid rgba(232,98,42,0.4)',
                      borderRadius:'20px', px:1.25, py:0.3,
                    }}>
                      <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, color:'#f5a05a' }}>
                        Top {topN}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Priority order legend */}
                  <Box sx={{ display:'flex', alignItems:'center', gap:1, mt:1.5 }}>
                    {[{label:'Placement',c:'#e8622a'},{label:'Result',c:'#0e7c6b'},{label:'Event',c:'#6b48c8'}].map((t,i)=>(
                      <React.Fragment key={t.label}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                          <Box sx={{ width:6, height:6, borderRadius:'50%', backgroundColor:t.c, boxShadow:`0 0 4px ${t.c}` }} />
                          <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{t.label}</Typography>
                        </Box>
                        {i < 2 && <Typography sx={{ color:'rgba(255,255,255,0.2)', fontSize:'12px' }}>›</Typography>}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>

                {/* Priority cards */}
                <Box sx={{ px:3, pb:3, position:'relative', zIndex:1 }}>
                  {priorityLoading
                    ? Array.from({ length: 4 }).map((_, i) => <NotificationCardSkeleton key={i} isDark />)
                    : priorityNotifs.length === 0
                      ? (
                        <Box sx={{ py:6, textAlign:'center' }}>
                          <Typography sx={{ fontFamily:'var(--font-display)', fontStyle:'italic', color:'rgba(255,255,255,0.3)', fontSize:'1rem' }}>
                            No priority notifications.
                          </Typography>
                        </Box>
                      )
                      : priorityNotifs.map((n, i) => (
                          <NotificationCard key={n.id ?? i} notification={n} isPriority index={i} rank={i+1} />
                        ))
                  }
                </Box>
              </Box>

              {/* Quick stats below priority */}
              <Box sx={{ mt:3, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2 }}>
                {Object.entries(TYPE_STATS).map(([type, s]) => (
                  <Box key={type} sx={{
                    backgroundColor:'var(--bg-card)',
                    border:`1px solid ${s.color}22`,
                    borderTop:`3px solid ${s.color}`,
                    borderRadius:'12px',
                    p:2,
                    textAlign:'center',
                    boxShadow:'var(--shadow-sm)',
                    transition:'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover':{ transform:'translateY(-2px)', boxShadow:'var(--shadow-md)' },
                  }}>
                    <Typography sx={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.6rem', color:s.color, lineHeight:1 }}>
                      {typeCounts[type] ?? 0}
                    </Typography>
                    <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, color:'var(--ink-light)', textTransform:'uppercase', letterSpacing:'0.08em', mt:0.5 }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── FOOTER ── */}
      <Box component="footer" sx={{ mt:8, borderTop:'1px solid var(--border)', py:4, backgroundColor:'var(--bg-card)' }}>
        <Container maxWidth="xl" sx={{ px:{ xs:3, md:5 } }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:2 }}>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
              <Box sx={{ width:28, height:28, borderRadius:'8px', background:'linear-gradient(135deg,#e8622a,#f59a6b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🔔</Box>
              <Typography sx={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1rem', color:'var(--ink)' }}>
                Campus Notifications
              </Typography>
            </Box>
            <Typography sx={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--ink-faint)' }}>
              {new Date().getFullYear()} · Affordmed Evaluation
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}