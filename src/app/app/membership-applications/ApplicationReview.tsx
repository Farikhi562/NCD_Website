"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Eye, ShieldQuestion } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { TextArea } from "@/components/ui/Field";
import type { MembershipApplication, MembershipCapacity } from "@/lib/database.types";
import { applicationStatusCopy, remainingSlots } from "@/config/membership";
import {
  approveApplication,
  getDocumentUrl,
  markUnderReview,
  rejectApplication,
  type ActionResult,
} from "./actions";

interface Props {
  applications: MembershipApplication[];
  capacity: MembershipCapacity;
}

type Message = { tone: "success" | "error"; text: string };

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <p className="type-caption text-text-muted">{label}</p>
      <div className="type-small mt-1 whitespace-pre-wrap text-text-primary">{value}</div>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function ApplicationReviewList({ applications, capacity }: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message>>({});
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const slotsLeft = remainingSlots(capacity);

  const run = async (applicationId: string, action: () => Promise<ActionResult>) => {
    setBusyId(applicationId);
    const result = await action();
    setBusyId(null);

    if (!result.ok) {
      setMessages((current) => ({
        ...current,
        [applicationId]: { tone: "error", text: result.error ?? "The action could not be completed." },
      }));
      return;
    }

    setConfirmingId(null);
    setRejectingId(null);
    setRejectNote("");
    setMessages((current) => ({ ...current, [applicationId]: { tone: "success", text: "Updated." } }));
    router.refresh();
  };

  const openDocument = async (application: MembershipApplication) => {
    setBusyId(application.id);
    const result = await getDocumentUrl(application.id, application.document_path);
    setBusyId(null);

    if (!result.ok || !result.url) {
      setMessages((current) => ({
        ...current,
        [application.id]: { tone: "error", text: result.error ?? "The document could not be opened." },
      }));
      return;
    }

    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <Card aria-labelledby="capacity-review-heading">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="capacity-review-heading" className="type-h4 text-text-primary">
              Capacity before you decide
            </h2>
            <p className="type-body mt-2 text-text-secondary">
              <span className="font-medium text-text-primary">
                {capacity.confirmed_members} / {capacity.max_members} members
              </span>
              <span className="mx-2 text-text-muted" aria-hidden>
                ·
              </span>
              <span className={slotsLeft === 0 ? "text-danger" : "text-success"}>
                {slotsLeft} spots remaining
              </span>
            </p>
            <p className="type-small mt-1 text-text-muted">
              Approval creates the member record and takes one slot. The database blocks approval once the cap is
              reached.
            </p>
          </div>
          <Badge tone={slotsLeft === 0 ? "danger" : "success"}>
            {slotsLeft === 0 ? "At capacity" : "Approvals open"}
          </Badge>
        </div>
      </Card>

      <ul className="space-y-4">
        {applications.map((application) => {
          const copy = applicationStatusCopy[application.status];
          const expanded = expandedId === application.id;
          const busy = busyId === application.id;
          const message = messages[application.id];
          const isOpen = application.status === "pending" || application.status === "under_review";

          return (
            <li key={application.id}>
              <Card>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <CardTitle>{application.full_name}</CardTitle>
                      <Badge tone={copy.tone}>{copy.label}</Badge>
                      {application.document_type === "KRS" ? (
                        <Badge tone="neutral">KRS</Badge>
                      ) : (
                        <Badge tone="neutral">KTM</Badge>
                      )}
                    </div>
                    <p className="type-small mt-2 text-text-secondary">
                      NPM {application.npm} · {application.study_program}, {application.faculty} · Semester{" "}
                      {application.semester}
                    </p>
                    <p className="type-small mt-1 text-text-muted">
                      Submitted {formatDate(application.submitted_at)}
                      {application.reviewed_at ? ` · Last updated ${formatDate(application.reviewed_at)}` : ""}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    aria-expanded={expanded}
                    aria-controls={`detail-${application.id}`}
                    onClick={() => setExpandedId(expanded ? null : application.id)}
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="size-4" aria-hidden />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4" aria-hidden />
                        Review
                      </>
                    )}
                  </Button>
                </div>

                {message && (
                  <p
                    role={message.tone === "error" ? "alert" : "status"}
                    className={`type-small mt-4 flex items-start gap-2 rounded-md border p-3 ${
                      message.tone === "error"
                        ? "border-danger/40 bg-danger/10 text-danger"
                        : "border-success/40 bg-success/10 text-success"
                    }`}
                  >
                    {message.tone === "error" ? (
                      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    ) : (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
                    )}
                    {message.text}
                  </p>
                )}

                {expanded && (
                  <div id={`detail-${application.id}`} className="mt-6 border-t border-border pt-2">
                    <div className="grid gap-x-8 md:grid-cols-2">
                      <div>
                        <Detail label="Full name" value={application.full_name} />
                        <Detail label="NPM" value={application.npm} />
                        <Detail label="University" value={application.university} />
                        <Detail label="Faculty" value={application.faculty} />
                        <Detail label="Study program" value={application.study_program} />
                        <Detail label="Current semester" value={`Semester ${application.semester}`} />
                      </div>
                      <div>
                        <Detail label="Email" value={application.email} />
                        <Detail label="WhatsApp" value={application.whatsapp} />
                        <Detail label="Verification document" value={application.document_type} />
                        <Detail label="Submitted" value={formatDate(application.submitted_at)} />
                        <Detail label="Last updated" value={formatDate(application.reviewed_at)} />
                        <Detail
                          label="Member record"
                          value={application.member_id ? "Created on approval" : "Not created yet"}
                        />
                      </div>
                    </div>

                    <div className="grid gap-x-8 border-t border-border md:grid-cols-2">
                      <Detail label="Why do you want to join NCD?" value={application.motivation} />
                      <Detail label="Strongest skills or interests" value={application.skills} />
                      <Detail label="What they would like to contribute" value={application.contribution} />
                    </div>

                    {application.review_note && (
                      <div className="mt-4 rounded-md border border-border bg-ncd-dark p-4">
                        <p className="type-caption text-text-muted">Internal note — not shown to the applicant</p>
                        <p className="type-small mt-1 whitespace-pre-wrap text-text-primary">
                          {application.review_note}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={busy && !confirmingId && !rejectingId}
                        disabled={busy && (confirmingId === application.id || rejectingId === application.id)}
                        icon={<Eye className="size-4" aria-hidden />}
                        onClick={() => void openDocument(application)}
                      >
                        View {application.document_type}
                      </Button>

                      {isOpen && confirmingId !== application.id && rejectingId !== application.id && (
                        <>
                          <Button
                            size="sm"
                            disabled={slotsLeft === 0}
                            title={
                              slotsLeft === 0
                                ? "Membership has reached its maximum capacity."
                                : "Create the member record and mark this application approved."
                            }
                            onClick={() => setConfirmingId(application.id)}
                          >
                            Approve
                          </Button>

                          {application.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              loading={busy}
                              icon={<ShieldQuestion className="size-4" aria-hidden />}
                              onClick={() => void run(application.id, () => markUnderReview(application.id))}
                            >
                              Mark under review
                            </Button>
                          )}

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={busy}
                            onClick={() => {
                              setRejectNote("");
                              setRejectingId(application.id);
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {!isOpen && (
                        <p className="type-small text-text-muted">
                          This application is {copy.label.toLowerCase()}; it can no longer be changed.
                        </p>
                      )}
                    </div>

                    {confirmingId === application.id && (
                      <div className="mt-4 rounded-md border border-warning/40 bg-warning/10 p-4">
                        <p className="type-small text-warning">
                          Approving creates an official NCD member from this application and uses one of the{" "}
                          {slotsLeft} remaining slots. The applicant keeps their own record; nothing is published
                          beyond the member directory.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Button
                            size="sm"
                            loading={busy}
                            onClick={() => void run(application.id, () => approveApplication(application.id))}
                          >
                            Create member and approve
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setConfirmingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {rejectingId === application.id && (
                      <div className="mt-4 rounded-md border border-border p-4">
                        <TextArea
                          id={`reject-note-${application.id}`}
                          label="Internal reason (optional)"
                          value={rejectNote}
                          helper="Kept in the admin record only. The applicant sees the status, never this note."
                          maxLength={500}
                          onChange={(event) => setRejectNote(event.target.value)}
                        />
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Button
                            variant="destructive"
                            size="sm"
                            loading={busy}
                            onClick={() =>
                              void run(application.id, () => rejectApplication(application.id, rejectNote))
                            }
                          >
                            Confirm rejection
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectNote("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
