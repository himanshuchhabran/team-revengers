import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.js';

const ConsumerView = () => {
  const [produceId, setProduceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [produceData, setProduceData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (idToTrack) => {
    if (!idToTrack) return;
    setIsLoading(true); setError(''); setProduceData(null);
    try {
      const response = await axios.get(`http://localhost:3001/produce/${idToTrack}`);
      setProduceData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred or produce not found.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl) {
      setProduceId(idFromUrl);
      handleTrack(idFromUrl);
    }
  }, []);

  return (
    <div style={styles.viewContainer}>
      <h2 style={styles.h2}>Trace Your Produce</h2>
      <p style={styles.p}>Scan a QR code or enter the Produce ID to see its journey.</p>
      <div style={{display: 'flex', gap: '1rem'}}>
          <input type="text" value={produceId} onChange={(e) => setProduceId(e.target.value)} placeholder="Enter Produce ID" style={{...styles.input, flexGrow: 1}}/>
          <button onClick={() => handleTrack(produceId)} disabled={isLoading || !produceId} style={{...styles.button, ...((isLoading || !produceId) && styles.buttonDisabled), width: 'auto'}}>
            {isLoading ? 'Tracking...' : 'Track'}
          </button>
      </div>
      {error && <div style={styles.errorBox}>{error}</div>}
      {produceData && (
        <div style={{marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b'}}>History for {produceData.name} (ID: {produceData.id})</h3>
          <p style={styles.p}>Current Owner: <strong style={{fontFamily: 'monospace', fontSize: '0.875rem', backgroundColor: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '0.25rem'}}>{produceData.owner}</strong></p>
          <ul style={styles.historyList}>
            {produceData.history.map((entry, index) => (
              <li key={index} style={styles.historyItem}>
                <div style={styles.historyIcon}><span style={styles.historyIconText}>{index + 1}</span></div>
                <span style={{flex: 1, color: '#334155', fontSize: '0.875rem'}}>{entry}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConsumerView;