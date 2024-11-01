import React from 'react';
import { Users, Target, Lightbulb, GitBranch, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export function ProductAnalytics() {
  const { track } = useAnalytics();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Product Analytics</h2>
              <p className="text-sm text-gray-500 mt-1">AI-powered insights for product optimization</p>
            </div>
            <div className="flex items-center space-x-2">
              <select className="text-sm border-gray-300 rounded-lg">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FeatureCard
              title="Feature Adoption"
              value="76%"
              trend="+12%"
              description="Users engaging with new features"
              icon={<Target className="w-5 h-5" />}
            />
            <FeatureCard
              title="User Retention"
              value="84%"
              trend="+5%"
              description="30-day retention rate"
              icon={<Users className="w-5 h-5" />}
            />
            <FeatureCard
              title="Feature Impact"
              value="92%"
              trend="+8%"
              description="Positive impact on user engagement"
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>

          <div className="space-y-6">
            <ExperimentSection />
            <AIRecommendations />
            <UserJourneyAnalysis />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, value, trend, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">{icon}</span>
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{trend}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

function ExperimentSection() {
  const experiments = [
    {
      name: "New Onboarding Flow",
      status: "Running",
      impact: "+24% completion",
      confidence: "98%"
    },
    {
      name: "Premium Features UI",
      status: "Running",
      impact: "+15% conversion",
      confidence: "92%"
    }
  ];

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Active Experiments</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="space-y-3">
        {experiments.map((experiment, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{experiment.name}</p>
              <p className="text-xs text-gray-500">Confidence: {experiment.confidence}</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {experiment.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIRecommendations() {
  const recommendations = [
    {
      title: "Optimize Payment Flow",
      description: "AI detected 23% drop-off at payment confirmation. Consider simplifying the form.",
      impact: "High",
      effort: "Medium"
    },
    {
      title: "Feature Discovery",
      description: "72% of users missing key productivity features. Add guided tour.",
      impact: "Medium",
      effort: "Low"
    }
  ];

  return (
    <div className="border-t pt-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">AI Recommendations</h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-900">{rec.title}</h4>
              <div className="flex space-x-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Impact: {rec.impact}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Effort: {rec.effort}
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-800">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserJourneyAnalysis() {
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">User Journey Insights</h3>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Details</button>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-900">Critical Path Analysis</p>
            <p className="text-xs text-gray-500">Top user flows and friction points</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            2 Optimization Opportunities
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-1/4 font-medium text-gray-900">Homepage → Features</div>
            <div className="w-1/2 px-2">
              <div className="h-2 bg-green-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="w-1/4 pl-2 text-gray-600">80% completion</div>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-1/4 font-medium text-gray-900">Features → Signup</div>
            <div className="w-1/2 px-2">
              <div className="h-2 bg-yellow-200 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="w-1/4 pl-2 text-gray-600">45% completion</div>
          </div>
        </div>
      </div>
    </div>
  );
}