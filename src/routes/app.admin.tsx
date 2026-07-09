import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";
import { useSession } from "../lib/session";

export const Route = createFileRoute("/app/admin")({ component: Admin });

function Admin() {
  const { isManager, isLoading } = useSession();
  const navigate = useNavigate();

  // RBAC route guard: only owners/admins may view Admin.
  useEffect(() => {
    if (!isLoading && !isManager) navigate({ to: "/app" });
  }, [isLoading, isManager, navigate]);

  if (!isManager) return null;

  return (
    <div>
      <PageHeader
        title="Admin"
        description="RBAC, users, roles, connectors, prompts, and audit logs."
      />
      <EmptyState
        icon={ShieldCheck}
        title="Admin console is being built"
        description="Organizations, users, roles, connector management, and audit logs — wired to identity + admin + audit services — arrive next. (Prompt management needs a new backend endpoint.)"
      />
    </div>
  );
}
