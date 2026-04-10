"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateAssignmentSchema,
  ASSIGNMENT_STATUSES,
  STATUS_LABELS,
} from "@/lib/types";
import type { Assignment, UpdateAssignmentInput } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: UpdateAssignmentInput) => void;
  isPending: boolean;
}

export function EditAssignmentDialog({
  assignment,
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: Props) {
  const form = useForm<UpdateAssignmentInput>({
    resolver: zodResolver(updateAssignmentSchema),
    defaultValues: {
      id: "",
      deviceId: "",
      assignedTo: "",
      status: "pending",
    },
  });

  // Sync form values when assignment target changes
  useEffect(() => {
    if (assignment) {
      form.reset({
        id: assignment.id,
        deviceId: assignment.deviceId,
        assignedTo: assignment.assignedTo,
        status: assignment.status,
      });
    }
  }, [assignment, form]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) form.reset();
    onOpenChange(nextOpen);
  }

  function handleSubmit(values: UpdateAssignmentInput) {
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            배정 항목 정보를 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="edit-assignment-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-2"
          >
            {/* Device ID */}
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input id="edit-deviceId" placeholder="e.g. DEVICE-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assigned To */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input id="edit-assignedTo" placeholder="담당자 이름 또는 ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ASSIGNMENT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            id="edit-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            id="edit-submit-btn"
            type="submit"
            form="edit-assignment-form"
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
