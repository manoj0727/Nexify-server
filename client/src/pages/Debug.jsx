import React from 'react';

const Debug = () => {
  const envVars = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_DEMO_EMAIL: process.env.REACT_APP_DEMO_EMAIL,
    REACT_APP_DEMO_PASSWORD: process.env.REACT_APP_DEMO_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Environment Variables Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Environment Variables:</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-mono font-semibold text-blue-600 w-1/3">{key}:</span>
                <span className={`font-mono ${value ? 'text-green-600' : 'text-red-600'}`}>
                  {value || 'NOT SET'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Demo Button Visibility Check:</h2>
          <div className="space-y-2">
            <p>Demo Email Set: <span className={process.env.REACT_APP_DEMO_EMAIL ? 'text-green-600' : 'text-red-600'}>
              {process.env.REACT_APP_DEMO_EMAIL ? 'YES' : 'NO'}
            </span></p>
            <p>Demo Password Set: <span className={process.env.REACT_APP_DEMO_PASSWORD ? 'text-green-600' : 'text-red-600'}>
              {process.env.REACT_APP_DEMO_PASSWORD ? 'YES' : 'NO'}
            </span></p>
            <p>Should Show Demo Button: <span className={
              process.env.REACT_APP_DEMO_EMAIL && process.env.REACT_APP_DEMO_PASSWORD ? 'text-green-600' : 'text-red-600'
            }>
              {process.env.REACT_APP_DEMO_EMAIL && process.env.REACT_APP_DEMO_PASSWORD ? 'YES' : 'NO'}
            </span></p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>If variables show "NOT SET", they weren't included in the build</li>
            <li>In Netlify, go to Site settings → Environment variables</li>
            <li>Add each missing variable</li>
            <li>Important: After adding variables, you must trigger a new deploy</li>
            <li>Go to Deploys → Trigger deploy → Clear cache and deploy site</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Debug;