import { generateUserToken } from "@/actions";
import { ChatPage } from "@/app/Components/ChatPage";

export default async function Page({ 
  searchParams 
}: { 
  searchParams: { personaId: string; scenarioId: string }
}) {
  const usageToken = await generateUserToken();
  
  if (!searchParams.personaId || !searchParams.scenarioId) {
    return <div>Missing required parameters</div>;
  }

  return (
    <div className="h-screen">
      <ChatPage 
        personaId={searchParams.personaId} 
        persona={{
          id: searchParams.personaId,
          name: "AI Assistant",
          description: "",
          gender: "female",
          voiceId: "0b6c25ce-cc8d-4558-844e-4f61c00cc264"
        }} 
        usageToken={usageToken.token}
        scenarioId={searchParams.scenarioId}
      />
    </div>
  );
} 