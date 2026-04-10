/**
 * Server-only: AWS SigV4 signed API client.
 * This module must NEVER be imported by Client Components.
 * Enforced by the "server-only" package — any client-side import will throw at build time.
 */
import "server-only";

import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { API_CONFIG } from "./config";
import type {
  Assignment,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  DeleteAssignmentRequest,
} from "./types";

// ─── Credentials ──────────────────────────────────────────────────────────────

function getCredentials() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing AWS credentials: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required."
    );
  }

  return { accessKeyId, secretAccessKey, ...(sessionToken ? { sessionToken } : {}) };
}

// ─── SigV4 Signer ─────────────────────────────────────────────────────────────

function getSigner() {
  return new SignatureV4({
    credentials: getCredentials(),
    region: API_CONFIG.REGION,
    service: API_CONFIG.SERVICE,
    sha256: Sha256,
  });
}

// ─── signedFetch ──────────────────────────────────────────────────────────────

export async function signedFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(path, API_CONFIG.BASE_URL);
  const method = (options.method ?? "GET").toUpperCase();
  const body = options.body as string | undefined;

  const baseHeaders: Record<string, string> = {
    "content-type": "application/json",
    host: url.hostname,
  };

  if (options.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(
      ([k, v]) => {
        baseHeaders[k.toLowerCase()] = v;
      }
    );
  }

  const signedRequest = await getSigner().sign({
    method,
    hostname: url.hostname,
    path: url.pathname + url.search,
    headers: baseHeaders,
    body,
    protocol: "https:",
  });

  const response = await fetch(url.toString(), {
    method,
    headers: signedRequest.headers as Record<string, string>,
    body,
    // Ensure Next.js doesn't cache mutation responses
    cache: method === "GET" ? "no-store" : "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    let message: string;
    try {
      message = (JSON.parse(text) as { message?: string }).message ?? text;
    } catch {
      message = text;
    }
    throw new Error(`[${response.status}] ${message}`);
  }

  if (response.status === 204) return {} as T;

  return response.json() as Promise<T>;
}

// ─── Typed API Wrappers ───────────────────────────────────────────────────────

/**
 * GET /assignments
 * TODO: confirm response shape with actual API
 */
export async function getAssignments(): Promise<Assignment[]> {
  return signedFetch<Assignment[]>("/assignments");
}

/**
 * POST /assignments
 * TODO: confirm request/response fields with actual API
 */
export async function createAssignment(
  body: CreateAssignmentInput
): Promise<Assignment> {
  return signedFetch<Assignment>("/assignments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PATCH /assignments
 * Body includes `id` + fields to update.
 * TODO: confirm request/response fields with actual API
 */
export async function updateAssignment(
  body: UpdateAssignmentInput
): Promise<Assignment> {
  return signedFetch<Assignment>("/assignments", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/**
 * DELETE /assignments
 * Body: { id: string }
 * TODO: confirm primary key field name with actual API
 */
export async function deleteAssignment(
  body: DeleteAssignmentRequest
): Promise<{ message: string }> {
  return signedFetch<{ message: string }>("/assignments", {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}
