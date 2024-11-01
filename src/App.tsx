import React from 'react';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <AnalyticsProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </AnalyticsProvider>
  );
}

export default App;