import React, { useState } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log(' Testing API connection...');
      
      // Test basic server health
      const healthResponse = await api.get('/health', { 
        baseURL: 'http://13.60.163.36:5000' 
      });
      
      console.log(' Health check success:', healthResponse.data);
      setResult(`SUCCESS: Server is healthy - ${JSON.stringify(healthResponse.data)}`);
      
    } catch (error) {
      console.error(' API test failed:', error);
      setResult(`ERROR: ${error.message} - ${error.code || 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log(' Testing registration endpoint...');
      
      const testData = {
        name: 'Test User',
        email: 'test@kongu.edu',
        password: 'test123456'
      };
      
      const response = await api.post('/auth/register', testData);
      console.log(' Registration test success:', response.data);
      setResult(`REGISTRATION SUCCESS: ${JSON.stringify(response.data)}`);
      
    } catch (error) {
      console.error(' Registration test failed:', error);
      setResult(`REGISTRATION ERROR: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #333',
      padding: '10px',
      borderRadius: '8px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h4>API DEBUG TOOLS</h4>
      <button onClick={testApiConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      <button onClick={testRegistration} disabled={loading} style={{ marginLeft: '5px' }}>
        {loading ? 'Testing...' : 'Test Registration'}
      </button>
      <div style={{ marginTop: '10px', fontSize: '12px', wordBreak: 'break-all' }}>
        {result}
      </div>
    </div>
  );
};

export default ApiTest;
