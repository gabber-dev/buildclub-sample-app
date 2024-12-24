"use client"
import React, { useState } from 'react';
import { ApiProvider } from "gabber-client-react"
import { PersonaSelector } from './Components/PersonaSelector';
import { PersonaCreator } from './Components/PersonaCreator';
import { Brain } from 'lucide-react';

function App(props: { usageToken: string }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <ApiProvider usageToken={props.usageToken}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Brain className="w-12 h-12 text-gray-900 mb-2 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isCreating ? "Create Your Digital Self" : "Select Your Digital Self"}
            </h1>
            <p className="text-gray-600 mb-8">
              {isCreating 
                ? "Design your AI persona by selecting a voice and personality"
                : "Choose a persona to chat with or create a new one"
              }
            </p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            {isCreating ? (
              <>
                <button
                  onClick={() => setIsCreating(false)}
                  className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  ← Back to personas
                </button>
                <PersonaCreator onComplete={() => setIsCreating(false)} />
              </>
            ) : (
              <PersonaSelector onCreateNew={() => setIsCreating(true)} />
            )}
          </div>
        </div>
      </div>
    </ApiProvider>
  );
}

export default App;