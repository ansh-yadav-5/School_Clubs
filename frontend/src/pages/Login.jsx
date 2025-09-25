import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

 import { Link } from 'react-router-dom'  // <-- make sure this is imported at the top
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard/*') // redirect after successful login
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="container">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"   // <-- better: enforce email type
      />
      <input
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    {/* ✅ Link to your Register page */}
    <p style={{ marginTop: '10px' }}>
      Don&apos;t have an account? <Link to="/register">Register</Link>
    </p>
  </div>
)

}
