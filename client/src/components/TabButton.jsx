import React, { useState } from 'react';
import styles from './styles.js';

const TabButton = ({ name, currentView, setView }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = currentView === name.toLowerCase();

    let buttonStyle = {
        ...styles.tabButton,
        ...(isActive ? styles.tabButtonActive : styles.tabButtonInactive)
    };
    if (!isActive && isHovered) {
        buttonStyle.backgroundColor = '#e2e8f0'; // hover effect
    }

    return (
        <button
            onClick={() => setView(name.toLowerCase())}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {name}
        </button>
    );
};

export default TabButton;