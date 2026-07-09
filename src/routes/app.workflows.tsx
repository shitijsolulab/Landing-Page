import { createFileRoute } from "@tanstack/react-router";
import { Workflow } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/workflows")({ component: Workflows });

function Workflows() {
  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Every durable workflow across your organization."
      />
      <EmptyState
        icon={Workflow}
        title="Workflow queue is being built"
        description="Name, status, owner, started, waiting-for, and last-updated — wired to the workflow service — arrive next."
      />
    </div>
  );
}
