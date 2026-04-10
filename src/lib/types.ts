// ─── Assignment Types ─────────────────────────────────────────────────────────

export type AssignmentStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface Assignment {
  assignmentId: string;
  title: string;
  description?: string;
  status: AssignmentStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

// ─── API Request / Response ───────────────────────────────────────────────────

export interface ListAssignmentsResponse {
  items: Assignment[];
  total: number;
  nextToken?: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  status?: AssignmentStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface UpdateAssignmentRequest {
  assignmentId: string;
  title?: string;
  description?: string;
  status?: AssignmentStatus;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface DeleteAssignmentRequest {
  assignmentId: string;
}

export interface DeleteAssignmentResponse {
  message: string;
  assignmentId: string;
}

// ─── Generic API Error ────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
