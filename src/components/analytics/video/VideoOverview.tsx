import React from 'react';
import { Activity, TrendingUp, Users, Lightbulb, AlertTriangle, ArrowUpRight, ArrowDownRight, Zap, Target, Play, Signal, Clock, BarChart2 } from 'lucide-react';

export function VideoOverview() {
  return (
    <div className="space-y-6">
      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Playback QoE</h3>
            <Activity className="text-blue-500 w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">98.5%</div>
            <p className="text-sm text-gray-500 mt-1">Success rate</p>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>2.3% vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Streaming Quality</h3>
            <Signal className="text-purple-500 w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">4.8 Mbps</div>
            <p className="text-sm text-gray-500 mt-1">Avg. bitrate</p>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>12% vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Viewer Engagement</h3>
            <Users className="text-green-500 w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">24.5min</div>
            <p className="text-sm text-gray-500 mt-1">Avg. watch time</p>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>5.7% vs last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Content Performance</h3>
            <Play className="text-indigo-500 w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gray-900">2.4M</div>
            <p className="text-sm text-gray-500 mt-1">Total views</p>
          </div>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>15% vs last week</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
            <BarChart2 className="text-blue-500 w-5 h-5" />
          </div>
          <div className="space-y-4">
            <QuickStat 
              label="Buffer Ratio"
              value="0.4%"
              trend="-12%"
              isGood={true}
            />
            <QuickStat 
              label="Error Rate"
              value="0.8%"
              trend="+0.3%"
              isGood={false}
            />
            <QuickStat 
              label="CDN Latency"
              value="48ms"
              trend="-15%"
              isGood={true}
            />
          </div>
        </div>

        {/* AI Insights - Keeping as you like it */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-800">AI Insights</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Root cause analysis and recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            <InsightCard
              type="critical"
              title="CDN Performance Impact"
              description="High latency detected in Asia region affecting startup times. Consider multi-CDN strategy."
              metric="32% slower"
              recommendation="Implement CDN load balancing"
            />
            <InsightCard
              type="warning"
              title="Quality Switches"
              description="Frequent quality switches detected during peak hours, affecting user experience."
              metric="15% increase"
              recommendation="Optimize ABR logic"
            />
            <InsightCard
              type="success"
              title="Buffer Management"
              description="Buffer strategy improvements showing positive results in reducing stalls."
              metric="45% reduction"
              recommendation="Continue monitoring"
            />
          </div>
        </div>

        {/* Focus Areas - Keeping as you like it */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">Focus Areas</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">AI-identified improvement opportunities</p>
            </div>
          </div>

          <div className="space-y-4">
            <FocusArea
              title="Startup Time Optimization"
              progress={65}
              impact="High"
              description="Preload optimization can improve startup time by 40%"
            />
            <FocusArea
              title="Error Recovery"
              progress={82}
              impact="Medium"
              description="Implement smart retry logic for network errors"
            />
            <FocusArea
              title="Quality Selection"
              progress={91}
              impact="Low"
              description="Fine-tune ABR algorithm for better stability"
            />
          </div>
        </div>
      </div>

      {/* Real-time Anomalies - Keeping as you like it */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Real-time Anomalies</h3>
            <p className="text-sm text-gray-500 mt-1">AI-detected issues requiring attention</p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            3 active alerts
          </span>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Increased Buffer Ratio",
              time: "2 min ago",
              severity: "high",
              description: "Buffer ratio spike detected in EU region",
              impact: "Affecting 15% of sessions"
            },
            {
              title: "CDN Latency",
              time: "5 min ago",
              severity: "medium",
              description: "Elevated latency in Asia-Pacific CDN",
              impact: "Affecting 8% of users"
            },
            {
              title: "Quality Switches",
              time: "15 min ago",
              severity: "low",
              description: "Unusual quality switching pattern detected",
              impact: "Affecting 5% of sessions"
            }
          ].map((anomaly, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                anomaly.severity === 'high' ? 'bg-red-100' :
                anomaly.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  anomaly.severity === 'high' ? 'text-red-600' :
                  anomaly.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{anomaly.title}</h4>
                  <span className="text-xs text-gray-500">{anomaly.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                <p className="text-xs text-gray-500 mt-1">{anomaly.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function QuickStat({ label, value, trend, isGood }: { label: string; value: string; trend: string; isGood: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-900">{value}</span>
        <span className={`flex items-center text-sm ${isGood ? 'text-green-600' : 'text-red-600'}`}>
          {isGood ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trend}
        </span>
      </div>
    </div>
  );
}

// Existing Components (InsightCard, FocusArea) remain the same
interface InsightCardProps {
  type: 'critical' | 'warning' | 'success';
  title: string;
  description: string;
  metric: string;
  recommendation: string;
}

function InsightCard({ type, title, description, metric, recommendation }: InsightCardProps) {
  const typeStyles = {
    critical: 'bg-red-50 border-red-100',
    warning: 'bg-yellow-50 border-yellow-100',
    success: 'bg-green-50 border-green-100'
  };

  return (
    <div className={`p-4 rounded-lg border ${typeStyles[type]}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <span className="text-sm font-medium text-gray-700">{metric}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex items-center text-sm">
        <Zap className="w-4 h-4 mr-1 text-blue-500" />
        <span className="text-blue-700">{recommendation}</span>
      </div>
    </div>
  );
}

interface FocusAreaProps {
  title: string;
  progress: number;
  impact: string;
  description: string;
}

function FocusArea({ title, progress, impact, description }: FocusAreaProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${
          impact === 'High' ? 'bg-red-100 text-red-800' :
          impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {impact} Impact
        </span>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-gray-600">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-gray-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          />
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}