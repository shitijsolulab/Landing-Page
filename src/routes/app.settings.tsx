import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Tenant, profile, security, and provider configuration."
      />
      <EmptyState
        icon={Settings}
        title="Settings is being built"
        description="Tenant settings, profile, security, notifications, and LLM providers — wired to identity + admin services — arrive next. (API keys and LLM-provider config need new backend endpoints.)"
      />
    </div>
  );
}
