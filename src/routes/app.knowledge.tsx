import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/knowledge")({ component: Knowledge });

function Knowledge() {
  return (
    <div>
      <PageHeader
        title="Knowledge"
        description="Semantic search across your organization's documents."
      />
      <EmptyState
        icon={BookOpen}
        title="Knowledge search is being built"
        description="Semantic search with sources, confidence scores, and filters — wired to the knowledge retrieval endpoint — arrives next."
      />
    </div>
  );
}
