import React from 'react';
import { Wifi, WifiOff, Signal, Activity, Clock } from 'lucide-react';

interface NetworkStatusProps {
  networkInfo: {
    isOnline: boolean;
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ networkInfo }) => {
  // 🌐 NETWORK INFORMATION API - Get appropriate connection icon
  const getConnectionIcon = () => {
    if (!networkInfo.isOnline) return <WifiOff className="w-3.5 h-3.5" />;
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return <Signal className="w-3.5 h-3.5 text-red-400" />;
      case '3g':
        return <Signal className="w-3.5 h-3.5 text-yellow-400" />;
      case '4g':
        return <Wifi className="w-3.5 h-3.5 text-green-400" />;
      default:
        return <Wifi className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // 🌐 NETWORK INFORMATION API - Get connection status color
  const getConnectionColor = () => {
    if (!networkInfo.isOnline) return 'text-red-400';
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'text-red-400';
      case '3g':
        return 'text-yellow-400';
      case '4g':
        return 'text-green-400';
      default:
        return 'text-zinc-400';
    }
  };

  // 🌐 NETWORK INFORMATION API - Get connection text
  const getConnectionText = () => {
    if (!networkInfo.isOnline) return 'Offline';
    return networkInfo.effectiveType?.toUpperCase() || 'Unknown';
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900 border border-zinc-800 rounded-md px-2 sm:px-3 py-1.5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* 🌐 NETWORK INFORMATION API - Display connection icon and status */}
        {getConnectionIcon()}
        <span className={`text-xs font-medium ${getConnectionColor()}`}>
          {getConnectionText()}
        </span>
      </div>
      
      {/* 🌐 NETWORK INFORMATION API - Show detailed network metrics (hidden on mobile) */}
      {networkInfo.isOnline && (
        <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span className="font-mono">{networkInfo.downlink?.toFixed(1) || '0'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{networkInfo.rtt || '0'}ms</span>
          </div>
          {/* 🌐 NETWORK INFORMATION API - Data saver indicator */}
          {networkInfo.saveData && (
            <div className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs border border-blue-500/30">
              Save
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;