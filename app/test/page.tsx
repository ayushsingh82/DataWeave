'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'pass' | 'fail';
  message: string;
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    const results: TestResult[] = [];

    // Test 1: API Search Endpoint
    try {
      const searchRes = await fetch('/api/provenance/search');
      const searchData = await searchRes.json();
      results.push({
        name: 'API Search Endpoint',
        status: searchRes.ok && searchData.success ? 'pass' : 'fail',
        message: searchRes.ok 
          ? `✅ Returns ${searchData.records?.length || 0} records`
          : `❌ Failed: ${searchRes.status} ${searchRes.statusText}`
      });
    } catch (error: any) {
      results.push({
        name: 'API Search Endpoint',
        status: 'fail',
        message: `❌ Error: ${error.message}`
      });
    }

    // Test 2: API Create Endpoint
    try {
      const createRes = await fetch('/api/provenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'compute',
          minerId: 'test-miner',
          data: { test: 'data' },
          metadata: {
            computationType: 'inference',
            inputs: ['input1'],
            outputs: ['output1'],
            reasoning: 'Test reasoning'
          }
        })
      });
      const createData = await createRes.json();
      results.push({
        name: 'API Create Endpoint',
        status: createRes.ok && createData.success ? 'pass' : 'fail',
        message: createRes.ok 
          ? `✅ Created record: ${createData.recordId?.substring(0, 8)}...`
          : `❌ Failed: ${createRes.status} - ${createData.error || 'Unknown error'}`
      });
    } catch (error: any) {
      results.push({
        name: 'API Create Endpoint',
        status: 'fail',
        message: `❌ Error: ${error.message}`
      });
    }

    // Test 3: Components Import
    try {
      const Dashboard = await import('../components/Dashboard');
      const MinerSim = await import('../components/MinerSimulation');
      const Search = await import('../components/SearchInterface');
      results.push({
        name: 'Component Imports',
        status: 'pass',
        message: '✅ All components import successfully'
      });
    } catch (error: any) {
      results.push({
        name: 'Component Imports',
        status: 'fail',
        message: `❌ Import error: ${error.message}`
      });
    }

    // Test 4: Logo Component
    try {
      const Logo = await import('../components/Logo');
      results.push({
        name: 'Logo Component',
        status: 'pass',
        message: '✅ Logo component loads'
      });
    } catch (error: any) {
      results.push({
        name: 'Logo Component',
        status: 'fail',
        message: `❌ Error: ${error.message}`
      });
    }

    // Test 5: Library Functions
    try {
      const provenance = await import('@/lib/provenance');
      const hasGetRecords = typeof provenance.getRecords === 'function';
      const hasCreate = typeof provenance.createProvenanceRecord === 'function';
      results.push({
        name: 'Library Functions',
        status: hasGetRecords && hasCreate ? 'pass' : 'fail',
        message: hasGetRecords && hasCreate
          ? '✅ All required functions available'
          : '❌ Missing required functions'
      });
    } catch (error: any) {
      results.push({
        name: 'Library Functions',
        status: 'fail',
        message: `❌ Error: ${error.message}`
      });
    }

    setTests(results);
    setRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const passed = tests.filter(t => t.status === 'pass').length;
  const failed = tests.filter(t => t.status === 'fail').length;
  const total = tests.length;

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-4xl mx-auto">
        <div className="card p-6 mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">DataWeave Diagnostic Tests</h1>
          <p className="text-gray-600">Run these tests to identify what's not working</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">Test Results</h2>
            <button
              onClick={runTests}
              disabled={running}
              className="btn-primary px-4 py-2 rounded font-medium flex items-center gap-2"
            >
              {running ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Run Tests
                </>
              )}
            </button>
          </div>

          {total > 0 && (
            <div className="mb-4 p-4 border-2 border-black bg-gray-50">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-black ml-2">{total}</span>
                </div>
                <div>
                  <span className="text-sm text-green-600">Passed:</span>
                  <span className="font-bold text-green-600 ml-2">{passed}</span>
                </div>
                <div>
                  <span className="text-sm text-red-600">Failed:</span>
                  <span className="font-bold text-red-600 ml-2">{failed}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tests.length === 0 && !running && (
              <p className="text-gray-600">Click "Run Tests" to start diagnostics</p>
            )}
            {tests.map((test, index) => (
              <div
                key={index}
                className={`p-4 border-2 border-black ${
                  test.status === 'pass' ? 'bg-green-50' : 
                  test.status === 'fail' ? 'bg-red-50' : 
                  'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {test.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {test.status === 'fail' && <XCircle className="w-5 h-5 text-red-600" />}
                  {test.status === 'pending' && <Loader className="w-5 h-5 text-gray-400 animate-spin" />}
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{test.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">{test.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-black mb-4">Quick Fixes</h2>
          <div className="space-y-2 text-sm">
            <p><strong>If API tests fail:</strong> Check terminal for errors, verify `lib/provenance.ts` exports</p>
            <p><strong>If components fail:</strong> Check browser console for import errors</p>
            <p><strong>If nothing works:</strong> Try `npm install` and restart dev server</p>
            <p><strong>Port in use:</strong> Kill process on port 3000 or use `npm run dev -- -p 3001`</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="btn-secondary px-6 py-3 rounded font-medium inline-block"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
