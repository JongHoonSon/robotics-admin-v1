"use client";

import type { Assignment } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, TriangleAlert } from "lucide-react";

interface Props {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  isPending: boolean;
}

export function DeleteConfirmDialog({
  assignment,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>배정 삭제</DialogTitle>
              <DialogDescription className="mt-1">
                이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-1 px-1 text-sm text-muted-foreground">
          <p>
            아래 배정 항목을 영구적으로 삭제합니다. 계속하시겠습니까?
          </p>
          {assignment && (
            <div className="mt-3 rounded-md border bg-muted/50 px-3 py-2 font-mono text-xs space-y-1">
              {/* TODO: show actual identifier fields once schema is confirmed */}
              <div>
                <span className="text-muted-foreground">ID: </span>
                <span className="font-semibold text-foreground">{assignment.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Device: </span>
                <span className="font-semibold text-foreground">{assignment.deviceId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Assigned To: </span>
                <span className="font-semibold text-foreground">{assignment.assignedTo}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            id="delete-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            id="delete-confirm-btn"
            type="button"
            variant="destructive"
            disabled={isPending || !assignment}
            onClick={() => assignment && onConfirm(assignment.id)}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
