import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions, deleteTransaction, updateTransaction } from '../services/api';

function History() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    const response = await getTransactions(userId);
    setTransactions(response.data);
  };

  const filtered = filterMonth
    ? transactions.filter(t => t.date.startsWith(filterMonth))
    : transactions;

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEdit = (t) => { setEditId(t.id); setEditAmount(t.amount); };

  const handleSave = async (id) => {
    await updateTransaction(id, { amount: parseFloat(editAmount) });
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, amount: parseFloat(editAmount) } : t
    ));
    setEditId(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.topGlow} />

      <div style={styles.navbar}>
        <h2 style={styles.navLogo}>💰 SmartWallet</h2>
        <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.pageTitle}>Transaction History</h2>

        <div style={styles.card}>
          <div style={styles.filterRow}>
            <label style={styles.filterLabel}>FILTER BY MONTH</label>
            <input type="month" style={styles.input}
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)} />
            {filterMonth && (
              <button style={styles.clearBtn} onClick={() => setFilterMonth('')}>
                Clear
              </button>
            )}
          </div>
        </div>

        <div style={styles.card}>
          {filtered.length === 0
            ? <p style={styles.empty}>No transactions found.</p>
            : filtered.map(t => (
              <div key={t.id} style={styles.row}>
                <div style={{
                  ...styles.typeIcon,
                  background: t.type === 'income' ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                  color: t.type === 'income' ? 'var(--green)' : 'var(--red)'
                }}>
                  {t.type === 'income' ? '▲' : '▼'}
                </div>

                <div style={styles.info}>
                  <span style={styles.category}>{t.category}</span>
                  <span style={styles.date}>{t.date}</span>
                </div>

                {editId === t.id ? (
                  <div style={styles.editRow}>
                    <input style={styles.editInput} type="number"
                      value={editAmount}
                      onChange={e => setEditAmount(e.target.value)} />
                    <button style={styles.saveBtn} onClick={() => handleSave(t.id)}>Save</button>
                  </div>
                ) : (
                  <div style={styles.actions}>
                    <span style={{
                      ...styles.amount,
                      color: t.type === 'income' ? 'var(--green)' : 'var(--red)'
                    }}>
                      {t.type === 'income' ? '+' : '-'}{t.amount} RON
                    </span>
                    <button style={styles.editBtn} onClick={() => handleEdit(t)}>✏️</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>🗑️</button>
                  </div>
                )}
              </div>
            ))
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
  navBtn: {
    background: 'var(--gold-dim)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '8px 16px', color: 'var(--gold)',
    cursor: 'pointer', fontSize: '14px', fontFamily: 'DM Sans, sans-serif'
  },
  container: { maxWidth: '860px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 },
  pageTitle: {
    fontSize: '32px', marginBottom: '28px',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  card: {
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: '16px', padding: '24px', marginBottom: '20px'
  },
  filterRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  filterLabel: { fontSize: '11px', letterSpacing: '2px', color: 'var(--gold)' },
  input: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px',
    padding: '8px 12px', color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: 'DM Sans, sans-serif'
  },
  clearBtn: {
    background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '8px', padding: '8px 14px', color: 'var(--red)',
    cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif'
  },
  empty: { color: 'var(--text-dim)', textAlign: 'center', padding: '20px' },
  row: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px 0', borderBottom: '1px solid var(--border)'
  },
  typeIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 'bold', flexShrink: 0
  },
  info: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  category: { fontWeight: '500', fontSize: '15px', color: 'var(--text)' },
  date: { fontSize: '12px', color: 'var(--text-dim)' },
  actions: { display: 'flex', alignItems: 'center', gap: '10px' },
  amount: { fontWeight: '600', fontSize: '15px', minWidth: '100px', textAlign: 'right' },
  editRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  editInput: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px',
    padding: '6px 10px', color: 'var(--text)', width: '90px',
    outline: 'none', fontFamily: 'DM Sans, sans-serif'
  },
  saveBtn: {
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    border: 'none', borderRadius: '8px', padding: '6px 14px',
    color: '#0a0a12', fontWeight: '700', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontSize: '13px'
  },
  editBtn: {
    background: 'var(--gold-dim)', border: '1px solid var(--border)',
    borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px'
  },
  deleteBtn: {
    background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)',
    borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px'
  }
};

export default History;