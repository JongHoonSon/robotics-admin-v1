"use client";

import type { Assignment, AssignmentStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AssignmentStatus, string> = {
  pending: "대기",
  in_progress: "진행 중",
  completed: "완료",
  cancelled: "취소",
};

const STATUS_VARIANTS: Record<
  AssignmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
};

function StatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PRIORITY_LABELS = { low: "낮음", medium: "보통", high: "높음" } as const;
const PRIORITY_VARIANTS = {
  low: "outline",
  medium: "secondary",
  high: "default",
} as const;

function PriorityBadge({ priority }: { priority?: "low" | "medium" | "high" }) {
  if (!priority) return <span className="text-muted-foreground text-xs">-</span>;
  return (
    <Badge variant={PRIORITY_VARIANTS[priority] as "default" | "secondary" | "outline" | "destructive"}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}

// ─── Date formatter ───────────────────────────────────────────────────────────

function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow>
      {[...Array(7)].map((_, i) => (
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
  loading: boolean;
  onEdit: (a: Assignment) => void;
  onDelete: (a: Assignment) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssignmentsTable({
  assignments,
  loading,
  onEdit,
  onDelete,
}: AssignmentsTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">제목</TableHead>
            <TableHead>설명</TableHead>
            <TableHead className="w-[100px]">상태</TableHead>
            <TableHead className="w-[80px]">우선순위</TableHead>
            <TableHead className="w-[120px]">담당자</TableHead>
            <TableHead className="w-[110px]">마감일</TableHead>
            <TableHead className="w-[60px] text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : assignments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center h-32 text-muted-foreground"
              >
                배정 항목이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            assignments.map((item) => (
              <TableRow key={item.assignmentId} className="hover:bg-muted/30">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[260px] truncate">
                  {item.description ?? "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={item.priority} />
                </TableCell>
                <TableCell className="text-sm">
                  {item.assignee ?? "-"}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(item.dueDate)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      id={`actions-${item.assignmentId}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">작업 메뉴</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        id={`edit-${item.assignmentId}`}
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        id={`delete-${item.assignmentId}`}
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
