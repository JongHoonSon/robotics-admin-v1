"use server";

import { revalidatePath } from "next/cache";
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "./api";
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
    const error = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error };
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
    const error = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error };
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteAssignmentAction(
  id: string
): Promise<ActionResult> {
  try {
    await deleteAssignment({ id });
    revalidatePath(ASSIGNMENTS_PATH);
    return { success: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error };
  }
}
