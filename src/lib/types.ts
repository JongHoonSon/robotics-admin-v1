import { z } from "zod";

// ─── Status ───────────────────────────────────────────────────────────────────

export const ASSIGNMENT_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const STATUS_LABELS: Record<AssignmentStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

// ─── Assignment Entity ────────────────────────────────────────────────────────

export interface Assignment {
  pc_sn: string;          // Primary Key. e.g. "PC-0002"
  remote_sn: string;      // e.g. "RMT-0002"
  thing_name: string;     // IoT Thing name. e.g. "PC-0002-thing"
  customer_name: string;  // e.g. "손종훈"
  customer_phone: string; // e.g. "010-9986-4375"
  location: string;       // e.g. "경기도 성남시 분당구 삼평동"
  frp_address: string;    // FRP 서버 주소. e.g. "http://yantai.karma.pluva.io:7001"
  status: AssignmentStatus;
  created_at: string;     // ISO 8601
  updated_at: string;     // ISO 8601
}

export type CreateAssignmentInput = Omit<Assignment, "created_at" | "updated_at">;
export type UpdateAssignmentInput = Partial<
  Omit<Assignment, "pc_sn" | "created_at" | "updated_at">
> & { pc_sn: string };
export type DeleteAssignmentInput = Pick<Assignment, "pc_sn">;

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const assignmentSchema = z.object({
  pc_sn: z.string().min(1, "PC S/N은 필수입니다"),
  remote_sn: z.string().min(1, "Remote S/N은 필수입니다"),
  thing_name: z.string().min(1, "Thing Name은 필수입니다"),
  customer_name: z.string().min(1, "고객명은 필수입니다"),
  customer_phone: z
    .string()
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)"),
  location: z.string().min(1, "위치는 필수입니다"),
  frp_address: z.string().url("올바른 URL 형식이 아닙니다"),
  status: z.enum(["ACTIVE", "INACTIVE"] as const),
});

export const createAssignmentSchema = assignmentSchema;

export const updateAssignmentSchema = assignmentSchema
  .omit({ pc_sn: true })
  .partial()
  .extend({ pc_sn: z.string().min(1) });

// ─── Action Result ────────────────────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
