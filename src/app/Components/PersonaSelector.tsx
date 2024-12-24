import React, { useState, useEffect } from 'react';
import { useApi } from 'gabber-client-react';
import { ScenarioSelector } from '../Components/ScenarioSelector';

interface Persona {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export const PersonaSelector = ({ onCreateNew }: { onCreateNew: () => void }) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { api } = useApi();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setIsLoading(true);
        const response = await api.persona.listPersonas();
        console.log(response);
        setPersonas(response.data.values || []);
      } catch (err) {
        console.error('Error fetching personas:', err);
        setError('Failed to load personas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonas();
  }, [api]);

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersonaId(personaId);
  };

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
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedPersonaId ? (
        <ScenarioSelector 
          personaId={selectedPersonaId}
          onBack={() => setSelectedPersonaId(null)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {personas?.map((persona) => (
              <button
                key={persona.id}
                onClick={() => handlePersonaSelect(persona.id)}
                className="flex items-center p-4 border rounded-lg hover:border-blue-500 transition-colors bg-white"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{persona.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{persona.description}</p>
                </div>
              </button>
            ))}
          </div>

          {personas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No personas found</p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Persona
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 