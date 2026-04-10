"use client";

import type { Assignment } from "@/lib/types";
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
import { Pencil, Trash2, PlusCircle, ExternalLink } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 9 }).map((_, i) => (
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
            <TableHead className="w-[110px]">PC S/N</TableHead>
            <TableHead className="w-[110px]">Remote S/N</TableHead>
            <TableHead className="w-[100px]">고객명</TableHead>
            <TableHead className="w-[130px]">연락처</TableHead>
            <TableHead className="w-[200px]">위치</TableHead>
            <TableHead className="w-[160px]">FRP 주소</TableHead>
            <TableHead className="w-[80px]">상태</TableHead>
            <TableHead className="w-[100px]">등록일</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending && assignments.length === 0 ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          ) : assignments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                  <PlusCircle className="w-10 h-10 opacity-30" />
                  <p className="text-sm font-medium">No assignments yet</p>
                  <p className="text-xs">"Add Assignment" 버튼을 눌러 첫 항목을 추가하세요.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            assignments.map((item) => (
              <TableRow
                key={item.pc_sn}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* PC S/N — Primary Key, bold */}
                <TableCell className="font-mono text-sm font-bold">
                  {item.pc_sn}
                </TableCell>

                {/* Remote S/N */}
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {item.remote_sn}
                </TableCell>

                {/* 고객명 */}
                <TableCell className="text-sm">{item.customer_name}</TableCell>

                {/* 연락처 */}
                <TableCell className="text-sm tabular-nums">
                  {item.customer_phone}
                </TableCell>

                {/* 위치 */}
                <TableCell
                  className="text-sm text-muted-foreground max-w-[200px] truncate"
                  title={item.location}
                >
                  {item.location}
                </TableCell>

                {/* FRP 주소 — clickable link */}
                <TableCell className="text-sm">
                  <a
                    href={item.frp_address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 max-w-[150px] truncate"
                    title={item.frp_address}
                  >
                    <span className="truncate">{item.frp_address}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <Badge
                    variant={item.status === "ACTIVE" ? "default" : "secondary"}
                    className={
                      item.status === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-0"
                        : ""
                    }
                  >
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </TableCell>

                {/* 등록일 */}
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {formatDate(item.created_at)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      id={`edit-${item.pc_sn}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
                      aria-label="수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      id={`delete-${item.pc_sn}`}
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
