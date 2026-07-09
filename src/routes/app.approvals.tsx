import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/approvals")({ component: Approvals });

function Approvals() {
  return (
    <div>
      <PageHeader
        title="Approvals"
        description="Review and act on items awaiting a human decision."
      />
      <EmptyState
        icon={ClipboardCheck}
        title="Approval queue is being built"
        description="Pending items, review screen, approve/reject with comments, and an audit timeline — wired to the workflow + audit services — arrive next."
      />
    </div>
  );
}
