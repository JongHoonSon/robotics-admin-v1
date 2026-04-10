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
  onConfirm: (pc_sn: string) => void;
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
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>할당 삭제</DialogTitle>
              <DialogDescription className="mt-1">
                이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground px-1">
          PC S/N{" "}
          <span className="font-semibold font-mono text-foreground">
            {assignment?.pc_sn}
          </span>{" "}
          의 할당 정보를 삭제하시겠습니까?
        </p>

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
            onClick={() => assignment && onConfirm(assignment.pc_sn)}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
