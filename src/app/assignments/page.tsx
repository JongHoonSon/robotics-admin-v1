"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import type { Assignment } from "@/lib/types";
import { getAssignments, deleteAssignment } from "@/lib/api";
import AssignmentsTable from "@/components/assignments/AssignmentsTable";
import CreateAssignmentDialog from "@/components/assignments/CreateAssignmentDialog";
import EditAssignmentDialog from "@/components/assignments/EditAssignmentDialog";
import DeleteConfirmDialog from "@/components/assignments/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Assignment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAssignments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getAssignments();
      setAssignments(data.items ?? []);
    } catch (err) {
      toast.error("조회 실패", {
        description: err instanceof Error ? err.message : "알 수 없는 오류",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAssignment({ assignmentId: deleteTarget.assignmentId });
      toast.success("삭제 완료", {
        description: `"${deleteTarget.title}" 항목이 삭제되었습니다.`,
      });
      setDeleteTarget(null);
      await fetchAssignments(true);
    } catch (err) {
      toast.error("삭제 실패", {
        description: err instanceof Error ? err.message : "알 수 없는 오류",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              배정 항목을 조회하고 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              id="refresh-btn"
              variant="outline"
              size="sm"
              onClick={() => fetchAssignments(true)}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`}
              />
              새로 고침
            </Button>
            <Button
              id="create-btn"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              새 배정 추가
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-screen-xl w-full mx-auto px-6 py-6">
        <AssignmentsTable
          assignments={assignments}
          loading={loading}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
      </div>

      {/* Dialogs */}
      <CreateAssignmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => fetchAssignments(true)}
      />

      <EditAssignmentDialog
        assignment={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSuccess={() => fetchAssignments(true)}
      />

      <DeleteConfirmDialog
        assignment={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </main>
  );
}
