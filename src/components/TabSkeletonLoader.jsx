import React from 'react';

/**
 * TabSkeletonLoader
 * Renders an accessible, zero-layout-shift loading skeleton while dynamic code-split components load.
 */
export default function TabSkeletonLoader() {
  return (
    <div 
      role="status" 
      aria-label="Loading module content"
      className="space-y-6 animate-pulse p-6 bg-slate-900/60 border border-slate-800 rounded-3xl"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-800 rounded w-1/4" />
          <div className="h-3 bg-slate-800/60 rounded w-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="h-64 bg-slate-800/40 rounded-2xl border border-slate-800/60" />
        <div className="h-64 bg-slate-800/40 rounded-2xl border border-slate-800/60" />
        <div className="h-64 bg-slate-800/40 rounded-2xl border border-slate-800/60" />
      </div>
      
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
