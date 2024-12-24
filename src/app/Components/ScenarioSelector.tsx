import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from 'gabber-client-react';
import { useState } from 'react';
interface ScenarioSelectorProps {
  personaId: string;
  onBack: () => void;
}

interface Scenario {
  id: string;
  name: string;
  description?: string;
}

export const ScenarioSelector = ({ personaId, onBack }: ScenarioSelectorProps) => {
  const router = useRouter();
  const { api } = useApi();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleScenarioSelect = (scenarioId: string) => {
    router.push(`/chat?personaId=${personaId}&scenarioId=${scenarioId}`);
  };

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setIsLoading(true);
        const response = await api.scenario.listScenarios();
        console.log(response);
        setScenarios(response.data.values || []);
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setError('Failed to load scenarios');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScenarios();
  }, [api]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Failed to load scenarios
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← Back to personas
      </button>

      <div className="grid grid-cols-1 gap-4">
        {scenarios?.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioSelect(scenario.id)}
            className="flex items-center p-6 border rounded-lg hover:border-blue-500 transition-colors bg-white group"
          >
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {scenario.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {scenario.description}
              </p>
            </div>
            <div className="ml-4 text-gray-400 group-hover:text-blue-500 transition-colors">
              {/* <Brain className="w-6 h-6" /> */}
            </div>
          </button>
        ))}
      </div>

      {scenarios?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No scenarios available</p>
        </div>
      )}
    </div>
  );
};