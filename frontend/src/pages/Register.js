import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validare simplă pe Frontend înainte de a trimite la server
    if (!username || !email || !password) {
      setError('Please fill in all fields!');
      return;
    }

    try {
      // Trimitem datele către API
      await register({ username, email, password });

      // Dacă cererea a reușit (status 200/201), navigăm la login
      navigate('/login');
    } catch (err) {
      // Extragem mesajul de eroare setat în UserDTO sau UserService (Backend)
      // Dacă parola e prea scurtă, aici va apărea "Parola trebuie să aibă minim 6 caractere"
      const serverMessage = err.response?.data?.message || 'Registration failed. Please check your data.';
      setError(serverMessage);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logo}>💰</div>
        <h2 style={styles.title}>SmartWallet</h2>
        <p style={styles.subtitle}>Create your account</p>

        {/* Mesajul de eroare apare acum doar dacă înregistrarea chiar eșuează */}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Choose a password (min. 6 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
          />
        </div>

        <button style={styles.btn} onClick={handleRegister}>Create Account</button>
        <p style={styles.link}>
          Already have an account?{' '}
          <span style={styles.linkSpan} onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden'
  },
  glow: {
    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none'
  },
  card: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '20px', padding: '48px 40px', width: '380px',
    display: 'flex', flexDirection: 'column', gap: '20px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    position: 'relative', zIndex: 1
  },
  logo: { fontSize: '40px', textAlign: 'center' },
  title: {
    textAlign: 'center', fontSize: '28px',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  subtitle: { textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px', marginTop: '-12px' },
  error: {
    color: '#e74c3c', fontSize: '13px', textAlign: 'center',
    background: 'rgba(231,76,60,0.1)', padding: '8px', borderRadius: '8px',
    border: '1px solid rgba(231,76,60,0.2)'
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase' },
  input: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px',
    padding: '12px 16px', color: 'var(--text)', fontSize: '15px', outline: 'none'
  },
  btn: {
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    border: 'none', borderRadius: '10px', padding: '14px',
    color: '#0a0a12', fontWeight: '700', fontSize: '16px',
    cursor: 'pointer', marginTop: '4px',
    fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.5px'
  },
  link: { textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px' },
  linkSpan: { color: 'var(--gold)', cursor: 'pointer', fontWeight: '500' }
};

export default Register;