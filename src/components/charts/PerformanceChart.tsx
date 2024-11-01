import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, LineStyle } from 'lightweight-charts';
import { Activity, Zap } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export function PerformanceChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { performanceData } = useAnalytics();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#ffffff' },
          textColor: '#334155',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        grid: {
          vertLines: { color: '#f1f5f9', style: LineStyle.Dotted },
          horzLines: { color: '#f1f5f9', style: LineStyle.Dotted },
        },
        rightPriceScale: {
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          vertLine: {
            color: '#94a3b8',
            width: 1,
            style: LineStyle.Dashed,
          },
          horzLine: {
            color: '#94a3b8',
            width: 1,
            style: LineStyle.Dashed,
          },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });

      const cpuSeries = chart.addAreaSeries({
        topColor: 'rgba(59, 130, 246, 0.2)',
        bottomColor: 'rgba(59, 130, 246, 0.0)',
        lineColor: '#3b82f6',
        lineWidth: 2,
        title: 'CPU Usage',
      });

      const memorySeries = chart.addAreaSeries({
        topColor: 'rgba(16, 185, 129, 0.2)',
        bottomColor: 'rgba(16, 185, 129, 0.0)',
        lineColor: '#10b981',
        lineWidth: 2,
        title: 'Memory Usage',
      });

      const networkSeries = chart.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'Network Latency',
      });

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (chartRef.current && performanceData) {
      const series = chartRef.current.series();
      if (series.length >= 3) {
        const [cpuSeries, memorySeries, networkSeries] = series;
        const time = Math.floor(Date.now() / 1000);
        
        cpuSeries.update({
          time,
          value: performanceData.cpu,
        });
        
        memorySeries.update({
          time,
          value: performanceData.memory,
        });
        
        networkSeries.update({
          time,
          value: performanceData.network.latency,
        });
      }
    }
  }, [performanceData]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time system performance monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <MetricBadge
            icon={<Activity className="w-4 h-4" />}
            label="CPU"
            value={`${performanceData?.cpu.toFixed(1)}%`}
            color="blue"
          />
          <MetricBadge
            icon={<Zap className="w-4 h-4" />}
            label="Memory"
            value={`${performanceData?.memory.toFixed(1)}%`}
            color="green"
          />
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
      <div className="flex justify-center space-x-6 mt-4">
        <ChartLegend color="#3b82f6" label="CPU Usage" />
        <ChartLegend color="#10b981" label="Memory Usage" />
        <ChartLegend color="#8b5cf6" label="Network Latency" />
      </div>
    </div>
  );
}

interface MetricBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple';
}

function MetricBadge({ icon, label, value, color }: MetricBadgeProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <div className={`flex items-center px-3 py-1 rounded-lg border ${colors[color]}`}>
      <span className="mr-2">{icon}</span>
      <span className="text-sm font-medium mr-2">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

interface ChartLegendProps {
  color: string;
  label: string;
}

function ChartLegend({ color, label }: ChartLegendProps) {
  return (
    <div className="flex items-center">
      <div
        className="w-3 h-3 rounded-full mr-2"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}