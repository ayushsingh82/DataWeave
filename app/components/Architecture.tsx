'use client';

import Section from './ui/Section';
import Card from './ui/Card';
import Icon from './ui/Icon';

export default function Architecture() {
  const layers = [
    {
      title: 'Layer 1: Amadeus L1',
      description: 'Primary blockchain for agent operations and real-time provenance capture',
      components: [
        'Agent Execution',
        'uPoW Validation',
        'Task Registry',
        'Agent Registry'
      ],
      icon: 'lock' as const
    },
    {
      title: 'Layer 2: Storage Layer',
      description: 'Permanent storage and on-chain anchoring for provenance records',
      components: [
        'Arweave Integration',
        'Amadeus L1 Anchoring',
        'Transaction Management',
        'Data Retrieval'
      ],
      icon: 'database' as const
    },
    {
      title: 'Layer 3: Verification Layer',
      description: 'Cryptographic verification and quality assurance',
      components: [
        'zkVerify Integration',
        'Hash Verification',
        'Signature Validation',
        'Chain Verification'
      ],
      icon: 'shield' as const
    },
    {
      title: 'Layer 4: Provenance Engine',
      description: 'Core logic for creating and managing provenance records',
      components: [
        'Record Creation',
        'Chain Linking',
        'Indexing Service',
        'Query Engine'
      ],
      icon: 'research' as const
    },
    {
      title: 'Layer 5: API Layer',
      description: 'RESTful API for provenance record management and queries',
      components: [
        'Provenance API',
        'Search API',
        'Agent API',
        'Verification API'
      ],
      icon: 'server' as const
    },
    {
      title: 'Layer 6: Application Layer',
      description: 'User interface for viewing and managing provenance records',
      components: [
        'Dashboard UI',
        'Search Interface',
        'Provenance Viewer',
        'Agent Analytics'
      ],
      icon: 'chart' as const
    }
  ];

  return (
    <Section id="architecture" className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-emerald-600 mb-4">
          DataWeave Architecture
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          6-Layer Provenance Stack for Immutable AI Agent Operations
        </p>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {layers.map((layer, index) => (
          <Card key={index} className="hover:border-emerald-300">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Icon name={layer.icon} size="lg" className="text-emerald-600" />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-emerald-600">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {layer.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {layer.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {layer.components.map((component, compIndex) => (
                    <div
                      key={compIndex}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
