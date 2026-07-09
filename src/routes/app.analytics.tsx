import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/analytics")({ component: Analytics });

function Analytics() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Usage across AI, workflows, approvals, and connectors."
      />
      <EmptyState
        icon={BarChart3}
        title="Analytics is being built"
        description="Generic metrics (AI requests, workflow executions, approval times, documents processed, connector usage) derived from existing data — arrive next. No dedicated metrics API exists yet, so these will be computed from the real list endpoints."
      />
    </div>
  );
}
