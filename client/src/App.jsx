import React, { useState } from 'react';
import styles from './components/styles.js';
import FarmerView from './components/FarmerView.jsx';
import DistributorView from './components/DistributorView.jsx';
import ConsumerView from './components/ConsumerView.jsx';
import TabButton from './components/TabButton.jsx';

function App() {
  const [view, setView] = useState('farmer');

  return (
    <div style={styles.appContainer}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Agri-Trace PoC</h1>
          <p style={styles.p}>Blockchain-Powered Supply Chain Transparency</p>
          <nav style={styles.nav}>
            <TabButton name="Farmer" currentView={view} setView={setView} />
            <TabButton name="Distributor" currentView={view} setView={setView} />
            <TabButton name="Consumer" currentView={view} setView={setView} />
          </nav>
        </header>
        <main style={styles.main}>
          {view === 'farmer' && <FarmerView />}
          {view === 'distributor' && <DistributorView />}
          {view === 'consumer' && <ConsumerView />}
        </main>
    </div>
  );
}

export default App;