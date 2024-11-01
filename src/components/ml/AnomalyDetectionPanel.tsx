import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export function AnomalyDetectionPanel() {
  const { performanceData } = useAnalytics();
  const [anomalies, setAnomalies] = useState<Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: number;
  }>>([
    {
      id: '1',
      type: 'performance',
      severity: 'medium',
      message: 'Unusual CPU spike detected',
      timestamp: Date.now() - 300000
    },
    {
      id: '2',
      type: 'behavior',
      severity: 'low',
      message: 'Abnormal user flow pattern',
      timestamp: Date.now() - 600000
    }
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">ML Insights</h2>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">AI-Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatusCard
          title="Anomaly Detection"
          status="active"
          description="Monitoring system behavior"
        />
        <StatusCard
          title="ML Model Status"
          status="training"
          description="Updating behavior patterns"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Recent Anomalies</h3>
        {anomalies.map((anomaly) => (
          <AnomalyAlert key={anomaly.id} {...anomaly} />
        ))}
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  status: 'active' | 'training' | 'inactive';
  description: string;
}

function StatusCard({ title, status, description }: StatusCardProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: 'bg-green-100 text-green-800',
    training: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface AnomalyAlertProps {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
}

function AnomalyAlert({ type, severity, message, timestamp }: AnomalyAlertProps) {
  const severityColors = {
    low: 'bg-blue-50 border-blue-100 text-blue-800',
    medium: 'bg-yellow-50 border-yellow-100 text-yellow-800',
    high: 'bg-red-50 border-red-100 text-red-800'
  };

  const timeAgo = new Date(timestamp).toLocaleTimeString();

  return (
    <div className={`p-4 border rounded-lg ${severityColors[severity]}`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{type}</span>
            <span className="text-xs">{timeAgo}</span>
          </div>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}