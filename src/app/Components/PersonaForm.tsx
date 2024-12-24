import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from 'gabber-client-react';
import { ScenarioSelector } from './ScenarioSelector';

interface PersonaFormData {
  name: string;
  description: string;
  gender: 'male' | 'female';
  voice: string;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  gender?: 'male' | 'female';
}

interface Voice {
  id: string;
  name: string;
}

export const PersonaForm = () => {
  const router = useRouter();
  const { api } = useApi();
  const [formData, setFormData] = useState<PersonaFormData>({
    name: '',
    description: '',
    gender: 'male',
    voice: ''
  });
  
  const [isPlayingVoice, setIsPlayingVoice] = useState<string | null>(null);
  const { data: voices, isLoading: isLoadingVoices } = api.voice.listVoices();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const playVoiceSample = async (voiceId: string) => {
    try {
      setIsPlayingVoice(voiceId);
      const audio = await api.voice.generateVoice({
        voice_id: voiceId,
        text: "Hello, this is a sample of my voice. How do I sound?",
      });
      
      const audioElement = new Audio(URL.createObjectURL(audio.data));
      audioElement.onended = () => setIsPlayingVoice(null);
      await audioElement.play();
    } catch (err) {
      console.error('Error playing voice sample:', err);
      setIsPlayingVoice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioBlob) {
      alert('Please record audio first');
      return;
    }

    try {
      const persona = await api.persona.createPersona({
        name: formData.name,
        description: formData.description,
        gender: formData.gender,
        voice: formData.voice
      });

      // Reset form
      setFormData({ name: '', description: '', gender: 'male', voice: '' });
      setAudioBlob(null);
      
      // Navigate to chat with the new persona
      router.push(`/chat/${persona.data.id}`);
    } catch (err) {
      console.error('Error creating digital self:', err);
      // Error will be handled by the useVoiceCloning hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name your digital self
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Describe their personality
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
          required
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
          Select Voice
        </label>
        <div className="mt-1 flex items-center gap-2">
          <select
            id="voice"
            name="voice"
            value={formData.voice}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
            required
          >
            <option value="">Select a voice</option>
            {voices?.data.values?.map((voice: Voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name}
              </option>
            ))}
          </select>
          
          {formData.voice && (
            <button
              type="button"
              onClick={() => playVoiceSample(formData.voice)}
              disabled={isPlayingVoice !== null}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isPlayingVoice === formData.voice ? 'Playing...' : 'Play Sample'}
            </button>
          )}
        </div>
      </div>

      <button 
        type="submit"
        disabled={!audioBlob}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create My Digital Self
      </button>
    </form>
  );
};

export const PersonaSelector = () => {
  const router = useRouter();
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
        setPersonas(response.data.values.map(p => ({
          ...p,
          gender: p.gender || 'female'
        })));
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
                <div className="ml-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {persona.gender}
                  </span>
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
              onClick={() => router.push('/create-persona')}
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
