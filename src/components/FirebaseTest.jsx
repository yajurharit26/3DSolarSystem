import React, { useState, useEffect } from 'react';
import { testFirebaseConnection } from '../firebase/config';

export const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const success = await testFirebaseConnection();
        setConnectionStatus(success ? 'Connected ✅' : 'Failed to connect ❌');
      } catch (err) {
        setError(err.message);
        setConnectionStatus('Error occurred ❌');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '5px',
      zIndex: 1000
    }}>
      <h3>Firebase Status</h3>
      <p>Status: {connectionStatus}</p>
      {error && (
        <p style={{ color: 'red', maxWidth: '300px', wordBreak: 'break-word' }}>
          Error: {error}
        </p>
      )}
      <p style={{ fontSize: '12px' }}>
        Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID}
      </p>
    </div>
  );
}; 