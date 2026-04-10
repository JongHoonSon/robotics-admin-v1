"use server";

import { revalidatePath } from "next/cache";
import { createAssignment, updateAssignment, deleteAssignment } from "./api";
import type {
  ActionResult,
  Assignment,
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from "./types";

const ASSIGNMENTS_PATH = "/assignments";

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createAssignmentAction(
  input: CreateAssignmentInput
): Promise<ActionResult<Assignment>> {
  try {
    const data = await createAssignment(input);
    revalidatePath(ASSIGNMENTS_PATH);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateAssignmentAction(
  input: UpdateAssignmentInput
): Promise<ActionResult<Assignment>> {
  try {
    const data = await updateAssignment(input);
    revalidatePath(ASSIGNMENTS_PATH);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteAssignmentAction(
  pc_sn: string
): Promise<ActionResult> {
  try {
    await deleteAssignment({ pc_sn });
    revalidatePath(ASSIGNMENTS_PATH);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
