import React, { useState } from 'react';
import { Smartphone, Monitor, Tv, ChevronDown } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

interface AppVersion {
  version: string;
  buildNumber: string;
  releaseDate: string;
  status: 'stable' | 'beta' | 'deprecated';
}

interface App {
  id: string;
  name: string;
  platform: 'web' | 'mobile' | 'tv';
  status: 'active' | 'inactive';
  lastSeen: string;
  versions: AppVersion[];
  currentVersion?: string;
}

export function AppSelector() {
  const { track } = useAnalytics();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const apps: App[] = [
    {
      id: '1',
      name: 'Web Dashboard',
      platform: 'web',
      status: 'active',
      lastSeen: '2m ago',
      currentVersion: 'v2.1.0',
      versions: [
        { version: 'v2.1.0', buildNumber: '2104', releaseDate: '2024-03-01', status: 'stable' },
        { version: 'v2.0.0', buildNumber: '2100', releaseDate: '2024-02-15', status: 'stable' },
        { version: 'v1.9.0', buildNumber: '1900', releaseDate: '2024-01-30', status: 'deprecated' }
      ]
    },
    {
      id: '2',
      name: 'iOS App',
      platform: 'mobile',
      status: 'active',
      lastSeen: '1m ago',
      currentVersion: 'v3.2.1',
      versions: [
        { version: 'v3.2.1', buildNumber: '3210', releaseDate: '2024-03-05', status: 'stable' },
        { version: 'v3.2.0', buildNumber: '3200', releaseDate: '2024-02-20', status: 'beta' },
        { version: 'v3.1.0', buildNumber: '3100', releaseDate: '2024-02-01', status: 'deprecated' }
      ]
    },
    {
      id: '3',
      name: 'Android App',
      platform: 'mobile',
      status: 'active',
      lastSeen: '5m ago',
      currentVersion: 'v3.2.0',
      versions: [
        { version: 'v3.2.0', buildNumber: '3200', releaseDate: '2024-03-02', status: 'stable' },
        { version: 'v3.1.0', buildNumber: '3100', releaseDate: '2024-02-10', status: 'stable' },
        { version: 'v3.0.0', buildNumber: '3000', releaseDate: '2024-01-15', status: 'deprecated' }
      ]
    },
    {
      id: '4',
      name: 'Smart TV App',
      platform: 'tv',
      status: 'inactive',
      lastSeen: '1h ago',
      currentVersion: 'v1.5.0',
      versions: [
        { version: 'v1.5.0', buildNumber: '1500', releaseDate: '2024-02-28', status: 'stable' },
        { version: 'v1.4.0', buildNumber: '1400', releaseDate: '2024-02-01', status: 'deprecated' }
      ]
    }
  ];

  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId);
    setSelectedVersion(null);
    const app = apps.find(a => a.id === appId);
    track('app_selected', { appId, appName: app?.name });
  };

  const handleVersionSelect = (appId: string, version: string) => {
    setSelectedVersion(version);
    const app = apps.find(a => a.id === appId);
    track('version_selected', { appId, appName: app?.name, version });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Connected Apps</h2>
        <div className="flex items-center space-x-2">
          <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          {selectedApp && selectedVersion && (
            <button 
              onClick={() => { setSelectedApp(null); setSelectedVersion(null); }}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apps.map((app) => (
          <AppCard 
            key={app.id} 
            app={app}
            isSelected={selectedApp === app.id}
            selectedVersion={selectedVersion}
            onSelect={handleAppSelect}
            onVersionSelect={handleVersionSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface AppCardProps {
  app: App;
  isSelected: boolean;
  selectedVersion: string | null;
  onSelect: (appId: string) => void;
  onVersionSelect: (appId: string, version: string) => void;
}

function AppCard({ app, isSelected, selectedVersion, onSelect, onVersionSelect }: AppCardProps) {
  const [showVersions, setShowVersions] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'web':
        return <Monitor className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tv':
        return <Tv className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getVersionStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      case 'deprecated':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg transition-shadow cursor-pointer ${
        isSelected ? 'border-blue-500 shadow-md' : 'hover:shadow-md border-gray-200'
      }`}
      onClick={() => !isSelected && onSelect(app.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">{getPlatformIcon(app.platform)}</span>
          <span className="font-medium text-gray-900">{app.name}</span>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          app.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {app.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-2">Last seen: {app.lastSeen}</div>
      
      {isSelected && (
        <div className="mt-3 space-y-2">
          <div 
            className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer"
            onClick={() => setShowVersions(!showVersions)}
          >
            <span className="text-sm font-medium text-gray-700">
              {selectedVersion || app.currentVersion} (Current)
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform ${
              showVersions ? 'rotate-180' : ''
            }`} />
          </div>
          
          {showVersions && (
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {app.versions.map((version) => (
                <div
                  key={version.version}
                  className={`p-2 text-sm rounded cursor-pointer hover:bg-gray-50 ${
                    selectedVersion === version.version ? 'bg-blue-50' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVersionSelect(app.id, version.version);
                    setShowVersions(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{version.version}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getVersionStatusColor(version.status)}`}>
                      {version.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Build: {version.buildNumber} • Released: {version.releaseDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}