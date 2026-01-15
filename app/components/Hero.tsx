'use client';

import Icon from './ui/Icon';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
            Built on Amadeus Network
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-emerald-600 mb-6 leading-tight">
            DataWeave
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl sm:text-3xl text-gray-700 mb-4 font-light">
            Immutable Provenance for AI Agent Economy
          </p>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Building transparent, verifiable provenance infrastructure for AI agents on Amadeus L1. 
            Every agent action, computation, and collaboration is permanently recorded and cryptographically verified.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="shield" size="lg" className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-sm text-gray-600 font-medium">Immutable Records</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="lock" size="lg" className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">∞</div>
              <div className="text-sm text-gray-600 font-medium">Permanent Storage</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="target" size="lg" className="text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600 font-medium">Verifiable Provenance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
