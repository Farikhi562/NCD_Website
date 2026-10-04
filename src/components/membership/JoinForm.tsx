"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, FileUp, Loader2, LogIn, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Field, InputWithIcon, TextArea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import type { MembershipApplication, MembershipCapacity } from "@/lib/database.types";
import {
  ACCEPTED_DOCUMENT_LABEL,
  ACCEPTED_DOCUMENT_TYPES,
  MAX_ANSWER_LENGTH,
  MAX_DOCUMENT_BYTES,
  MAX_SEMESTER,
  NCD_UNIVERSITY,
  VERIFICATION_BUCKET,
  VERIFICATION_DOCUMENT_TYPES,
  applicationStatusCopy,
  isFull,
} from "@/config/membership";
import { applicationSchema, type FieldError } from "@/lib/membership/validation";

const OWN_APPLICATION_COLUMNS =
  "id, status, submitted_at, reviewed_at, document_type, full_name";

type FormValues = {
  full_name: string;
  npm: string;
  university: string;
  faculty: string;
  study_program: string;
  semester: number | "";
  email: string;
  whatsapp: string;
  motivation: string;
  skills: string;
  contribution: string;
  document_type: (typeof VERIFICATION_DOCUMENT_TYPES)[number];
  consent: boolean;
};

const emptyValues: FormValues = {
  full_name: "",
  npm: "",
  university: NCD_UNIVERSITY,
  faculty: "",
  study_program: "",
  semester: "",
  email: "",
  whatsapp: "",
  motivation: "",
  skills: "",
  contribution: "",
  document_type: "KRS",
  consent: false,
};

const semesterOptions = Array.from({ length: MAX_SEMESTER }, (_, index) => index + 1);

export function JoinForm({ initialCapacity }: { initialCapacity: MembershipCapacity }) {
  const { status: authStatus, user, profile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [existing, setExisting] = useState<MembershipApplication | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const uploadedSignature = useRef<string | null>(null);

  // Prefill what the account already knows; the applicant still confirms it.
  // Guarded so the setState only runs once, when the account data arrives.
  const profileName = profile?.full_name ?? "";
  const accountEmail = user?.email ?? "";
  const prefillRef = useRef(false);
  useEffect(() => {
    if (!prefillRef.current && (profileName || accountEmail)) {
      prefillRef.current = true;
      setValues((current) => ({
        ...current,
        full_name: current.full_name || profileName,
        email: current.email || accountEmail,
      }));
    }
  }, [profileName, accountEmail]);

  // Does this account already have an application? (RLS: only their own rows.)
  useEffect(() => {
    if (authStatus !== "authenticated" || !user) return;
    let cancelled = false;

    supabase
      .from("membership_applications")
      .select(OWN_APPLICATION_COLUMNS)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) setExisting(data as unknown as MembershipApplication);
        setLoadState("ready");
      });

    return () => {
      cancelled = true;
    };
  }, [authStatus, user, supabase]);

  const buildRecord = (overrides: Partial<Record<string, unknown>> = {}) => ({
    full_name: values.full_name,
    npm: values.npm,
    university: values.university,
    faculty: values.faculty,
    study_program: values.study_program,
    semester: values.semester === "" ? 0 : Number(values.semester),
    email: values.email,
    whatsapp: values.whatsapp,
    motivation: values.motivation,
    skills: values.skills,
    contribution: values.contribution,
    document_type: values.document_type,
    document_path: uploadedPath ?? "",
    consent: values.consent,
    ...overrides,
  });

  const validateOnBlur = (field: string) => {
    const result = applicationSchema.safeParse(buildRecord());
    const issue = result.success ? undefined : result.error.issues.find((i) => String(i.path[0]) === field);
    setErrors((current) => {
      const next = { ...current };
      if (issue) next[field] = issue.message;
      else delete next[field];
      return next;
    });
  };

  const setField = (field: keyof FormValues, value: string | number | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  };

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    setFileError(null);
    setFormError(null);
    if (selected) {
      const signature = `${selected.name}:${selected.size}`;
      if (uploadedSignature.current !== signature) {
        setUploadedPath(null);
        uploadedSignature.current = null;
      }
    }
  };

  const uploadDocument = async (): Promise<string | null> => {
    if (!file || !user) {
      setFileError("Upload your student verification document.");
      return null;
    }

    if (!(ACCEPTED_DOCUMENT_TYPES as readonly string[]).includes(file.type)) {
      setFileError(`Accepted formats: ${ACCEPTED_DOCUMENT_LABEL}.`);
      return null;
    }

    if (file.size > MAX_DOCUMENT_BYTES) {
      setFileError("The document must be 5 MB or smaller.");
      return null;
    }

    const signature = `${file.name}:${file.size}`;
    if (uploadedPath && uploadedSignature.current === signature) return uploadedPath;

    const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(-60) || "document";
    const path = `${user.id}/${Date.now()}-${safeName}`;

    setUploading(true);
    const { error } = await supabase.storage.from(VERIFICATION_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    setUploading(false);

    if (error) {
      setFileError(error.message || "The document could not be uploaded. Try a smaller file.");
      return null;
    }

    uploadedSignature.current = signature;
    setUploadedPath(path);
    return path;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setErrors({});
    setFileError(null);

    if (!user) {
      setFormError("Sign in to submit your application.");
      return;
    }

    // Validate the questions first, so no document is uploaded for a broken form.
    const precheck = applicationSchema.safeParse(buildRecord({ document_path: `${user.id}/pending` }));
    if (!precheck.success) {
      const next: Record<string, string> = {};
      for (const issue of precheck.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
      setErrors(next);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const documentPath = await uploadDocument();
    if (!documentPath) return;

    const payload = buildRecord({ document_path: documentPath });
    const finalCheck = applicationSchema.safeParse(payload);
    if (!finalCheck.success) {
      const next: Record<string, string> = {};
      for (const issue of finalCheck.error.issues) next[String(issue.path[0] ?? "form")] = issue.message;
      setErrors(next);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/membership-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        setSubmitted(true);
        return;
      }

      const fieldErrors = (body.fieldErrors ?? []) as FieldError[];
      if (fieldErrors.length > 0) {
        const next: Record<string, string> = {};
        for (const issue of fieldErrors) next[issue.field] = issue.message;
        setErrors(next);
      }

      if (body.code === "DUPLICATE_APPLICATION" && body.application) {
        setExisting(body.application as MembershipApplication);
        setFormError(body.error as string);
        return;
      }

      setFormError((body.error as string) || "Your application could not be submitted. Please try again.");
    } catch {
      setFormError("Your application could not be submitted. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authStatus === "checking" || (authStatus === "authenticated" && loadState === "loading")) {
    return (
      <Card className="flex items-center gap-3" aria-busy="true">
        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
        <p className="type-small text-text-secondary">Loading your application…</p>
      </Card>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <Card>
        <CardTitle>Sign in to apply</CardTitle>
        <p className="type-body mt-3 max-w-[60ch] text-text-secondary">
          Membership applications are tied to an NCD account, so the team always knows who applied. Signing in takes a
          moment; you will come straight back here.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/login?redirect=/join">
            <LogIn className="size-4" aria-hidden />
            Sign in to apply
          </ButtonLink>
          <ButtonLink href="/register" variant="secondary">
            <UserPlus className="size-4" aria-hidden />
            Create an account
          </ButtonLink>
        </div>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
          <div>
            <CardTitle>Application submitted</CardTitle>
            <p className="type-body mt-3 max-w-[60ch] text-text-secondary">
              Your application is now waiting for review. You can follow its status at any time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/app/application">View my application</ButtonLink>
              <ButtonLink href="/" variant="ghost">
                Back to home
              </ButtonLink>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (existing) {
    const copy = applicationStatusCopy[existing.status];
    return (
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={copy.tone}>{copy.label}</Badge>
          <span className="type-small text-text-muted">
            Submitted {new Date(existing.submitted_at).toLocaleDateString("en-GB")}
          </span>
        </div>
        <CardTitle className="mt-4">{copy.title}</CardTitle>
        <p className="type-body mt-3 max-w-[60ch] text-text-secondary">{copy.description}</p>
        <div className="mt-6">
          <ButtonLink href="/app/application">Open my application</ButtonLink>
        </div>
      </Card>
    );
  }

  if (isFull(initialCapacity)) {
    return (
      <Card>
        <CardTitle>NCD Membership is Full</CardTitle>
        <p className="type-body mt-3 max-w-[60ch] text-text-secondary">
          NCD has currently reached its maximum membership capacity of {initialCapacity.max_members} members.
        </p>
      </Card>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card>
        <CardTitle>Your details</CardTitle>
        <p className="type-small mt-2 text-text-secondary">
          Required fields are marked. Nothing here is published publicly.
        </p>

        {(formError || errorList.length > 0) && (
          <div role="alert" className="mt-4 rounded-md border border-danger/40 bg-danger/10 p-4">
            <p className="type-small flex items-center gap-2 font-medium text-danger">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {formError ?? "Please fix the highlighted fields."}
            </p>
            {errorList.length > 0 && (
              <ul className="type-small mt-2 list-disc space-y-1 pl-5 text-text-secondary">
                {errorList.map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InputWithIcon
            id="full_name"
            label="Full name"
            required
            value={values.full_name}
            error={errors.full_name}
            onBlur={() => validateOnBlur("full_name")}
            onChange={(event) => setField("full_name", event.target.value)}
            placeholder="As written on your student ID"
          />
          <InputWithIcon
            id="npm"
            label="NPM"
            required
            value={values.npm}
            error={errors.npm}
            helper="Your Gunadarma student number."
            onBlur={() => validateOnBlur("npm")}
            onChange={(event) => setField("npm", event.target.value)}
            placeholder="e.g. 50425672"
          />
          <InputWithIcon
            id="university"
            label="University"
            required
            readOnly
            aria-readonly="true"
            title="NCD is only for Universitas Gunadarma students."
            value={values.university}
            onChange={() => undefined}
            helper="NCD accepts Universitas Gunadarma students only."
          />
          <InputWithIcon
            id="faculty"
            label="Faculty"
            required
            value={values.faculty}
            error={errors.faculty}
            onBlur={() => validateOnBlur("faculty")}
            onChange={(event) => setField("faculty", event.target.value)}
            placeholder="e.g. Teknik Informatika"
          />
          <InputWithIcon
            id="study_program"
            label="Study program"
            required
            value={values.study_program}
            error={errors.study_program}
            onBlur={() => validateOnBlur("study_program")}
            onChange={(event) => setField("study_program", event.target.value)}
            placeholder="e.g. Teknik Komputer"
          />
          <Select
            id="semester"
            label="Current semester"
            required
            value={values.semester === "" ? "" : String(values.semester)}
            error={errors.semester}
            onBlur={() => validateOnBlur("semester")}
            onChange={(event) => setField("semester", event.target.value === "" ? "" : Number(event.target.value))}
          >
            <option value="">Select semester</option>
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </Select>
          <InputWithIcon
            id="email"
            label="Email"
            type="email"
            required
            value={values.email}
            error={errors.email}
            helper="Used only to contact you about this application."
            onBlur={() => validateOnBlur("email")}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="you@example.com"
          />
          <InputWithIcon
            id="whatsapp"
            label="WhatsApp"
            type="tel"
            required
            value={values.whatsapp}
            error={errors.whatsapp}
            onBlur={() => validateOnBlur("whatsapp")}
            onChange={(event) => setField("whatsapp", event.target.value)}
            placeholder="e.g. 081234567890"
          />
        </div>
      </Card>

      <Card>
        <CardTitle>Why NCD?</CardTitle>
        <p className="type-small mt-2 text-text-secondary">
          Three short answers. Maximum {MAX_ANSWER_LENGTH} characters each.
        </p>
        <div className="mt-6 space-y-5">
          <TextArea
            id="motivation"
            label="Why do you want to join NCD?"
            required
            value={values.motivation}
            error={errors.motivation}
            helper={`Maximum ${MAX_ANSWER_LENGTH} characters.`}
            maxLength={MAX_ANSWER_LENGTH}
            onBlur={() => validateOnBlur("motivation")}
            onChange={(event) => setField("motivation", event.target.value)}
            placeholder="What draws you to the community?"
          />
          <TextArea
            id="skills"
            label="What are your strongest skills or areas of interest?"
            required
            value={values.skills}
            error={errors.skills}
            helper={`Maximum ${MAX_ANSWER_LENGTH} characters.`}
            maxLength={MAX_ANSWER_LENGTH}
            onBlur={() => validateOnBlur("skills")}
            onChange={(event) => setField("skills", event.target.value)}
            placeholder="Development, design, competition, writing…"
          />
          <TextArea
            id="contribution"
            label="What would you like to contribute to NCD?"
            required
            value={values.contribution}
            error={errors.contribution}
            helper={`Maximum ${MAX_ANSWER_LENGTH} characters.`}
            maxLength={MAX_ANSWER_LENGTH}
            onBlur={() => validateOnBlur("contribution")}
            onChange={(event) => setField("contribution", event.target.value)}
            placeholder="Projects, mentoring, documentation…"
          />
        </div>
      </Card>

      <Card>
        <CardTitle>Student verification</CardTitle>
        <p className="type-small mt-2 text-text-secondary">
          Your KRS or KTM is stored in a private bucket. It is never shown on public pages and is only opened by NCD
          administrators during review.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Select
            id="document_type"
            label="Verification document"
            required
            value={values.document_type}
            error={errors.document_type}
            onChange={(event) => setField("document_type", event.target.value)}
          >
            {VERIFICATION_DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Field
            id="document_file"
            label="Upload document"
            required
            error={fileError ?? errors.document_path}
            helper={ACCEPTED_DOCUMENT_LABEL}
          >
            <div className="flex items-center gap-3">
              <input
                id="document_file"
                type="file"
                accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                aria-invalid={fileError ? true : undefined}
                aria-describedby={fileError ? "document_file-error" : "document_file-helper"}
                onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                className="type-small w-full text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-ncd-hover file:px-3 file:py-2 file:type-small file:text-text-primary"
              />
              {uploading && <Loader2 className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden />}
            </div>
          </Field>
        </div>

        <div className="mt-6 rounded-md border border-border bg-ncd-dark p-4">
          <label htmlFor="consent" className="flex cursor-pointer items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={values.consent}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              onChange={(event) => setField("consent", event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-ncd-electric"
            />
            <span className="type-small text-text-secondary">
              I confirm that the information I provided is accurate, that the student verification document belongs to
              me, that these materials are used only to verify my application, and that submitting an application does
              not by itself make me an NCD member. I agree to the{" "}
              <Link href="/terms" className="text-ncd-lavender underline-offset-4 hover:underline">
                NCD Terms
              </Link>
              .
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" role="alert" className="type-small mt-2 flex items-center gap-2 text-danger">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {errors.consent}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit" loading={submitting} icon={<FileUp className="size-4" aria-hidden />}>
            Submit application
          </Button>
          <p className="type-small text-text-muted">
            {initialCapacity.confirmed_members} / {initialCapacity.max_members} members today
          </p>
        </div>
      </Card>
    </form>
  );
}
