import React from 'react';
import { AppSelector } from './AppSelector';
import { MetricsOverview } from './metrics/MetricsOverview';
import { PerformanceChart } from './charts/PerformanceChart';
import { UserBehaviorAnalytics } from './analytics/UserBehaviorAnalytics';
import { AnomalyDetectionPanel } from './ml/AnomalyDetectionPanel';
import { ProductAnalytics } from './analytics/ProductAnalytics';
import { VideoAnalytics } from './analytics/VideoAnalytics';
import { DateRangePicker } from './DateRangePicker';
import { useAnalytics } from '../context/AnalyticsContext';

export function Dashboard() {
  const { activeSection } = useAnalytics();

  const handleDateRangeChange = (range: { start: Date; end: Date }) => {
    // Update analytics data based on selected date range
    console.log('Selected date range:', range);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <MetricsOverview />
            <div className="grid grid-cols-1 gap-6 mt-6">
              <PerformanceChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <UserBehaviorAnalytics />
              <AnomalyDetectionPanel />
            </div>
          </>
        );
      case 'product-analytics':
        return <ProductAnalytics />;
      case 'video-analytics':
        return <VideoAnalytics />;
      default:
        return <MetricsOverview />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time insights and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <DateRangePicker onChange={handleDateRangeChange} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <AppSelector />
      {renderContent()}
    </div>
  );
}