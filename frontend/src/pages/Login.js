import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // temporar, fara backend
    if (username && password) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💰 SmartWallet</h2>
        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white', padding: '40px',
    borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column', gap: '16px', width: '300px'
  },
  title: { textAlign: 'center', color: '#2c3e50', margin: 0 },
  input: {
    padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px'
  },
  button: {
    padding: '12px', backgroundColor: '#3498db',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer'
  }
};

export default Login;