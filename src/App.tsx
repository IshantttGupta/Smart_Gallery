import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, Settings, Download, Zap, Image, Grid3X3, List } from 'lucide-react';
import ImageGallery from './components/ImageGallery';
import NetworkStatus from './components/NetworkStatus';
import FilterControls from './components/FilterControls';
import { useNetworkInfo } from './hooks/useNetworkInfo';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';

function App() {
  const [filter, setFilter] = useState('none');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌐 NETWORK INFORMATION API - Monitor network conditions
  const networkInfo = useNetworkInfo();
  
  // ⚡ BACKGROUND TASKS API - Handle idle-time processing
  const { isIdle, taskQueue } = useBackgroundTasks();

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border border-zinc-800 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-zinc-700 rounded-full animate-spin border-t-zinc-400"></div>
          </div>
          <div>
            <h1 className="text-lg font-medium text-zinc-100">Loading Gallery</h1>
            <p className="text-sm text-zinc-500 mt-1">Preparing your images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Mobile-First Header */}
      <header className="border-b border-zinc-800/50 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-7 sm:h-7 bg-zinc-100 rounded flex items-center justify-center">
                <Image className="w-5 h-5 sm:w-4 sm:h-4 text-zinc-900" />
              </div>
              <span className="font-medium text-zinc-100 text-lg sm:text-base">Gallery</span>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile-Optimized View Mode Toggle */}
              <div className="flex items-center bg-zinc-900 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'list'
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <List className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
              
              {/* 🌐 NETWORK INFORMATION API - Display network status */}
              <NetworkStatus networkInfo={networkInfo} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Page Title & Controls */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 mb-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-1">
                Image Collection
              </h1>
              <p className="text-zinc-400 text-sm">
                Smart loading with interactive chroma effects
              </p>
            </div>
            
            {/* ⚡ BACKGROUND TASKS API - Show processing status */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className={`w-1.5 h-1.5 rounded-full ${isIdle ? 'bg-green-500' : 'bg-orange-500'}`} />
              <span>{isIdle ? 'Ready' : 'Processing'}</span>
              {taskQueue > 0 && (
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                  {taskQueue}
                </span>
              )}
            </div>
          </div>
          
          {/* 🎨 CANVAS API - Filter controls */}
          <FilterControls currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* 👁️ INTERSECTION OBSERVER API + 🌐 NETWORK INFORMATION API - Smart image loading with chroma effects */}
        <ImageGallery 
          filter={filter} 
          networkInfo={networkInfo} 
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}

export default App;