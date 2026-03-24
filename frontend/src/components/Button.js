import React from 'react';

function Button({ text, onClick, color = '#3498db' }) {
  return (
    <button style={{ ...styles.button, backgroundColor: color }} onClick={onClick}>
      {text}
    </button>
  );
}

const styles = {
  button: {
    padding: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Button;