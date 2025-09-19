import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.js';
import QRCode from './QRCode.jsx';

const FarmerView = () => {
  const [produceName, setProduceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setResult(null);
    try {
      const response = await axios.post('http://localhost:3001/produce', { name: produceName });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Is the backend server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.viewContainer}>
      <h2 style={styles.h2}>Register New Produce</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <input type="text" value={produceName} onChange={(e) => setProduceName(e.target.value)} placeholder="e.g., Organic Potatoes" required style={styles.input}/>
        <button type="submit" disabled={isLoading} style={{...styles.button, ...(isLoading && styles.buttonDisabled)}}>
          {isLoading ? 'Registering...' : 'Register Produce'}
        </button>
      </form>
      {error && <div style={styles.errorBox}>{error}</div>}
      {result && (
        <div style={styles.resultBox}>
          <h3 style={{fontWeight: '600', color: '#14532d'}}>{result.message}</h3>
          <p style={styles.p}>Produce ID: <strong style={{fontFamily: 'monospace', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem'}}>{result.produceId}</strong></p>
          <div style={styles.qrContainer}>
            <QRCode value={`http://localhost:5173/?id=${result.produceId}`} />
          </div>
          <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#64748b'}}>Scan this QR Code to trace the produce.</p>
        </div>
      )}
    </div>
  );
};

export default FarmerView;