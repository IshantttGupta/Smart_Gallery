import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, Settings, Download, Zap, Image, Grid3X3, List, Users } from 'lucide-react';
import ImageGallery from './components/ImageGallery';
import NetworkStatus from './components/NetworkStatus';
import FilterControls from './components/FilterControls';
import ChromaGrid from './components/ChromaGrid';
import { useNetworkInfo } from './hooks/useNetworkInfo';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';

function App() {
  const [filter, setFilter] = useState('none');
  const [viewMode, setViewMode] = useState('grid');
  const [showChromaGrid, setShowChromaGrid] = useState(false);
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Simple Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-zinc-100 rounded flex items-center justify-center">
                <Image className="w-4 h-4 text-zinc-900" />
              </div>
              <span className="font-medium text-zinc-100">Gallery</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-zinc-900 rounded-md p-1">
                <button
                  onClick={() => {
                    setViewMode('grid');
                    setShowChromaGrid(false);
                  }}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'grid' && !showChromaGrid
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setViewMode('list');
                    setShowChromaGrid(false);
                  }}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === 'list' && !showChromaGrid
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowChromaGrid(!showChromaGrid)}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    showChromaGrid
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* 🌐 NETWORK INFORMATION API - Display network status */}
              <NetworkStatus networkInfo={networkInfo} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Title & Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100 mb-1">
                {showChromaGrid ? 'Team Gallery' : 'Image Collection'}
              </h1>
              <p className="text-zinc-400 text-sm">
                {showChromaGrid ? 'Interactive team member showcase' : 'Smart loading based on your connection'}
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
          {!showChromaGrid && (
            <FilterControls currentFilter={filter} onFilterChange={setFilter} />
          )}
        </div>

        {/* Conditional rendering based on view mode */}
        {showChromaGrid ? (
          <ChromaGrid 
            columns={3}
            rows={2}
            radius={400}
            damping={0.5}
            fadeOut={0.8}
          />
        ) : (
          /* 👁️ INTERSECTION OBSERVER API + 🌐 NETWORK INFORMATION API - Smart image loading */
          <ImageGallery 
            filter={filter} 
            networkInfo={networkInfo} 
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;