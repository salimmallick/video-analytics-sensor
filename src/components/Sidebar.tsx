import React from 'react';
import { Home, Activity, Users, Cpu, BarChart2, Target, GitBranch, Lightbulb, Route, Gauge, Play, Film } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export function Sidebar() {
  const { activeSection, activeSubSection, setActiveSection, setActiveSubSection } = useAnalytics();

  const handleNavigation = (section: string, subsection: string = '') => {
    setActiveSection(section);
    setActiveSubSection(subsection);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <nav className="mt-5 space-y-1">
        <NavItem 
          icon={<Home />} 
          label="Overview" 
          active={activeSection === 'overview'}
          onClick={() => handleNavigation('overview')}
        />
        <NavItem 
          icon={<Activity />} 
          label="Real-time" 
          active={activeSection === 'real-time'}
          onClick={() => handleNavigation('real-time')}
        />
        <NavSection
          icon={<Target />}
          label="Product Analytics"
          active={activeSection === 'product-analytics'}
          onClick={() => handleNavigation('product-analytics')}
          items={[
            { icon: <GitBranch />, label: "A/B Testing", id: 'ab-testing' },
            { icon: <Route />, label: "User Journeys", id: 'user-journeys' },
            { icon: <Gauge />, label: "Feature Usage", id: 'feature-usage' },
            { icon: <Lightbulb />, label: "AI Insights", id: 'ai-insights' }
          ]}
          activeSubSection={activeSubSection}
          onSubSectionClick={(id) => handleNavigation('product-analytics', id)}
        />
        <NavSection
          icon={<Film />}
          label="Video Analytics"
          active={activeSection === 'video-analytics'}
          onClick={() => handleNavigation('video-analytics', 'overview')}
          items={[
            { icon: <BarChart2 />, label: "Overview", id: 'overview' },
            { icon: <Play />, label: "Playback QoE", id: 'playback-qoe' },
            { icon: <Activity />, label: "Streaming Quality", id: 'streaming-quality' },
            { icon: <Users />, label: "Viewer Engagement", id: 'viewer-engagement' },
            { icon: <Film />, label: "Content Analytics", id: 'content-analytics' }
          ]}
          activeSubSection={activeSubSection}
          onSubSectionClick={(id) => handleNavigation('video-analytics', id)}
        />
        <NavItem 
          icon={<Users />} 
          label="User Behavior" 
          active={activeSection === 'user-behavior'}
          onClick={() => handleNavigation('user-behavior')}
        />
        <NavItem 
          icon={<Cpu />} 
          label="Performance" 
          active={activeSection === 'performance'}
          onClick={() => handleNavigation('performance')}
        />
        <NavItem 
          icon={<BarChart2 />} 
          label="ML Insights" 
          active={activeSection === 'ml-insights'}
          onClick={() => handleNavigation('ml-insights')}
        />
      </nav>
    </aside>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
        active
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
}

interface NavSectionProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    id: string;
  }>;
  activeSubSection: string;
  onSubSectionClick: (id: string) => void;
}

function NavSection({ 
  icon, 
  label, 
  active, 
  onClick, 
  items,
  activeSubSection,
  onSubSectionClick
}: NavSectionProps) {
  return (
    <div className={`${active ? 'bg-gray-50' : ''}`}>
      <NavItem icon={icon} label={label} active={active} onClick={onClick} />
      {active && (
        <div className="ml-8 space-y-1 mt-1">
          {items.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeSubSection === item.id}
              onClick={() => onSubSectionClick(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}