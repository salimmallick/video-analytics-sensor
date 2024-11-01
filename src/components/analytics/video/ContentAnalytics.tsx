import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { 
  Film, 
  TrendingUp, 
  Users, 
  Clock, 
  Play,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Globe,
  Monitor,
  Smartphone,
  Tv,
  Award
} from 'lucide-react';
import { useAnalytics } from '../../../context/AnalyticsContext';

export function ContentAnalytics() {
  const { videoData } = useAnalytics();
  const viewershipChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewershipChartRef.current) {
      const chart = createChart(viewershipChartRef.current, {
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

      // Sample viewership data
      series.setData([
        { time: '2024-01-01', value: 15000 },
        { time: '2024-01-02', value: 18000 },
        { time: '2024-01-03', value: 22000 }
      ]);

      return () => chart.remove();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Content Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value="2.4M"
          trend="+15%"
          icon={<Play />}
          description="Last 30 days"
        />
        <MetricCard
          title="Avg. Watch Duration"
          value="18.5 min"
          trend="+8%"
          icon={<Clock />}
          description="Per video"
        />
        <MetricCard
          title="Engagement Rate"
          value="72%"
          trend="+5%"
          icon={<Users />}
          description="User interaction"
        />
        <MetricCard
          title="Content Score"
          value="8.4"
          trend="+12%"
          icon={<Award />}
          description="Quality rating"
        />
      </div>

      {/* Content Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewershipTrends chartRef={viewershipChartRef} />
        <ContentCategories />
      </div>

      {/* Popular Content */}
      <TopPerformingContent />

      {/* Device & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceDistribution />
        <GeographicDistribution />
      </div>

      {/* Content Insights */}
      <ContentInsights />

      {/* Recommendations */}
      <OptimizationRecommendations />
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

function ViewershipTrends({ chartRef }: { chartRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Viewership Trends</h3>
          <p className="text-sm text-gray-500">Daily viewing patterns</p>
        </div>
        <select className="text-sm border-gray-300 rounded-lg">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div ref={chartRef} />
    </div>
  );
}

function ContentCategories() {
  const categories = [
    { name: "Entertainment", percentage: 35, trend: "+8%" },
    { name: "Education", percentage: 25, trend: "+15%" },
    { name: "Sports", percentage: 20, trend: "+5%" },
    { name: "News", percentage: 15, trend: "-2%" },
    { name: "Others", percentage: 5, trend: "+1%" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Content Categories</h3>
          <p className="text-sm text-gray-500">Distribution by genre</p>
        </div>
      </div>
      <div className="space-y-4">
        {categories.map((category, index) => (
          <CategoryBar key={index} {...category} />
        ))}
      </div>
    </div>
  );
}

function CategoryBar({ name, percentage, trend }: { name: string; percentage: number; trend: string }) {
  const trendIsPositive = trend.startsWith('+');

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{name}</span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{percentage}%</span>
          <span className={trendIsPositive ? 'text-green-600' : 'text-red-600'}>
            {trend}
          </span>
        </div>
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

function TopPerformingContent() {
  const topContent = [
    {
      title: "Summer Festival Highlights",
      views: "245K",
      duration: "15:30",
      engagement: "92%",
      trend: "+28%"
    },
    {
      title: "Tech Review Series",
      views: "180K",
      duration: "12:45",
      engagement: "88%",
      trend: "+15%"
    },
    {
      title: "Cooking Masterclass",
      views: "156K",
      duration: "25:20",
      engagement: "85%",
      trend: "+22%"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
          <p className="text-sm text-gray-500">Most engaging videos</p>
        </div>
      </div>
      <div className="space-y-4">
        {topContent.map((content, index) => (
          <ContentCard key={index} {...content} />
        ))}
      </div>
    </div>
  );
}

function ContentCard({ title, views, duration, engagement, trend }: { title: string; views: string; duration: string; engagement: string; trend: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 text-blue-500" />
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        </div>
        <span className="text-sm text-green-600">{trend}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <MetricItem label="Views" value={views} />
        <MetricItem label="Duration" value={duration} />
        <MetricItem label="Engagement" value={engagement} />
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function DeviceDistribution() {
  const devices = [
    { type: "Mobile", icon: <Smartphone />, percentage: 45, trend: "+12%" },
    { type: "Desktop", icon: <Monitor />, percentage: 35, trend: "-5%" },
    { type: "Smart TV", icon: <Tv />, percentage: 20, trend: "+8%" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Device Distribution</h3>
          <p className="text-sm text-gray-500">Viewing platform analytics</p>
        </div>
      </div>
      <div className="space-y-4">
        {devices.map((device, index) => (
          <DeviceMetric key={index} {...device} />
        ))}
      </div>
    </div>
  );
}

function DeviceMetric({ type, icon, percentage, trend }: { type: string; icon: React.ReactNode; percentage: number; trend: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="p-2 bg-white rounded-lg text-blue-600">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{type}</p>
          <p className="text-lg font-semibold text-gray-900">{percentage}%</p>
        </div>
      </div>
      <span className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
    </div>
  );
}

function GeographicDistribution() {
  const regions = [
    { name: "North America", percentage: 40, engagement: "High" },
    { name: "Europe", percentage: 30, engagement: "Medium" },
    { name: "Asia Pacific", percentage: 20, engagement: "High" },
    { name: "Others", percentage: 10, engagement: "Medium" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
          <p className="text-sm text-gray-500">Regional content performance</p>
        </div>
      </div>
      <div className="space-y-4">
        {regions.map((region, index) => (
          <RegionMetric key={index} {...region} />
        ))}
      </div>
    </div>
  );
}

function RegionMetric({ name, percentage, engagement }: { name: string; percentage: number; engagement: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-900">{name}</span>
        <span className={`px-2 py-1 text-xs rounded-full ${
          engagement === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {engagement}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {percentage}% of total views
      </div>
    </div>
  );
}

function ContentInsights() {
  const insights = [
    {
      title: "Peak Performance",
      description: "Videos between 8-12 minutes show highest completion rates",
      impact: "High"
    },
    {
      title: "Engagement Pattern",
      description: "Interactive content generates 45% more user engagement",
      impact: "Medium"
    },
    {
      title: "Audience Preference",
      description: "Tutorial-style content shows 28% higher retention",
      impact: "High"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Content Insights</h3>
          <p className="text-sm text-gray-500">AI-powered content analysis</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
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

function OptimizationRecommendations() {
  const recommendations = [
    {
      title: "Content Length Optimization",
      description: "Consider producing more content in the 8-12 minute range",
      metrics: "28% higher engagement",
      priority: "High"
    },
    {
      title: "Interactive Elements",
      description: "Add interactive elements in first 2 minutes",
      metrics: "45% better retention",
      priority: "Medium"
    },
    {
      title: "Mobile Optimization",
      description: "Optimize video quality for mobile viewers",
      metrics: "35% of audience",
      priority: "High"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Optimization Recommendations</h3>
          <p className="text-sm text-gray-500">AI-suggested improvements</p>
        </div>
      </div>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
}

function RecommendationCard({ title, description, metrics, priority }: { title: string; description: string; metrics: string; priority: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          priority === 'High' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {priority} Priority
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex items-center text-sm text-green-600">
        <BarChart2 className="w-4 h-4 mr-1" />
        <span>{metrics}</span>
      </div>
    </div>
  );
}