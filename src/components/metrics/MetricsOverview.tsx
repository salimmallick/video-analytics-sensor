import React from 'react';
import { Users, Cpu, Activity, Network, ArrowUp, ArrowDown } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export function MetricsOverview() {
  const { performanceData } = useAnalytics();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Active Users"
        value="1,234"
        change="+12.3%"
        icon={<Users className="w-6 h-6" />}
        trend="up"
        color="blue"
        subtitle="vs last week"
      />
      <MetricCard
        title="CPU Usage"
        value={`${performanceData?.cpu.toFixed(1)}%`}
        change="-5.2%"
        icon={<Cpu className="w-6 h-6" />}
        trend="down"
        color="green"
        subtitle="vs last hour"
      />
      <MetricCard
        title="Network Latency"
        value={`${performanceData?.network.latency.toFixed(0)}ms`}
        change="+2.1%"
        icon={<Network className="w-6 h-6" />}
        trend="up"
        color="purple"
        subtitle="vs last hour"
      />
      <MetricCard
        title="User Engagement"
        value="78%"
        change="+8.4%"
        icon={<Activity className="w-6 h-6" />}
        trend="up"
        color="indigo"
        subtitle="vs last month"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  color: 'blue' | 'green' | 'purple' | 'indigo';
}

function MetricCard({ title, subtitle, value, change, icon, trend, color }: MetricCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        </div>
        <div className="flex items-center">
          {trend === 'up' ? (
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
          <span className="text-sm text-gray-500 ml-1.5">{subtitle}</span>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${
          color === 'blue'
            ? 'bg-blue-500'
            : color === 'green'
            ? 'bg-green-500'
            : color === 'purple'
            ? 'bg-purple-500'
            : 'bg-indigo-500'
        }`}
      />
    </div>
  );
}