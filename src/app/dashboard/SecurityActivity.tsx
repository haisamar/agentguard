"use client";

import { useEffect, useState } from "react";

import {
  identityName,
  identityType,
} from "@/lib/agent-identities";

export type SecurityAuditEvent = {
  id: string;
  identity: string;
  action: string;
  decision: string;
  required_scope: string | null;
  reason: string | null;
  approval_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};


function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function decisionStyles(decision: string) {
  switch (decision) {
    case "ALLOW":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "APPROVED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "APPROVAL_REQUIRED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "DENY":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-300";
  }
}

function identityTypeStyles(type: string) {
  switch (type) {
    case "Human":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "Machine":
      return "border-violet-500/20 bg-violet-500/10 text-violet-400";

    case "System":
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400";

    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-400";
  }
}

function decisionDot(decision: string) {
  switch (decision) {
    case "DENY":
      return "bg-red-400";

    case "APPROVAL_REQUIRED":
      return "bg-amber-400";

    case "APPROVED":
      return "bg-blue-400";

    case "ALLOW":
      return "bg-emerald-400";

    default:
      return "bg-zinc-500";
  }
}

function formatMetadataKey(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatMetadataValue(value: unknown) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export function SecurityActivity({
  events,
  totalCount,
}: {
  events: SecurityAuditEvent[];
  totalCount: number;
}) {
  const [selectedEvent, setSelectedEvent] =
    useState<SecurityAuditEvent | null>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <div>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                Security Activity
              </h3>

              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Persisted Audit
              </span>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Authorization and policy decisions. Select an event to inspect
              its security context.
            </p>
          </div>

          <span className="text-xs text-zinc-600">
            Latest {Math.min(totalCount, events.length)}
          </span>
        </div>

        <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          {events.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-zinc-400">
                No security events yet
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Authorization decisions will appear here.
              </p>
            </div>
          ) : (
            events.map((event, index) => {
              const type = identityType(event.identity);

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className={`group flex w-full gap-4 p-4 text-left transition hover:bg-white/[0.035] ${
                    index !== events.length - 1
                      ? "border-b border-white/[0.06]"
                      : ""
                  }`}
                >
                  <div className="mt-1.5">
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${decisionDot(
                        event.decision
                      )}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-zinc-200">
                        {identityName(event.identity)}
                      </p>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${identityTypeStyles(
                          type
                        )}`}
                      >
                        {type}
                      </span>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${decisionStyles(
                          event.decision
                        )}`}
                      >
                        {event.decision}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-zinc-400">
                      {formatAction(event.action)}
                    </p>

                    {event.reason && (
                      <p className="mt-1.5 text-xs leading-5 text-zinc-600">
                        {event.reason}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-600">
                      {event.required_scope && (
                        <span>
                          Scope:{" "}
                          <span className="font-mono">
                            {event.required_scope}
                          </span>
                        </span>
                      )}

                      {event.approval_id && (
                        <span className="font-mono">
                          {event.approval_id}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-start gap-3">
                    <span className="whitespace-nowrap text-xs text-zinc-600">
                      {formatTime(event.created_at)}
                    </span>

                    <span className="text-lg leading-none text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-400">
                      ›
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* SECURITY EVENT DRAWER */}

      {selectedEvent && (
        <>
          <button
            type="button"
            aria-label="Close security event"
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 z-40 cursor-default bg-black/65 backdrop-blur-[1px]"
          />

          <aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-[540px] overflow-y-auto border-l border-white/10 bg-[#0b0c0f] shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0c0f]/95 px-7 py-6 backdrop-blur">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${decisionDot(
                        selectedEvent.decision
                      )}`}
                    />

                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                      Security Event
                    </p>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold">
                    {formatAction(selectedEvent.action)}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Authorization decision details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xl text-zinc-500 transition hover:bg-white/5 hover:text-white"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 p-7">
              {/* DECISION */}

              <section>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                  Decision
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${decisionStyles(
                      selectedEvent.decision
                    )}`}
                  >
                    {selectedEvent.decision}
                  </span>

                  {selectedEvent.reason && (
                    <p className="text-sm text-zinc-400">
                      {selectedEvent.reason}
                    </p>
                  )}
                </div>
              </section>

              {/* IDENTITY */}

              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                      Identity
                    </p>

                    <p className="mt-2 font-medium text-zinc-200">
                      {identityName(selectedEvent.identity)}
                    </p>
                  </div>

                  <span
                    className={`rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-wider ${identityTypeStyles(
                      identityType(selectedEvent.identity)
                    )}`}
                  >
                    {identityType(selectedEvent.identity)}
                  </span>
                </div>

                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Raw Identity
                  </p>

                  <p className="mt-2 break-all font-mono text-xs leading-5 text-zinc-500">
                    {selectedEvent.identity}
                  </p>
                </div>
              </section>

              {/* SECURITY CONTEXT */}

              <section>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                  Security Context
                </p>

                <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                  <DetailRow
                    label="Action"
                    value={selectedEvent.action}
                    mono
                  />

                  <DetailRow
                    label="Required Scope"
                    value={selectedEvent.required_scope || "—"}
                    mono={Boolean(selectedEvent.required_scope)}
                  />

                  <DetailRow
                    label="Approval"
                    value={selectedEvent.approval_id || "—"}
                    mono={Boolean(selectedEvent.approval_id)}
                  />

                  <DetailRow
                    label="Timestamp"
                    value={formatTime(selectedEvent.created_at)}
                  />

                  <DetailRow
                    label="Event ID"
                    value={selectedEvent.id}
                    mono
                    last
                  />
                </div>
              </section>

              {/* METADATA */}

              <section>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                  Event Metadata
                </p>

                {selectedEvent.metadata &&
                Object.keys(selectedEvent.metadata).length > 0 ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                    {Object.entries(selectedEvent.metadata).map(
                      ([key, value], index, entries) => (
                        <DetailRow
                          key={key}
                          label={formatMetadataKey(key)}
                          value={formatMetadataValue(value)}
                          mono={
                            key.includes("scope") ||
                            key.includes("identity") ||
                            key.includes("approval") ||
                            key.includes("account")
                          }
                          last={index === entries.length - 1}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm text-zinc-600">
                      No additional metadata recorded.
                    </p>
                  </div>
                )}
              </section>

              {/* AUDIT NOTE */}

              <section className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.025] p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-blue-400">
                  Audit Integrity
                </p>

                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  This event was recorded by AgentGuard when the authorization
                  or policy decision occurred. Dashboard users can inspect the
                  event but cannot modify it from this interface.
                </p>
              </section>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  last = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[150px_1fr] gap-4 px-4 py-3.5 ${
        !last ? "border-b border-white/[0.06]" : ""
      }`}
    >
      <span className="text-xs text-zinc-600">
        {label}
      </span>

      <span
        className={`break-words text-xs leading-5 text-zinc-300 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}