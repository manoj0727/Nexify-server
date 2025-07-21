import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthCheck = () => {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [backendUrl, setBackendUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    setBackendUrl(apiUrl || 'NOT SET');

    if (!apiUrl) {
      setBackendStatus('❌ FAILED');
      setError('REACT_APP_API_URL environment variable is not set');
      return;
    }

    if (apiUrl.includes('your-backend-api.com')) {
      setBackendStatus('❌ FAILED');
      setError('Backend URL is still set to placeholder. Deploy your backend first!');
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/server-status`);
      if (response.data.message === "Server is up and running!") {
        setBackendStatus('✅ CONNECTED');
        setError('');
      } else {
        setBackendStatus('⚠️ UNEXPECTED RESPONSE');
        setError('Server responded but with unexpected data');
      }
    } catch (err) {
      setBackendStatus('❌ FAILED');
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend. Is it deployed and running?');
      } else if (err.response?.status === 404) {
        setError('Backend is running but /server-status endpoint not found');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Nexify Health Check</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Connection Status</h2>
          
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Backend URL: </span>
              <span className="font-mono text-blue-600">{backendUrl}</span>
            </div>
            
            <div>
              <span className="font-semibold">Status: </span>
              <span className={`font-bold ${
                backendStatus.includes('✅') ? 'text-green-600' : 
                backendStatus.includes('❌') ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {backendStatus}
              </span>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What This Means</h2>
          
          {backendStatus.includes('✅') ? (
            <div className="text-green-700">
              <p>✅ Your backend is properly deployed and connected!</p>
              <p>All features should work correctly:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Demo login</li>
                <li>User registration</li>
                <li>Email verification</li>
                <li>Admin panel</li>
              </ul>
            </div>
          ) : (
            <div className="text-red-700">
              <p>❌ Your backend is not properly connected.</p>
              <p className="mt-2">To fix this:</p>
              <ol className="list-decimal list-inside mt-2">
                <li>Deploy your backend to Render.com or Railway.app</li>
                <li>Get your backend URL (like https://nexify-backend.onrender.com)</li>
                <li>Update REACT_APP_API_URL in Netlify environment variables</li>
                <li>Redeploy with "Clear cache and deploy site"</li>
              </ol>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={checkBackend}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Recheck Connection
            </button>
            <p className="text-sm text-gray-600 mt-2">
              After updating environment variables, it may take 2-3 minutes for changes to propagate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;