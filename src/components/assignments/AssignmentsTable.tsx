"use client";

import type { Assignment, AssignmentStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<
  AssignmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  inactive: "destructive",
  pending: "secondary",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssignmentsTableProps {
  assignments: Assignment[];
  isPending: boolean;
  onEdit: (a: Assignment) => void;
  onDelete: (a: Assignment) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssignmentsTable({
  assignments,
  isPending,
  onEdit,
  onDelete,
}: AssignmentsTableProps) {
  return (
    <div
      className={`rounded-lg border bg-card overflow-hidden transition-opacity ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[180px]">Device ID</TableHead>
            <TableHead className="w-[160px]">Assigned To</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[160px]">Created At</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending && assignments.length === 0 ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </>
          ) : assignments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                  <PlusCircle className="w-10 h-10 opacity-30" />
                  <p className="text-sm font-medium">No assignments yet</p>
                  <p className="text-xs">
                    "Add Assignment" 버튼을 눌러 첫 항목을 추가하세요.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            assignments.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-mono text-sm font-medium">
                  {item.deviceId}
                </TableCell>
                <TableCell className="text-sm">{item.assignedTo}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      id={`edit-${item.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
                      aria-label="수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      id={`delete-${item.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(item)}
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
