import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function History() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', category: 'Salary', amount: 3000, date: '2026-03-01' },
    { id: 2, type: 'expense', category: 'Food', amount: 300, date: '2026-03-05' },
    { id: 3, type: 'expense', category: 'Rent', amount: 800, date: '2026-03-06' },
  ]);
  const [filterMonth, setFilterMonth] = useState('');
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const filtered = filterMonth
    ? transactions.filter(t => t.date.startsWith(filterMonth))
    : transactions;

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setEditAmount(t.amount);
  };

  const handleSave = (id) => {
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, amount: parseFloat(editAmount) } : t
    ));
    setEditId(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📋 Transaction History</h2>
        <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Filter */}
      <div style={styles.card}>
        <label>Filter by month: </label>
        <input type="month" style={styles.input}
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)} />
        {filterMonth && (
          <button style={styles.clearBtn} onClick={() => setFilterMonth('')}>
            Clear
          </button>
        )}
      </div>

      {/* Transactions */}
      <div style={styles.card}>
        {filtered.length === 0 && <p>No transactions found.</p>}
        {filtered.map(t => (
          <div key={t.id} style={styles.row}>
            <span style={{ color: t.type === 'income' ? '#2ecc71' : '#e74c3c' }}>
              {t.type === 'income' ? '▲' : '▼'}
            </span>
            <span style={styles.category}>{t.category}</span>
            <span style={styles.date}>{t.date}</span>

            {editId === t.id ? (
              <>
                <input style={styles.editInput} type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)} />
                <button style={styles.saveBtn} onClick={() => handleSave(t.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <span style={styles.amount}>{t.amount} RON</span>
                <button style={styles.editBtn} onClick={() => handleEdit(t)}>
                  ✏️ Edit
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { padding: '8px 16px', backgroundColor: '#3498db', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' },
  input: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', marginLeft: '8px' },
  clearBtn: { marginLeft: '8px', padding: '8px 12px', backgroundColor: '#e74c3c',
    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  row: { display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  category: { flex: 1, fontWeight: 'bold' },
  date: { color: '#888', fontSize: '14px' },
  amount: { fontWeight: 'bold', minWidth: '80px' },
  editInput: { padding: '6px', borderRadius: '6px', border: '1px solid #ddd', width: '80px' },
  saveBtn: { padding: '6px 12px', backgroundColor: '#2ecc71', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  editBtn: { padding: '6px 10px', backgroundColor: '#f39c12', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default History;