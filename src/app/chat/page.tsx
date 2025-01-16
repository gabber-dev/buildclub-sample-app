import { generateUserToken } from "@/actions";
import { ChatPage } from "@/app/Components/ChatPage";

export default async function Page({ 
  searchParams 
}: { 
  searchParams: { personaId: string; scenarioId: string, voiceId: string }
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
          voiceId: searchParams.voiceId
        }} 
        usageToken={usageToken.token}
        scenarioId={searchParams.scenarioId}
      />
    </div>
  );
} 