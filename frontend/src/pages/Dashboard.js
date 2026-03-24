import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', category: 'Salary', amount: 3000, date: '2026-03-01' },
    { id: 2, type: 'expense', category: 'Food', amount: 300, date: '2026-03-05' },
    { id: 3, type: 'expense', category: 'Rent', amount: 800, date: '2026-03-06' },
  ]);
  const [form, setForm] = useState({
    type: 'income', category: 'Salary', amount: '', date: ''
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const pieData = ['Food', 'Rent', 'Transport', 'Entertainment', 'Salary'].map(cat => ({
    name: cat,
    value: transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  const handleAdd = () => {
    if (!form.amount || !form.date) return;
    const newTransaction = {
      id: Date.now(),
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount),
      date: form.date
    };
    setTransactions([...transactions, newTransaction]);
    setForm({ type: 'income', category: 'Salary', amount: '', date: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.logo}>💰 SmartWallet</h2>
        <button style={styles.navBtn} onClick={() => navigate('/history')}>
          📋 History
        </button>
      </div>

      {/* Balance */}
      <div style={styles.balanceCard}>
        <p style={styles.balanceLabel}>Current Balance</p>
        <h1 style={{ color: balance >= 0 ? '#2ecc71' : '#e74c3c', margin: 0 }}>
          {balance} RON
        </h1>
        <div style={styles.row}>
          <span style={{ color: '#2ecc71' }}>▲ Income: {totalIncome} RON</span>
          <span style={{ color: '#e74c3c' }}>▼ Expenses: {totalExpense} RON</span>
        </div>
      </div>

      {/* Form */}
      <div style={styles.card}>
        <h3>Add Transaction</h3>
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
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })} />
          <input style={styles.input} type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })} />
          <button style={styles.button} onClick={handleAdd}>Add</button>
        </div>
      </div>

      {/* Pie Chart */}
      <div style={styles.card}>
        <h3>Spending by Category</h3>
        <PieChart width={400} height={300}>
          <Pie data={pieData} cx={200} cy={150} outerRadius={100}
            dataKey="value" label>
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#2c3e50' },
  navBtn: { padding: '8px 16px', backgroundColor: '#3498db', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer' },
  balanceCard: { backgroundColor: '#2c3e50', color: 'white', padding: '30px',
    borderRadius: '12px', textAlign: 'center', marginBottom: '20px' },
  balanceLabel: { margin: '0 0 8px 0', opacity: 0.8 },
  row: { display: 'flex', justifyContent: 'space-around', marginTop: '12px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' },
  formRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  button: { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }
};

export default Dashboard;