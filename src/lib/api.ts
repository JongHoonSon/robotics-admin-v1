import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import type {
  Assignment,
  ListAssignmentsResponse,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  DeleteAssignmentRequest,
  DeleteAssignmentResponse,
} from "./types";

// ─── Configuration ────────────────────────────────────────────────────────────

const BASE_URL =
  "https://9y7qmb3g0k.execute-api.ap-northeast-2.amazonaws.com";
const REGION = "ap-northeast-2";
const SERVICE = "execute-api";

function getCredentials() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required."
    );
  }

  return { accessKeyId, secretAccessKey, sessionToken };
}

// ─── SigV4 Signer ─────────────────────────────────────────────────────────────

const getSigner = () =>
  new SignatureV4({
    credentials: getCredentials(),
    region: REGION,
    service: SERVICE,
    sha256: Sha256,
  });

// ─── signedFetch ──────────────────────────────────────────────────────────────

export async function signedFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(path, BASE_URL);
  const method = (options.method ?? "GET").toUpperCase();
  const body = options.body as string | undefined;

  // Build headers map
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    host: url.hostname,
  };
  if (options.headers) {
    const raw = options.headers as Record<string, string>;
    Object.entries(raw).forEach(([k, v]) => {
      baseHeaders[k.toLowerCase()] = v;
    });
  }

  const signer = getSigner();

  const signedRequest = await signer.sign({
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
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    let errorMessage: string;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message ?? errorText;
    } catch {
      errorMessage = errorText;
    }
    throw new Error(`[${response.status}] ${errorMessage}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// ─── Typed API Wrappers ───────────────────────────────────────────────────────

/**
 * GET /assignments
 * Returns a list of all assignments.
 */
export async function getAssignments(): Promise<ListAssignmentsResponse> {
  return signedFetch<ListAssignmentsResponse>("/assignments");
}

/**
 * POST /assignments
 * Creates a new assignment.
 */
export async function createAssignment(
  body: CreateAssignmentRequest
): Promise<Assignment> {
  return signedFetch<Assignment>("/assignments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PUT /assignments/{assignmentId}
 * Updates an existing assignment.
 */
export async function updateAssignment(
  body: UpdateAssignmentRequest
): Promise<Assignment> {
  const { assignmentId, ...rest } = body;
  return signedFetch<Assignment>(`/assignments/${assignmentId}`, {
    method: "PUT",
    body: JSON.stringify(rest),
  });
}

/**
 * DELETE /assignments/{assignmentId}
 * Deletes an assignment.
 */
export async function deleteAssignment(
  body: DeleteAssignmentRequest
): Promise<DeleteAssignmentResponse> {
  return signedFetch<DeleteAssignmentResponse>(
    `/assignments/${body.assignmentId}`,
    { method: "DELETE" }
  );
}
