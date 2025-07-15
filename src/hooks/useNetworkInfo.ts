import { useState, useEffect } from 'react';

interface NetworkInfo {
  isOnline: boolean;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// 🌐 NETWORK INFORMATION API - Custom hook to monitor network conditions
export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: navigator.onLine,
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      // 🌐 NETWORK INFORMATION API - Access connection information
      const connection = (navigator as any).connection || 
                         (navigator as any).mozConnection || 
                         (navigator as any).webkitConnection;
      
      setNetworkInfo({
        isOnline: navigator.onLine,
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false
      });
      
      console.log('🌐 Network Info Updated:', {
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      });
    };

    const handleOnline = () => {
      console.log('🌐 Network: Online');
      setNetworkInfo(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      console.log('🌐 Network: Offline');
      setNetworkInfo(prev => ({ ...prev, isOnline: false }));
    };

    // Initial update
    updateNetworkInfo();

    // 🌐 NETWORK INFORMATION API - Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 🌐 NETWORK INFORMATION API - Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    // Periodic updates to catch network changes
    const interval = setInterval(updateNetworkInfo, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
      clearInterval(interval);
    };
  }, []);

  return networkInfo;
};