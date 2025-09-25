import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const API_URL = '/api'

function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState('acme@company.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        onLogin(data.token, data.company)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Company Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        {error && <div className="error">{error}</div>}
        <div className="small">
          <strong>Demo companies:</strong><br />
          • Acme Corp: acme@company.com / password<br />
          • TechStart Inc: admin@techstart.com / password<br /><br />
          Don't have an account?{' '}
          <button type="button" className="link-button" onClick={switchToRegister}>
            Create one here
          </button>
        </div>
      </form>
    </div>
  )
}

function RegisterForm({ onRegister, switchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        onRegister(data.token, data.company)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Company Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        {error && <div className="error">{error}</div>}
        <div className="small">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={switchToLogin}>
            Sign in here
          </button>
        </div>
      </form>
    </div>
  )
}

function Dashboard({ token, company, onLogout }) {
  const [activeTab, setActiveTab] = useState('actions')
  const [actions, setActions] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingAction, setEditingAction] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newAction, setNewAction] = useState({ name: '', value: '', description: '' })

  useEffect(() => {
    fetchActions()
    fetchTransactions()
  }, [])

  const fetchActions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/meta`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setActions(data.actions || [])
      }
    } catch (err) {
      console.error('Failed to fetch actions:', err)
    }
    setLoading(false)
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    }
  }

  const updateAction = async (actionId, updates) => {
    try {
      const response = await fetch(`${API_URL}/actions/${actionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchActions()
        setEditingAction(null)
      }
    } catch (err) {
      console.error('Failed to update action:', err)
    }
  }

  const createAction = async (actionData) => {
    try {
      const response = await fetch(`${API_URL}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      })

      if (response.ok) {
        await fetchActions()
        setShowNewForm(false)
        setNewAction({ name: '', value: '', description: '' })
      }
    } catch (err) {
      console.error('Failed to create action:', err)
    }
  }

  const deleteAction = async (actionId) => {
    if (!confirm('Are you sure you want to delete this action?')) return

    try {
      const response = await fetch(`${API_URL}/actions/${actionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        await fetchActions()
      }
    } catch (err) {
      console.error('Failed to delete action:', err)
    }
  }

  const submitTransaction = async (actionId) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ actionId })
      })

      if (response.ok) {
        await fetchTransactions()
        alert('Transaction submitted successfully!')
      }
    } catch (err) {
      console.error('Failed to submit transaction:', err)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Play'd Partner Portal</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Welcome, {company?.name}!</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Company Rewards
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Recent Transactions
        </button>
      </div>

      {activeTab === 'actions' && (
        <div>
          <div className="section-header">
            <h2 className="section-title">Company Rewards & Values</h2>
            <button
              className="btn"
              onClick={() => setShowNewForm(true)}
            >
              Add New Reward
            </button>
          </div>
          <p className="welcome-text">Welcome, {company?.name}! Manage your reward programs and their dollar values below.</p>

          {showNewForm && (
            <div className="form-card">
              <h3>Create New Reward</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newAction.name}
                    onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Value ($)</label>
                  <input
                    type="text"
                    value={newAction.value}
                    onChange={(e) => setNewAction({ ...newAction, value: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={newAction.description}
                    onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                    rows="2"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  className="btn"
                  onClick={() => createAction(newAction)}
                  disabled={!newAction.name || !newAction.value}
                >
                  Create Reward
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowNewForm(false)
                    setNewAction({ name: '', value: '', description: '' })
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading actions...</div>
          ) : (
            <div className="actions-table">
              <div className="table-header">
                <div>REWARD</div>
                <div>VALUE (USD)</div>
                <div>DESCRIPTION</div>
                <div>ACTIONS</div>
              </div>
              {actions.map((action) => (
                <div key={action.id} className="table-row">
                  {editingAction === action.id ? (
                    <EditActionForm
                      action={action}
                      onSave={(updates) => updateAction(action.id, updates)}
                      onCancel={() => setEditingAction(null)}
                    />
                  ) : (
                    <>
                      <div className="action-name">{action.name}</div>
                      <div className="action-value">${action.value}</div>
                      <div className="action-description">{action.description}</div>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setEditingAction(action.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteAction(action.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {activeTab === 'transactions' && (
        <div>
          <div className="section-header">
            <h2 className="section-title">Recent Reward Transactions</h2>
          </div>
          {transactions.length === 0 ? (
            <div className="no-data">
              <p>No transactions yet. Submit some actions to see them here!</p>
            </div>
          ) : (
            <div className="transactions-table">
              <div className="table-header">
                <div>USER</div>
                <div>REWARD</div>
                <div>VALUE</div>
                <div>WHEN</div>
              </div>
              {transactions.map((transaction) => (
                <div key={transaction.id} className="table-row">
                  <div className="transaction-user">{transaction.user}</div>
                  <div className="transaction-action">{transaction.actionName}</div>
                  <div className="transaction-value">${transaction.value}</div>
                  <div className="transaction-date">
                    {new Date(transaction.timestamp).toLocaleString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EditActionForm({ action, onSave, onCancel }) {
  const [name, setName] = useState(action.name)
  const [value, setValue] = useState(action.value)
  const [description, setDescription] = useState(action.description)

  const handleSave = () => {
    onSave({ name, value, description })
  }

  return (
    <>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Value ($)</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
        />
      </div>
      <div className="action-buttons">
        <button className="btn" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  )
}

export default function Home() {
  const [token, setToken] = useState(null)
  const [company, setCompany] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const handleLogin = (token, companyData) => {
    setToken(token)
    setCompany(companyData)
    setShowRegister(false)
  }

  const handleRegister = (token, companyData) => {
    setToken(token)
    setCompany(companyData)
    setShowRegister(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setCompany(null)
    setShowRegister(false)
  }

  if (token) {
    return <Dashboard token={token} company={company} onLogout={handleLogout} />
  }

  return (
    <div className="auth-container">
      {showRegister ? (
        <RegisterForm
          onRegister={handleRegister}
          switchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm
          onLogin={handleLogin}
          switchToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  )
}