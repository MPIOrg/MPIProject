import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { getTransactions, addTransaction } from '../services/api';

const COLORS = ['#c9a84c', '#e8c97a', '#2ecc71', '#e74c3c', '#9b59b6'];

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'income', category: 'Salary', amount: '', date: '' });
  const [error, setError] = useState('');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    const response = await getTransactions(userId);
    setTransactions(response.data);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const pieData = ['Food', 'Rent', 'Transport', 'Entertainment', 'Salary'].map(cat => ({
    name: cat,
    value: transactions.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0)
  })).filter(d => d.value > 0);

  const handleAdd = async () => {
    if (!form.amount || !form.date) { setError('Please fill in all fields!'); return; }
    await addTransaction({
      type: form.type, category: form.category,
      amount: parseFloat(form.amount), date: form.date,
      userId: localStorage.getItem('userId')
    });
    fetchTransactions();
    setForm({ type: 'income', category: 'Salary', amount: '', date: '' });
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <div style={styles.topGlow} />

      <div style={styles.navbar}>
        <h2 style={styles.navLogo}>💰 SmartWallet</h2>
        <div style={styles.navActions}>
          <button style={styles.navBtn} onClick={() => navigate('/history')}>📋 History</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.balanceCard}>
          <p style={styles.balanceLabel}>CURRENT BALANCE</p>
          <h1 style={{ ...styles.balanceAmount, color: balance >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {balance.toLocaleString()} RON
          </h1>
          <div style={styles.balanceRow}>
            <div style={styles.balanceStat}>
              <span style={styles.statLabel}>▲ INCOME</span>
              <span style={{ color: 'var(--green)', fontWeight: 600 }}>{totalIncome.toLocaleString()} RON</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.balanceStat}>
              <span style={styles.statLabel}>▼ EXPENSES</span>
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>{totalExpense.toLocaleString()} RON</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Transaction</h3>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.formRow}>
            <select style={styles.input} value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select style={styles.input} value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              <option>Salary</option>
              <option>Food</option>
              <option>Rent</option>
              <option>Transport</option>
              <option>Entertainment</option>
            </select>
            <input style={styles.input} type="number" placeholder="Amount (RON)"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            <input style={styles.input} type="date"
              value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <button style={styles.addBtn} onClick={handleAdd}>+ Add</button>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Spending by Category</h3>
          {pieData.length === 0
            ? <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>No data yet</p>
            : <PieChart width={420} height={300}>
                <Pie data={pieData} cx={210} cy={140} outerRadius={110} dataKey="value" label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                <Legend wrapperStyle={{ color: 'var(--text-dim)' }} />
              </PieChart>
          }
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)', position: 'relative' },
  topGlow: {
    position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0
  },
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 40px', borderBottom: '1px solid var(--border)',
    background: 'rgba(15,15,26,0.8)', backdropFilter: 'blur(10px)',
    position: 'sticky', top: 0, zIndex: 10
  },
  navLogo: {
    fontSize: '22px',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  navActions: { display: 'flex', gap: '12px' },
  navBtn: {
    background: 'var(--gold-dim)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '8px 16px', color: 'var(--gold)',
    cursor: 'pointer', fontSize: '14px', fontFamily: 'DM Sans, sans-serif'
  },
  logoutBtn: {
    background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '8px', padding: '8px 16px', color: 'var(--red)',
    cursor: 'pointer', fontSize: '14px', fontFamily: 'DM Sans, sans-serif'
  },
  container: { maxWidth: '860px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 },
  balanceCard: {
    background: 'linear-gradient(135deg, #12121f, #1a1a2e)',
    border: '1px solid var(--border)', borderRadius: '20px',
    padding: '40px', marginBottom: '24px', textAlign: 'center',
    boxShadow: '0 8px 40px rgba(201,168,76,0.08)'
  },
  balanceLabel: { fontSize: '11px', letterSpacing: '3px', color: 'var(--gold)', marginBottom: '12px' },
  balanceAmount: { fontSize: '52px', fontFamily: 'Playfair Display, serif', marginBottom: '24px' },
  balanceRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' },
  balanceStat: { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' },
  statLabel: { fontSize: '10px', letterSpacing: '2px', color: 'var(--text-dim)' },
  divider: { width: '1px', height: '40px', background: 'var(--border)' },
  card: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '28px', marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '18px', marginBottom: '20px',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  formRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
  input: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px',
    padding: '10px 14px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: 'DM Sans, sans-serif'
  },
  addBtn: {
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    border: 'none', borderRadius: '8px', padding: '10px 20px',
    color: '#0a0a12', fontWeight: '700', fontSize: '14px',
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
  },
  error: { color: 'var(--red)', fontSize: '13px', marginBottom: '12px',
    background: 'rgba(231,76,60,0.1)', padding: '8px', borderRadius: '8px' }
};

export default Dashboard;