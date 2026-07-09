import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { IntegrationLogo } from "../components/common/IntegrationLogo";
import { PageHeader } from "../components/common/PageHeader";
import { CATEGORIES, INTEGRATIONS } from "../lib/catalog";
import type { Integration, IntegrationCategory } from "../lib/catalog";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/app/connectors")({ component: Connectors });

function Connectors() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<IntegrationCategory | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTEGRATIONS.filter((i) => {
      const matchesCat = active === "all" || i.category === active;
      const matchesQuery =
        !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, active]);

  return (
    <div>
      <PageHeader
        title="Connector Hub"
        description={`${INTEGRATIONS.length}+ supported integrations. Authenticate once, then let your copilots read and act across them.`}
      />

      {/* Search + category filter — the Nango catalog control bar */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search integrations…"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Chip label="All" active={active === "all"} onClick={() => setActive("all")} />
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={active === c} onClick={() => setActive(c)} />
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No integrations match “{query}”.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((i) => (
            <IntegrationCard key={i.slug} integration={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  // No live connection state from the backend yet — every card is an
  // available (not-yet-connected) integration the user can request.
  const [requested, setRequested] = useState(false);

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-primary/50 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <IntegrationLogo
          name={integration.name}
          domain={integration.domain}
          logo={integration.logo}
          className="h-11 w-11"
        />
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {integration.auth ? "Auth" : "Action"}
        </span>
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{integration.name}</div>
        <div className="text-xs text-muted-foreground">{integration.category}</div>
      </div>
      <button
        onClick={() => setRequested((r) => !r)}
        className={cn(
          "mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition",
          requested
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
        )}
      >
        {requested ? (
          <>
            <Check className="h-3.5 w-3.5" /> Requested
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" /> Connect
          </>
        )}
      </button>
    </div>
  );
}
