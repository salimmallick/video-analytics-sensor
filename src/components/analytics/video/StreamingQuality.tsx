import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { 
  Wifi, 
  Zap, 
  BarChart2, 
  ArrowUpRight, 
  ArrowDownRight,
  Server,
  Signal,
  Radio,
  Globe,
  MapPin,
  Activity,
  Network,
  RefreshCw
} from 'lucide-react';
import { useAnalytics } from '../../../context/AnalyticsContext';

interface RegionFilter {
  country: string;
  state: string;
  city: string;
}

export function StreamingQuality() {
  const { videoData } = useAnalytics();
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>({
    country: 'All Countries',
    state: 'All States',
    city: 'All Cities'
  });
  const bitrateChartRef = useRef<HTMLDivElement>(null);
  const qualityChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bitrateChartRef.current) {
      const chart = createChart(bitrateChartRef.current, {
        height: 300,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#334155'
        }
      });

      const series = chart.addAreaSeries({
        lineColor: '#3b82f6',
        topColor: 'rgba(59, 130, 246, 0.2)',
        bottomColor: 'rgba(59, 130, 246, 0.0)'
      });

      // Sample data
      series.setData([
        { time: '2024-01-01', value: 4.2 },
        { time: '2024-01-02', value: 4.5 },
        { time: '2024-01-03', value: 4.8 }
      ]);

      return () => chart.remove();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average Bitrate"
          value="4.8 Mbps"
          trend="+12%"
          icon={<Signal />}
          description="Overall streaming quality"
        />
        <MetricCard
          title="CDN Latency"
          value="48ms"
          trend="-15%"
          icon={<Server />}
          description="Content delivery speed"
        />
        <MetricCard
          title="Throughput"
          value="12.4 Mbps"
          trend="+8%"
          icon={<Activity />}
          description="Network capacity"
        />
        <MetricCard
          title="Quality Switches"
          value="2.3/session"
          trend="-25%"
          icon={<RefreshCw />}
          description="Adaptive streaming changes"
        />
      </div>

      {/* Region Selector */}
      <RegionSelector selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />

      {/* Regional Performance Overview */}
      <RegionalPerformance />

      {/* Detailed Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BitrateDistribution chartRef={bitrateChartRef} />
        <QualityTransitions chartRef={qualityChartRef} />
      </div>

      {/* Network Analysis */}
      <NetworkAnalysis />

      {/* CDN Performance */}
      <CDNPerformance />

      {/* Streaming Health */}
      <StreamingHealth />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  description: string;
}

function MetricCard({ title, value, trend, icon, description }: MetricCardProps) {
  const trendIsPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</span>
        <div className={`flex items-center ${trendIsPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trendIsPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span className="text-sm font-medium ml-1">{trend}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function RegionSelector({ selectedRegion, setSelectedRegion }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Regional Filter</h3>
        </div>
        <button 
          onClick={() => setSelectedRegion({
            country: 'All Countries',
            state: 'All States',
            city: 'All Cities'
          })}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset Filter
        </button>
      </div>
      {/* Region selection controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select 
            className="w-full border-gray-300 rounded-lg text-sm"
            value={selectedRegion.country}
            onChange={(e) => setSelectedRegion(prev => ({
              ...prev,
              country: e.target.value,
              state: 'All States',
              city: 'All Cities'
            }))}
          >
            <option>All Countries</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Japan</option>
            <option>India</option>
          </select>
        </div>
        {/* State selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
          <select 
            className="w-full border-gray-300 rounded-lg text-sm"
            value={selectedRegion.state}
            onChange={(e) => setSelectedRegion(prev => ({
              ...prev,
              state: e.target.value,
              city: 'All Cities'
            }))}
            disabled={selectedRegion.country === 'All Countries'}
          >
            <option>All States</option>
            <option>California</option>
            <option>New York</option>
            <option>Texas</option>
            <option>Florida</option>
          </select>
        </div>
        {/* City selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select 
            className="w-full border-gray-300 rounded-lg text-sm"
            value={selectedRegion.city}
            onChange={(e) => setSelectedRegion(prev => ({
              ...prev,
              city: e.target.value
            }))}
            disabled={selectedRegion.state === 'All States'}
          >
            <option>All Cities</option>
            <option>San Francisco</option>
            <option>Los Angeles</option>
            <option>New York City</option>
            <option>Miami</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function RegionalPerformance() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
          <p className="text-sm text-gray-500">Quality metrics by region</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionalMetrics title="Average Bitrate" unit="Mbps" />
        <RegionalMetrics title="Buffer Ratio" unit="%" inverse />
      </div>
    </div>
  );
}

function RegionalMetrics({ title, unit, inverse = false }: { title: string; unit: string; inverse?: boolean }) {
  const metrics = [
    { region: "North America", value: 4.8, trend: "+5%" },
    { region: "Europe", value: 4.2, trend: "+3%" },
    { region: "Asia Pacific", value: 3.8, trend: "+7%" }
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      {metrics.map((metric, index) => (
        <RegionalMetricBar 
          key={index}
          {...metric}
          unit={unit}
          maxValue={10}
          inverse={inverse}
        />
      ))}
    </div>
  );
}

function RegionalMetricBar({ region, value, maxValue, unit, trend, inverse = false }: any) {
  const percentage = (value / maxValue) * 100;
  const trendIsPositive = trend.startsWith('+');
  const isGood = inverse ? !trendIsPositive : trendIsPositive;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{region}</span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-900">{value}{unit}</span>
          <span className={`flex items-center ${isGood ? 'text-green-600' : 'text-red-600'}`}>
            {trendIsPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${inverse ? 'bg-red-500' : 'bg-green-500'} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function BitrateDistribution({ chartRef }: { chartRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bitrate Distribution</h3>
          <p className="text-sm text-gray-500">Bitrate changes over time</p>
        </div>
        <select className="text-sm border-gray-300 rounded-lg">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <div ref={chartRef} />
    </div>
  );
}

function QualityTransitions({ chartRef }: { chartRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quality Transitions</h3>
          <p className="text-sm text-gray-500">Resolution switches analysis</p>
        </div>
      </div>
      <div className="space-y-4">
        <QualityBar quality="4K" percentage={45} count="450k streams" />
        <QualityBar quality="1080p" percentage={35} count="350k streams" />
        <QualityBar quality="720p" percentage={15} count="150k streams" />
        <QualityBar quality="480p" percentage={5} count="50k streams" />
      </div>
    </div>
  );
}

function QualityBar({ quality, percentage, count }: { quality: string; percentage: number; count: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{quality}</span>
        <span className="text-gray-600">{count}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function NetworkAnalysis() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Network Analysis</h3>
          <p className="text-sm text-gray-500">Performance by network type</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NetworkTypeCard 
          type="5G"
          avgBitrate="8.2 Mbps"
          stability="98%"
          latency="12ms"
        />
        <NetworkTypeCard 
          type="4G"
          avgBitrate="4.5 Mbps"
          stability="95%"
          latency="35ms"
        />
        <NetworkTypeCard 
          type="WiFi"
          avgBitrate="6.8 Mbps"
          stability="92%"
          latency="25ms"
        />
      </div>
    </div>
  );
}

function NetworkTypeCard({ type, avgBitrate, stability, latency }: { type: string; avgBitrate: string; stability: string; latency: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{type}</h4>
        <Network className="w-5 h-5 text-blue-500" />
      </div>
      <div className="space-y-2">
        <MetricRow label="Avg. Bitrate" value={avgBitrate} />
        <MetricRow label="Stability" value={stability} />
        <MetricRow label="Latency" value={latency} />
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CDNMetricsCard 
          name="Akamai"
          metrics={{
            latency: "48ms",
            throughput: "12.4 Mbps",
            availability: "99.99%",
            requests: "1.2M"
          }}
        />
        <CDNMetricsCard 
          name="Cloudfront"
          metrics={{
            latency: "52ms",
            throughput: "11.8 Mbps",
            availability: "99.95%",
            requests: "0.8M"
          }}
        />
        <CDNMetricsCard 
          name="Fastly"
          metrics={{
            latency: "45ms",
            throughput: "13.2 Mbps",
            availability: "99.98%",
            requests: "1.0M"
          }}
        />
      </div>
    </div>
  );
}

function CDNMetricsCard({ name, metrics }: { name: string; metrics: any }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
        <Server className="w-5 h-5 text-blue-500" />
      </div>
      <div className="space-y-2">
        <MetricRow label="Latency" value={metrics.latency} />
        <MetricRow label="Throughput" value={metrics.throughput} />
        <MetricRow label="Availability" value={metrics.availability} />
        <MetricRow label="Requests" value={metrics.requests} />
      </div>
    </div>
  );
}

function StreamingHealth() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Streaming Health</h3>
          <p className="text-sm text-gray-500">Overall system performance</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HealthMetricCard 
          title="Stream Stability"
          value="98.5%"
          trend="+2.3%"
          status="good"
        />
        <HealthMetricCard 
          title="Delivery Efficiency"
          value="96.8%"
          trend="+1.5%"
          status="good"
        />
        <HealthMetricCard 
          title="Network Resilience"
          value="99.2%"
          trend="+0.8%"
          status="good"
        />
      </div>
    </div>
  );
}

function HealthMetricCard({ title, value, trend, status }: { title: string; value: string; trend: string; status: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 mb-2">{title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`flex items-center text-sm ${status === 'good' ? 'text-green-600' : 'text-red-600'}`}>
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {trend}
        </span>
      </div>
    </div>
  );
}