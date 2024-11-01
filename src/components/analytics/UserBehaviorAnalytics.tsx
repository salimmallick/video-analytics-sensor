import React, { useState, useEffect } from 'react';
import { Users, MousePointer, Timer, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export function UserBehaviorAnalytics() {
  const { track } = useAnalytics();
  const [metrics, setMetrics] = useState({
    clickRate: 0,
    sessionDuration: 0,
    bounceRate: 0,
    activeUsers: 0
  });

  useEffect(() => {
    const handleClick = () => {
      track('user_click', {
        timestamp: Date.now(),
        path: window.location.pathname
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [track]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">User Behavior</h2>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <BehaviorMetric
          icon={<MousePointer className="w-5 h-5" />}
          label="Click Rate"
          value="23 clicks/min"
          trend="up"
          change="+12%"
        />
        <BehaviorMetric
          icon={<Timer className="w-5 h-5" />}
          label="Avg. Session"
          value="5m 32s"
          trend="up"
          change="+8%"
        />
        <BehaviorMetric
          icon={<Users className="w-5 h-5" />}
          label="Active Users"
          value="1,234"
          trend="up"
          change="+15%"
        />
        <BehaviorMetric
          icon={<ArrowDownRight className="w-5 h-5" />}
          label="Bounce Rate"
          value="32%"
          trend="down"
          change="-5%"
        />
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            action="Page View"
            path="/dashboard"
            time="2m ago"
            user="User 123"
          />
          <ActivityItem
            action="Click"
            path="/analytics"
            time="5m ago"
            user="User 456"
          />
          <ActivityItem
            action="Form Submit"
            path="/contact"
            time="8m ago"
            user="User 789"
          />
        </div>
      </div>
    </div>
  );
}

interface BehaviorMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'up' | 'down';
  change: string;
}

function BehaviorMetric({ icon, label, value, trend, change }: BehaviorMetricProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">{icon}</span>
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <div className={`flex items-center ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span className="text-sm font-medium ml-1">{change}</span>
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  path: string;
  time: string;
  user: string;
}

function ActivityItem({ action, path, time, user }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-900">{action}</span>
        <span className="text-sm text-gray-500">{path}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500">{user}</span>
        <span className="text-sm text-gray-400">{time}</span>
      </div>
    </div>
  );
}