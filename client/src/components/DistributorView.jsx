import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.js';

const DistributorView = () => {
    const [produceId, setProduceId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    
    // IMPORTANT: Replace this with an address from your Ganache instance
    const DISTRIBUTOR_ADDRESS = "0x902335693f71c9f7dce973B213e86be3eD20bb1A";

    const handleTransfer = async () => {
        setIsLoading(true); setError(''); setResult('');
        try {
            const response = await axios.put(`http://localhost:3001/produce/${produceId}`, { newOwner: DISTRIBUTOR_ADDRESS });
            setResult(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.viewContainer}>
          <h2 style={styles.h2}>Receive Produce Batch</h2>
          <p style={styles.p}>Enter the Produce ID to transfer ownership to the distributor.</p>
          <input type="text" value={produceId} onChange={(e) => setProduceId(e.target.value)} placeholder="Enter Produce ID" style={styles.input} />
          <button onClick={handleTransfer} disabled={isLoading || !produceId} style={{...styles.button, ...((isLoading || !produceId) && styles.buttonDisabled)}}>
              {isLoading ? 'Transferring...' : 'Receive & Transfer Ownership'}
          </button>
          {error && <div style={styles.errorBox}>{error}</div>}
          {result && <div style={styles.successBox}>{result}</div>}
        </div>
    );
};

export default DistributorView;