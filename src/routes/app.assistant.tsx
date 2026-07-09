import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/assistant")({ component: Assistant });

function Assistant() {
  return (
    <div>
      <PageHeader title="AI Assistant" description="Chat grounded in your organization's data." />
      <EmptyState
        icon={Bot}
        title="Assistant is being built"
        description="Streaming chat, document upload, citations, and history — wired to the orchestrator service — arrive in the next build step."
      />
    </div>
  );
}
