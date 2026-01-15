'use client';

import Icon from './ui/Icon';
import Card from './ui/Card';
import Section from './ui/Section';

export default function ProblemSolution() {
  return (
    <Section id="problem-solution" className="py-12">
      <div className="space-y-16">
        {/* Problem Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-red-100 text-red-800 rounded-full font-semibold mb-4">
              THE PROBLEM
            </div>
            <h3 className="text-3xl font-bold text-emerald-600 mb-6">
              AI Agent Operations Lack Transparency
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="block" size="lg" className="text-red-600" />
                </div>
                <h4 className="font-bold text-red-900 mb-2">No Transparency</h4>
                <p className="text-sm text-red-700">Agent decisions are black boxes with no verifiable audit trails</p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="refresh" size="lg" className="text-red-600" />
                </div>
                <h4 className="font-bold text-red-900 mb-2">No Permanent Records</h4>
                <p className="text-sm text-red-700">Agent operations are ephemeral with no immutable history</p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="question" size="lg" className="text-red-600" />
                </div>
                <h4 className="font-bold text-red-900 mb-2">No Verification</h4>
                <p className="text-sm text-red-700">Cannot prove agent work quality or computation integrity</p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="user" size="lg" className="text-red-600" />
                </div>
                <h4 className="font-bold text-red-900 mb-2">No Attribution</h4>
                <p className="text-sm text-red-700">Cannot track which agent did what or build reputation</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Solution Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold mb-4">
              THE SOLUTION
            </div>
            <h3 className="text-3xl font-bold text-emerald-600 mb-6">
              DataWeave: Immutable Provenance Infrastructure
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="shield" size="lg" className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-emerald-900 mb-2">Immutable Audit Trails</h4>
                <p className="text-sm text-emerald-700">Every agent operation permanently stored on Arweave with cryptographic verification</p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="lock" size="lg" className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-emerald-900 mb-2">Zero-Knowledge Verification</h4>
                <p className="text-sm text-emerald-700">zkVerify generates cryptographic proofs that verify agent work quality</p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="lightning" size="lg" className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-emerald-900 mb-2">Real-Time Amadeus Integration</h4>
                <p className="text-sm text-emerald-700">Capture agent operations as they happen on Amadeus L1</p>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="trophy" size="lg" className="text-emerald-600" />
                </div>
                <h4 className="font-bold text-emerald-900 mb-2">Agent Reputation System</h4>
                <p className="text-sm text-emerald-700">Build verifiable reputation based on proven work history</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
