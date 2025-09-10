import React from 'react';
import { DocumentTextIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-black/50 backdrop-blur-lg border-b border-yellow-500/20 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px rgba(250, 204, 21, 0.7))'}}/>
                <h1 className="text-2xl font-bold text-white" style={{textShadow: '0 0 8px rgba(250, 204, 21, 0.7)'}}>AI PRD Generator</h1>
            </div>
        </div>
      </div>
    </header>
  );
};