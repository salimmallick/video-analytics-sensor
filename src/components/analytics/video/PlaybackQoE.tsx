import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { 
  Play, 
  Wifi, 
  AlertTriangle, 
  Clock, 
  Zap, 
  BarChart2, 
  Globe, 
  Monitor,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAnalytics } from '../../../context/AnalyticsContext';

export function PlaybackQoE() {
  const { videoData } = useAnalytics();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QoEMetricCard
          title="Startup Time"
          value="1.2s"
          trend="-8%"
          status="good"
          icon={<Clock />}
          description="Time to first frame"
        />
        <QoEMetricCard
          title="Buffer Ratio"
          value="0.4%"
          trend="-12%"
          status="good"
          icon={<Play />}
          description="Time spent buffering"
        />
        <QoEMetricCard
          title="Error Rate"
          value="0.8%"
          trend="+0.3%"
          status="warning"
          icon={<AlertTriangle />}
          description="Playback failures"
        />
        <QoEMetricCard
          title="Bitrate"
          value="4.2 Mbps"
          trend="+15%"
          status="good"
          icon={<Wifi />}
          description="Average bitrate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BufferingAnalysis />
        <ErrorAnalysis />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StartupTimeDistribution />
        <CDNPerformance />
      </div>

      <QualityTransitions />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionalPerformance />
        <DeviceImpact />
      </div>
    </div>
  );
}

interface QoEMetricCardProps {
  title: string;
  value: string;
  trend: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  description: string;
}

function QoEMetricCard({ title, value, trend, status, icon, description }: QoEMetricCardProps) {
  const statusColors = {
    good: 'bg-green-50 text-green-700 border-green-100',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    critical: 'bg-red-50 text-red-700 border-red-100'
  };

  const trendIsPositive = trend.startsWith('-');
  const isGoodTrend = (status === 'good') === trendIsPositive;

  return (
    <div className={`p-4 rounded-lg border ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="p-2 rounded-lg bg-white/50">{icon}</span>
        <div className={`flex items-center ${isGoodTrend ? 'text-green-600' : 'text-red-600'}`}>
          {isGoodTrend ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="text-sm font-medium ml-1">{trend}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs opacity-80">{description}</p>
    </div>
  );
}

function BufferingAnalysis() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = createChart(chartRef.current, {
        height: 300,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#334155'
        }
      });

      // Add buffering data series
      const series = chart.addAreaSeries({
        lineColor: '#3b82f6',
        topColor: 'rgba(59, 130, 246, 0.2)',
        bottomColor: 'rgba(59, 130, 246, 0.0)'
      });

      // Sample data
      series.setData([
        { time: '2024-01-01', value: 0.8 },
        { time: '2024-01-02', value: 0.5 },
        { time: '2024-01-03', value: 0.3 }
      ]);

      return () => chart.remove();
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Buffering Analysis</h3>
          <p className="text-sm text-gray-500">Buffer events over time</p>
        </div>
        <select className="text-sm border-gray-300 rounded-lg">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <div ref={chartRef} />
      <div className="mt-4 grid grid-cols-3 gap-4">
        <BufferingStat label="Peak Buffer Time" value="2.3s" />
        <BufferingStat label="Recovery Time" value="0.8s" />
        <BufferingStat label="Buffer Free Sessions" value="94%" />
      </div>
    </div>
  );
}

function BufferingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ErrorAnalysis() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Error Analysis</h3>
          <p className="text-sm text-gray-500">Playback error distribution</p>
        </div>
      </div>
      <div className="space-y-4">
        <ErrorTypeBar 
          type="Network Error"
          count={245}
          percentage={42}
          color="bg-red-500"
        />
        <ErrorTypeBar 
          type="Media Error"
          count={156}
          percentage={27}
          color="bg-yellow-500"
        />
        <ErrorTypeBar 
          type="DRM Error"
          count={89}
          percentage={15}
          color="bg-orange-500"
        />
        <ErrorTypeBar 
          type="Player Error"
          count={67}
          percentage={11}
          color="bg-blue-500"
        />
        <ErrorTypeBar 
          type="Other"
          count={28}
          percentage={5}
          color="bg-gray-500"
        />
      </div>
    </div>
  );
}

function ErrorTypeBar({ type, count, percentage, color }: { type: string; count: number; percentage: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{type}</span>
        <span className="text-gray-900 font-medium">{count} errors</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StartupTimeDistribution() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Startup Time Distribution</h3>
          <p className="text-sm text-gray-500">Time to first frame analysis</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StartupMetric range="0-2s" percentage={45} status="good" />
          <StartupMetric range="2-4s" percentage={30} status="good" />
          <StartupMetric range="4-6s" percentage={15} status="warning" />
          <StartupMetric range=">6s" percentage={10} status="critical" />
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Optimization Opportunity</h4>
          <p className="text-sm text-blue-800">25% of sessions have startup times over 4s. Consider implementing preload for popular content and optimizing initial manifest request.</p>
        </div>
      </div>
    </div>
  );
}

function StartupMetric({ range, percentage, status }: { range: string; percentage: number; status: 'good' | 'warning' | 'critical' }) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-1">{range}</p>
      <p className={`text-lg font-semibold ${statusColors[status]}`}>{percentage}%</p>
    </div>
  );
}

function CDNPerformance() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">CDN Performance</h3>
          <p className="text-sm text-gray-500">Content delivery metrics</p>
        </div>
      </div>
      <div className="space-y-4">
        <CDNMetric 
          name="Akamai"
          latency={82}
          throughput={15.4}
          availability={99.9}
        />
        <CDNMetric 
          name="Cloudfront"
          latency={95}
          throughput={14.2}
          availability={99.8}
        />
        <CDNMetric 
          name="Fastly"
          latency={88}
          throughput={14.8}
          availability={99.7}
        />
      </div>
    </div>
  );
}

function CDNMetric({ name, latency, throughput, availability }: { name: string; latency: number; throughput: number; availability: number }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{name}</span>
        <span className="text-sm text-green-600">{availability}% up</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Latency</p>
          <p className="text-lg font-semibold text-gray-900">{latency}ms</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Throughput</p>
          <p className="text-lg font-semibold text-gray-900">{throughput} Mbps</p>
        </div>
      </div>
    </div>
  );
}

function QualityTransitions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quality Transitions</h3>
          <p className="text-sm text-gray-500">Adaptive bitrate behavior</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <QualityMetric 
            label="Avg. Switches"
            value="4.2"
            subtext="per session"
          />
          <QualityMetric 
            label="Switch Time"
            value="380ms"
            subtext="average"
          />
          <QualityMetric 
            label="Stable Quality"
            value="86%"
            subtext="of sessions"
          />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Quality Ladder Distribution</h4>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: '40%' }} />
            <div className="h-full bg-blue-500" style={{ width: '30%' }} />
            <div className="h-full bg-yellow-500" style={{ width: '20%' }} />
            <div className="h-full bg-red-500" style={{ width: '10%' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>4K (40%)</span>
            <span>1080p (30%)</span>
            <span>720p (20%)</span>
            <span>≤480p (10%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QualityMetric({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  );
}

function RegionalPerformance() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
          <p className="text-sm text-gray-500">Geographic QoE analysis</p>
        </div>
      </div>
      <div className="space-y-4">
        <RegionMetric 
          region="North America"
          startupTime={1.2}
          bufferRatio={0.3}
          errorRate={0.5}
        />
        <RegionMetric 
          region="Europe"
          startupTime={1.4}
          bufferRatio={0.4}
          errorRate={0.6}
        />
        <RegionMetric 
          region="Asia Pacific"
          startupTime={1.8}
          bufferRatio={0.7}
          errorRate={0.9}
        />
      </div>
    </div>
  );
}

function RegionMetric({ region, startupTime, bufferRatio, errorRate }: { region: string; startupTime: number; bufferRatio: number; errorRate: number }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{region}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Startup</p>
          <p className="text-base font-semibold text-gray-900">{startupTime}s</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Buffer</p>
          <p className="text-base font-semibold text-gray-900">{bufferRatio}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Errors</p>
          <p className="text-base font-semibold text-gray-900">{errorRate}%</p>
        </div>
      </div>
    </div>
  );
}

function DeviceImpact() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Device Impact</h3>
          <p className="text-sm text-gray-500">Performance by device type</p>
        </div>
      </div>
      <div className="space-y-4">
        <DeviceMetric 
          type="Smart TV"
          score={92}
          issues={["High memory usage", "Slow startup"]}
        />
        <DeviceMetric 
          type="Mobile Devices"
          score={88}
          issues={["Network transitions", "Battery drain"]}
        />
        <DeviceMetric 
          type="Web Browsers"
          score={95}
          issues={["Codec support", "DRM issues"]}
        />
      </div>
    </div>
  );
}

function DeviceMetric({ type, score, issues }: { type: string; score: number; issues: string[] }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{type}</span>
        <span className={`text-sm font-medium ${
          score >= 90 ? 'text-green-600' : score >= 80 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          Score: {score}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-600">Top Issues:</p>
        <ul className="text-sm text-gray-800 mt-1">
          {issues.map((issue, index) => (
            <li key={index} className="flex items-center">
              <AlertTriangle className="w-3 h-3 text-yellow-500 mr-1" />
              {issue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}