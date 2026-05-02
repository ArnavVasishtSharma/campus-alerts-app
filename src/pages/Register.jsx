import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material'
import { register } from '../api/notifications'
import { Log } from '../utils/logger'

/**
 * One-time registration page.
 * Visit /register in dev to get your clientID + clientSecret.
 * SAVE the response — you can only register once!
 */
export default function Register() {
  const [form, setForm] = useState({
    email: '', name: '', mobileNo: '', githubUsername: '', rollNo: '',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    Log('Register.handleSubmit', 'INFO', 'ui', 'Submitting registration', form)
    try {
      const data = await register(form)
      setResult(data)
      Log('Register.handleSubmit', 'INFO', 'api', 'Registration successful', data)
    } catch (err) {
      setError(err.message)
      Log('Register.handleSubmit', 'ERROR', 'api', err.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'email', label: 'College Email' },
    { name: 'name', label: 'Full Name' },
    { name: 'mobileNo', label: 'Mobile Number' },
    { name: 'githubUsername', label: 'GitHub Username' },
    { name: 'rollNo', label: 'Roll Number' },
  ]

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, px: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 900, mb: 1 }}>
        Register
      </Typography>
      <Typography sx={{ color: 'var(--ink-faint)', fontSize: '13px', mb: 4 }}>
        One-time registration. Save your <strong>clientID</strong> and <strong>clientSecret</strong> — you cannot retrieve them again.
      </Typography>

      {fields.map((f) => (
        <TextField
          key={f.name}
          fullWidth
          size="small"
          label={f.label}
          name={f.name}
          value={form[f.name]}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      ))}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 1, py: 1.5, backgroundColor: 'var(--ink)', '&:hover': { backgroundColor: '#333' } }}
      >
        {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Register'}
      </Button>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}

      {result && (
        <Box sx={{ mt: 3, p: 2.5, backgroundColor: '#f0f8f0', border: '1px solid #1a6b3c' }}>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 1.5, color: '#1a6b3c' }}>
            ✓ Registration Successful — SAVE THIS!
          </Typography>
          <Box component="pre" sx={{ fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(result, null, 2)}
          </Box>
          <Typography sx={{ mt: 2, fontSize: '12px', color: '#555', fontWeight: 500 }}>
            Copy <code>clientID</code> and <code>clientSecret</code> into <code>src/api/notifications.js</code>
          </Typography>
        </Box>
      )}
    </Box>
  )
}
