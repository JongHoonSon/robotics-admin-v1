"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateAssignment } from "@/lib/api";
import type { Assignment, AssignmentStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditAssignmentDialog({
  assignment,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending" as AssignmentStatus,
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  // Sync form when target changes
  useEffect(() => {
    if (assignment) {
      setForm({
        title: assignment.title ?? "",
        description: assignment.description ?? "",
        status: assignment.status ?? "pending",
        assignee: assignment.assignee ?? "",
        priority: assignment.priority ?? "medium",
        dueDate: assignment.dueDate
          ? assignment.dueDate.slice(0, 10)
          : "",
      });
    }
  }, [assignment]);

  const set = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    if (!form.title.trim()) {
      toast.warning("제목을 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      await updateAssignment({
        assignmentId: assignment.assignmentId,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        status: form.status,
        assignee: form.assignee.trim() || undefined,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
      });
      toast.success("수정 완료", { description: `"${form.title}" 항목이 수정되었습니다.` });
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error("수정 실패", {
        description: err instanceof Error ? err.message : "알 수 없는 오류",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>배정 수정</DialogTitle>
          <DialogDescription>
            배정 항목의 정보를 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">
              제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-title"
              placeholder="배정 제목"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">설명</Label>
            <Input
              id="edit-description"
              placeholder="선택 사항"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-status">상태</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as AssignmentStatus)}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">대기</SelectItem>
                  <SelectItem value="in_progress">진행 중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="cancelled">취소</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-priority">우선순위</Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  set("priority", v as "low" | "medium" | "high")
                }
              >
                <SelectTrigger id="edit-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-assignee">담당자</Label>
              <Input
                id="edit-assignee"
                placeholder="담당자 이름"
                value={form.assignee}
                onChange={(e) => set("assignee", e.target.value)}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-due-date">마감일</Label>
              <Input
                id="edit-due-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            id="edit-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            id="edit-submit-btn"
            type="submit"
            form="edit-form"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
