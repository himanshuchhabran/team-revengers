// --- SHARED STYLES ---
// This file centralizes all CSS-in-JS style objects for a consistent look and feel.

const styles = {
    appContainer: { minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', fontFamily: 'sans-serif', color: '#0f172a' },
    header: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', textAlign: 'center', marginBottom: '2rem', width: '100%', maxWidth: '672px' },
    main: { backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '672px' },
    h1: { fontSize: '2.25rem', fontWeight: 'bold', color: '#14532d' },
    p: { color: '#475569', marginTop: '0.5rem' },
    nav: { marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' },
    tabButton: { padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600', borderRadius: '9999px', transition: 'all 0.2s ease-in-out', border: 'none', cursor: 'pointer' },
    tabButtonActive: { backgroundColor: '#16a34a', color: 'white', transform: 'scale(1.05)' },
    tabButtonInactive: { backgroundColor: '#f1f5f9', color: '#475569' },
    viewContainer: { display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1.5rem' },
    h2: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' },
    input: { width: 'calc(100% - 2rem)', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontSize: '1rem' },
    button: { width: '100%', backgroundColor: '#16a34a', color: 'white', fontWeight: 'bold', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out', fontSize: '1rem' },
    buttonDisabled: { backgroundColor: '#94a3b8', cursor: 'not-allowed' },
    errorBox: { padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.5rem', border: '1px solid #fecaca' },
    successBox: { padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.5rem', border: '1px solid #bbf7d0' },
    resultBox: { marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem' },
    qrContainer: { margin: '1rem auto', width: '12rem', height: '12rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
    historyList: { marginTop: '1rem', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    historyItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
    historyIcon: { width: '1.5rem', height: '1.5rem', backgroundColor: '#22c55e', color: 'white', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.25rem', flexShrink: 0, fontWeight: 'bold' },
};

export default styles;
