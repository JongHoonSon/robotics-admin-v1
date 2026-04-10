"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Assignment, CreateAssignmentInput, UpdateAssignmentInput } from "@/lib/types";
import {
  createAssignmentAction,
  updateAssignmentAction,
  deleteAssignmentAction,
} from "@/lib/actions";
import { logoutAction } from "@/lib/auth-actions";
import { AssignmentsTable } from "./AssignmentsTable";
import { CreateAssignmentDialog } from "./CreateAssignmentDialog";
import { EditAssignmentDialog } from "./EditAssignmentDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  initialAssignments: Assignment[];
}

export function AssignmentsClient({ initialAssignments }: Props) {
  const [isPending, startTransition] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Assignment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  // ── Create ────────────────────────────────────────────────────────────────

  function handleCreate(input: CreateAssignmentInput) {
    startTransition(async () => {
      const result = await createAssignmentAction(input);
      if (result.success) {
        toast.success("등록 완료", {
          description: `PC S/N "${input.pc_sn}" 할당이 등록되었습니다.`,
        });
        setCreateOpen(false);
      } else {
        toast.error("등록 실패", { description: result.error });
      }
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  function handleUpdate(input: UpdateAssignmentInput) {
    startTransition(async () => {
      const result = await updateAssignmentAction(input);
      if (result.success) {
        toast.success("수정 완료", {
          description: `PC S/N "${input.pc_sn}" 할당이 수정되었습니다.`,
        });
        setEditTarget(null);
      } else {
        toast.error("수정 실패", { description: result.error });
      }
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  function handleDelete(pc_sn: string) {
    startTransition(async () => {
      const result = await deleteAssignmentAction(pc_sn);
      if (result.success) {
        toast.success("삭제 완료", {
          description: `PC S/N "${pc_sn}" 할당 정보가 삭제되었습니다.`,
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
        <div className="max-w-screen-2xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Device Assignments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              기기 할당 정보를 조회하고 관리합니다.
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
      <div className="flex-1 max-w-screen-2xl w-full mx-auto px-6 py-6">
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
        onConfirm={(pc_sn) => handleDelete(pc_sn)}
        isPending={isPending}
      />
    </main>
  );
}
