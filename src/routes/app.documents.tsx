import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/states";

export const Route = createFileRoute("/app/documents")({ component: Documents });

function Documents() {
  return (
    <div>
      <PageHeader title="Documents" description="Upload, search, and track document processing." />
      <EmptyState
        icon={FileText}
        title="Document library is being built"
        description="Upload, filter, metadata, processing status, and preview — wired to the knowledge service — arrive next."
      />
    </div>
  );
}
