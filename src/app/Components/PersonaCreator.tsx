"use client";
import React, { useState, useEffect } from "react";
import { useApi } from "gabber-client-react";

interface PersonaFormData {
  name: string;
  description: string;
  gender: "male" | "female";
  voiceId: string;
}

interface Voice {
  id: string;
  name: string;
}

export const PersonaCreator = ({ onComplete }: { onComplete: () => void }) => {
  const { api } = useApi();
  const [formData, setFormData] = useState<PersonaFormData>({
    name: "",
    description: "",
    gender: "male",
    voiceId: "",
  });

  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsLoadingVoices(true);
        const response = await api.voice.listVoices();
        console.log('Fetched voices:', response.data.values);
        setVoices(response.data.values || []);
      } catch (err) {
        console.error("Error fetching voices:", err);
      } finally {
        setIsLoadingVoices(false);
      }
    };

    fetchVoices();
  }, [api]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log('handleChange:', name, value);

    if (name === "voice") {
      const foundVoice = voices.find((voice) => voice.id === value);
      console.log('Found voice:', foundVoice);
      if (foundVoice) {
        setSelectedVoice(foundVoice);
        setFormData((prev) => {
          const updated = { ...prev, voiceId: foundVoice.id };
          console.log('Updated formData:', updated);
          return updated;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVoice) {
      alert("Please select a voice before creating the persona.");
      return;
    }

    try {
      console.log('voice form', selectedVoice?.id);
      await api.persona.createPersona({
        name: formData.name,
        description: formData.description || "",
        gender: formData.gender || "male",
        voice: selectedVoice.id,
      });

      onComplete();
    } catch (err) {
      console.error("Error creating persona:", err);
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        <h2 className="text-lg font-medium mb-4">Create Your Persona</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assign Voice</label>
          <pre className="text-xs text-gray-500 mt-1">
            {JSON.stringify({ selectedVoice, formDataVoiceId: formData.voiceId }, null, 2)}
          </pre>
          {isLoadingVoices ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <select
              name="voice"
              value={formData.voiceId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
              required
            >
              <option value="">Select a voice</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Persona
        </button>
      </form>
    </div>
  );
};
