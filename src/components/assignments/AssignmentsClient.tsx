"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Assignment } from "@/lib/types";
import {
  createAssignmentAction,
  updateAssignmentAction,
  deleteAssignmentAction,
} from "@/lib/actions";
import type { CreateAssignmentInput, UpdateAssignmentInput } from "@/lib/types";
import { AssignmentsTable } from "./AssignmentsTable";
import { CreateAssignmentDialog } from "./CreateAssignmentDialog";
import { EditAssignmentDialog } from "./EditAssignmentDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  initialAssignments: Assignment[];
}

/**
 * Client Component — manages dialog state and delegates mutations
 * to Server Actions via useTransition.
 */
export function AssignmentsClient({ initialAssignments }: Props) {
  const [isPending, startTransition] = useTransition();

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Assignment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  // ── Create ────────────────────────────────────────────────────────────────

  function handleCreate(input: CreateAssignmentInput) {
    startTransition(async () => {
      const result = await createAssignmentAction(input);
      if (result.success) {
        toast.success("생성 완료", {
          description: `Device "${input.deviceId}" 배정이 추가되었습니다.`,
        });
        setCreateOpen(false);
      } else {
        toast.error("생성 실패", { description: result.error });
      }
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  function handleUpdate(input: UpdateAssignmentInput) {
    startTransition(async () => {
      const result = await updateAssignmentAction(input);
      if (result.success) {
        toast.success("수정 완료", {
          description: `Device "${input.deviceId}" 배정이 수정되었습니다.`,
        });
        setEditTarget(null);
      } else {
        toast.error("수정 실패", { description: result.error });
      }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAssignmentAction(id);
      if (result.success) {
        toast.success("삭제 완료", {
          description: "배정 항목이 삭제되었습니다.",
        });
        setDeleteTarget(null);
      } else {
        toast.error("삭제 실패", { description: result.error });
      }
    });
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Device Assignments
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              기기 배정 항목을 조회하고 관리합니다.
            </p>
          </div>
          <Button
            id="add-assignment-btn"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Assignment
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 max-w-screen-xl w-full mx-auto px-6 py-6">
        <AssignmentsTable
          assignments={initialAssignments}
          isPending={isPending}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
      </div>

      {/* Dialogs */}
      <CreateAssignmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isPending={isPending}
      />

      <EditAssignmentDialog
        assignment={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSubmit={handleUpdate}
        isPending={isPending}
      />

      <DeleteConfirmDialog
        assignment={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={(id) => handleDelete(id)}
        isPending={isPending}
      />
    </main>
  );
}
