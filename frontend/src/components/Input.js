import React from 'react';

function Input({ placeholder, type = 'text', value, onChange }) {
  return (
    <input
      style={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

const styles = {
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  }
};

export default Input;