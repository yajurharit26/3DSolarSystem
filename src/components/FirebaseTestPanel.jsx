import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit 
} from 'firebase/firestore';

export const FirebaseTestPanel = () => {
  const [testResults, setTestResults] = useState([]);
  const [lastSavedId, setLastSavedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addLogMessage = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  // Test Create Operation with Solar System Configuration
  const testCreate = async () => {
    setIsLoading(true);
    try {
      const testConfig = {
        name: 'Test Solar System Configuration',
        timestamp: new Date(),
        planets: [
          {
            name: "Earth",
            size: 0.6,
            texture: "earth.jpg",
            orbitRadius: 8,
            speed: 0.006
          },
          {
            name: "Mars",
            size: 0.5,
            texture: "mars.jpg",
            orbitRadius: 10,
            speed: 0.004
          },
          {
            name: "Saturn",
            size: 1,
            texture: "saturn.jpg",
            ringTexture: "saturn-ring.png",
            orbitRadius: 18,
            speed: 0.001
          }
        ]
      };

      const docRef = await addDoc(collection(db, 'configurations'), testConfig);
      setLastSavedId(docRef.id);
      addLogMessage(`✅ Created Solar System Configuration - ID: ${docRef.id}`, 'success');
    } catch (error) {
      addLogMessage(`❌ Create Failed: ${error.message}`, 'error');
    }
    setIsLoading(false);
  };

  // Test Read Operation
  const testRead = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'configurations'), orderBy('timestamp', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const configs = [];
      querySnapshot.forEach((doc) => {
        configs.push({ id: doc.id, ...doc.data() });
      });
      addLogMessage(`✅ Read Success - Found ${configs.length} configurations`, 'success');
      configs.forEach(config => {
        addLogMessage(`📄 Configuration ${config.id}: ${config.name} (${config.planets?.length || 0} planets)`, 'info');
      });
    } catch (error) {
      addLogMessage(`❌ Read Failed: ${error.message}`, 'error');
    }
    setIsLoading(false);
  };

  // Test Update Operation
  const testUpdate = async () => {
    if (!lastSavedId) {
      addLogMessage('⚠️ No configuration ID available. Create a configuration first.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, 'configurations', lastSavedId);
      const updateData = {
        name: 'Updated Solar System Configuration',
        lastUpdated: new Date(),
        planets: [
          {
            name: "Earth",
            size: 0.8,
            texture: "earth.jpg",
            orbitRadius: 8,
            speed: 0.008
          },
          {
            name: "Saturn",
            size: 1.2,
            texture: "saturn.jpg",
            ringTexture: "saturn-ring.png",
            orbitRadius: 20,
            speed: 0.002
          }
        ]
      };
      
      await updateDoc(docRef, updateData);
      addLogMessage(`✅ Update Success - Configuration ID: ${lastSavedId}`, 'success');
    } catch (error) {
      addLogMessage(`❌ Update Failed: ${error.message}`, 'error');
    }
    setIsLoading(false);
  };

  // Test Delete Operation
  const testDelete = async () => {
    if (!lastSavedId) {
      addLogMessage('⚠️ No configuration ID available. Create a configuration first.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'configurations', lastSavedId));
      addLogMessage(`✅ Delete Success - Configuration ID: ${lastSavedId}`, 'success');
      setLastSavedId(null);
    } catch (error) {
      addLogMessage(`❌ Delete Failed: ${error.message}`, 'error');
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 1000,
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h3>Solar System Database Test Panel</h3>
      
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testCreate}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            background: '#4CAF50',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Save Config
        </button>
        
        <button 
          onClick={testRead}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            background: '#2196F3',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Load Configs
        </button>
        
        <button 
          onClick={testUpdate}
          disabled={isLoading || !lastSavedId}
          style={{
            padding: '8px 16px',
            background: '#FFC107',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: (isLoading || !lastSavedId) ? 'not-allowed' : 'pointer'
          }}
        >
          Update Config
        </button>
        
        <button 
          onClick={testDelete}
          disabled={isLoading || !lastSavedId}
          style={{
            padding: '8px 16px',
            background: '#F44336',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: (isLoading || !lastSavedId) ? 'not-allowed' : 'pointer'
          }}
        >
          Delete Config
        </button>

        <button 
          onClick={clearLogs}
          style={{
            padding: '8px 16px',
            background: '#757575',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Clear Logs
        </button>
      </div>

      <div style={{ 
        marginTop: '20px',
        maxHeight: '300px',
        overflow: 'auto',
        background: 'rgba(0,0,0,0.3)',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {testResults.map((result, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '5px',
              color: result.type === 'error' ? '#ff6b6b' : 
                     result.type === 'success' ? '#69db7c' :
                     result.type === 'warning' ? '#ffd43b' : 'white',
              fontSize: '14px'
            }}
          >
            <span style={{ color: '#888' }}>[{result.timestamp}]</span> {result.message}
          </div>
        ))}
      </div>
    </div>
  );
}; 