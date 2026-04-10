// TODO: replace with actual schema once confirmed

import { z } from "zod";

// ─── Status ───────────────────────────────────────────────────────────────────

export const ASSIGNMENT_STATUSES = ["active", "inactive", "pending"] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const STATUS_LABELS: Record<AssignmentStatus, string> = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
};

// ─── Assignment Entity ────────────────────────────────────────────────────────

// TODO: replace with actual schema once confirmed
export interface Assignment {
  id: string;
  deviceId: string;
  assignedTo: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

// TODO: replace with actual schema once confirmed
export const createAssignmentSchema = z.object({
  deviceId: z.string().min(1, "Device ID는 필수입니다."),
  assignedTo: z.string().min(1, "담당자는 필수입니다."),
  status: z.enum([...ASSIGNMENT_STATUSES] as [string, ...string[]], {
    error: "상태를 선택해 주세요.",
  }),
});

export const updateAssignmentSchema = createAssignmentSchema.extend({
  id: z.string().min(1),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;

// ─── API Request / Response ───────────────────────────────────────────────────

// TODO: replace with actual schema once confirmed
export interface DeleteAssignmentRequest {
  id: string;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
