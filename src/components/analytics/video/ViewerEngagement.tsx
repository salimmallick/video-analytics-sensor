import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { 
  Users, 
  Clock, 
  Repeat, 
  ArrowUpRight, 
  ArrowDownRight,
  Play,
  BarChart2,
  Target,
  Map,
  Activity,
  Heart
} from 'lucide-react';
import { useAnalytics } from '../../../context/AnalyticsContext';

export function ViewerEngagement() {
  const { videoData } = useAnalytics();
  const watchTimeChartRef = useRef<HTMLDivElement>(null);
  const retentionChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (watchTimeChartRef.current) {
      const chart = createChart(watchTimeChartRef.current, {
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

      // Sample watch time data
      series.setData([
        { time: '2024-01-01', value: 25 },
        { time: '2024-01-02', value: 28 },
        { time: '2024-01-03', value: 32 }
      ]);

      return () => chart.remove();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average Watch Time"
          value="24.5 min"
          trend="+15%"
          icon={<Clock />}
          description="Per session duration"
        />
        <MetricCard
          title="Completion Rate"
          value="78%"
          trend="+8%"
          icon={<Target />}
          description="Full video views"
        />
        <MetricCard
          title="Replay Rate"
          value="12%"
          trend="+5%"
          icon={<Repeat />}
          description="Content replays"
        />
        <MetricCard
          title="Active Viewers"
          value="45.2K"
          trend="+22%"
          icon={<Users />}
          description="Current viewers"
        />
      </div>

      {/* Watch Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Watch Time Trends</h3>
              <p className="text-sm text-gray-500">Viewing duration patterns</p>
            </div>
            <select className="text-sm border-gray-300 rounded-lg">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div ref={watchTimeChartRef} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Audience Retention</h3>
              <p className="text-sm text-gray-500">Viewer retention curve</p>
            </div>
          </div>
          <div className="space-y-4">
            <RetentionSegment percentage={100} position={0} label="Start" />
            <RetentionSegment percentage={85} position={25} label="25%" />
            <RetentionSegment percentage={72} position={50} label="50%" />
            <RetentionSegment percentage={65} position={75} label="75%" />
            <RetentionSegment percentage={58} position={100} label="End" />
          </div>
        </div>
      </div>

      {/* Engagement Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewerInteractions />
        <PeakViewingTimes />
      </div>

      {/* Geographic Distribution */}
      <ViewerGeography />

      {/* Content Performance */}
      <ContentEngagement />

      {/* Audience Insights */}
      <AudienceInsights />
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

interface RetentionSegmentProps {
  percentage: number;
  position: number;
  label: string;
}

function RetentionSegment({ percentage, position, label }: RetentionSegmentProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{percentage}% retained</span>
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

function ViewerInteractions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Viewer Interactions</h3>
          <p className="text-sm text-gray-500">User engagement actions</p>
        </div>
      </div>
      <div className="space-y-4">
        <InteractionMetric 
          type="Likes"
          count="12.5K"
          trend="+18%"
          icon={<Heart className="w-5 h-5" />}
        />
        <InteractionMetric 
          type="Shares"
          count="3.2K"
          trend="+25%"
          icon={<Activity className="w-5 h-5" />}
        />
        <InteractionMetric 
          type="Comments"
          count="824"
          trend="+12%"
          icon={<BarChart2 className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}

function InteractionMetric({ type, count, trend, icon }: { type: string; count: string; trend: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="p-2 bg-white rounded-lg text-blue-600">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{type}</p>
          <p className="text-lg font-semibold text-gray-900">{count}</p>
        </div>
      </div>
      <span className="text-sm text-green-600">{trend}</span>
    </div>
  );
}

function PeakViewingTimes() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Peak Viewing Times</h3>
          <p className="text-sm text-gray-500">Most active viewing periods</p>
        </div>
      </div>
      <div className="space-y-4">
        <TimeBlock time="18:00 - 22:00" viewers="32.5K" percentage={85} />
        <TimeBlock time="12:00 - 18:00" viewers="24.2K" percentage={65} />
        <TimeBlock time="06:00 - 12:00" viewers="18.8K" percentage={45} />
        <TimeBlock time="00:00 - 06:00" viewers="8.5K" percentage={25} />
      </div>
    </div>
  );
}

function TimeBlock({ time, viewers, percentage }: { time: string; viewers: string; percentage: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{time}</span>
        <span className="text-gray-600">{viewers} viewers</span>
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

function ViewerGeography() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
          <p className="text-sm text-gray-500">Viewer locations and engagement</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <RegionMetric 
            region="North America"
            viewers="25.5K"
            engagement="High"
            percentage={85}
          />
          <RegionMetric 
            region="Europe"
            viewers="18.2K"
            engagement="Medium"
            percentage={65}
          />
          <RegionMetric 
            region="Asia Pacific"
            viewers="12.8K"
            engagement="High"
            percentage={45}
          />
        </div>
        <div className="flex items-center justify-center">
          <Map className="w-48 h-48 text-blue-500 opacity-50" />
        </div>
      </div>
    </div>
  );
}

function RegionMetric({ region, viewers, engagement, percentage }: { region: string; viewers: string; engagement: string; percentage: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{region}</span>
        <span className="text-gray-600">{viewers} viewers</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        Engagement: <span className="font-medium">{engagement}</span>
      </div>
    </div>
  );
}

function ContentEngagement() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Content Performance</h3>
          <p className="text-sm text-gray-500">Engagement by content type</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ContentTypeCard 
          type="Short Form"
          metrics={{
            avgWatchTime: "2.8 min",
            completionRate: "92%",
            engagement: "High"
          }}
        />
        <ContentTypeCard 
          type="Mid Length"
          metrics={{
            avgWatchTime: "12.5 min",
            completionRate: "78%",
            engagement: "Medium"
          }}
        />
        <ContentTypeCard 
          type="Long Form"
          metrics={{
            avgWatchTime: "45.2 min",
            completionRate: "65%",
            engagement: "High"
          }}
        />
      </div>
    </div>
  );
}

function ContentTypeCard({ type, metrics }: { type: string; metrics: any }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{type}</h4>
        <Play className="w-5 h-5 text-blue-500" />
      </div>
      <div className="space-y-2">
        <MetricRow label="Avg. Watch Time" value={metrics.avgWatchTime} />
        <MetricRow label="Completion Rate" value={metrics.completionRate} />
        <MetricRow label="Engagement" value={metrics.engagement} />
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

function AudienceInsights() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Audience Insights</h3>
          <p className="text-sm text-gray-500">Viewer behavior patterns</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InsightCard 
            title="Peak Engagement"
            description="Highest viewer interaction occurs during evening hours (18:00-22:00)"
            impact="High"
          />
          <InsightCard 
            title="Content Length"
            description="10-15 minute videos show optimal completion rates"
            impact="Medium"
          />
        </div>
        <div className="space-y-4">
          <InsightCard 
            title="Device Preference"
            description="Mobile viewing increased by 25% in the last month"
            impact="High"
          />
          <InsightCard 
            title="Retention Pattern"
            description="First 30 seconds crucial for viewer retention"
            impact="High"
          />
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, description, impact }: { title: string; description: string; impact: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${
          impact === 'High' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {impact} Impact
        </span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}