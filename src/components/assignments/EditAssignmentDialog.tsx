"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAssignmentSchema, ASSIGNMENT_STATUSES, STATUS_LABELS } from "@/lib/types";
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
      pc_sn: "",
      remote_sn: "",
      thing_name: "",
      customer_name: "",
      customer_phone: "",
      location: "",
      frp_address: "",
      status: "ACTIVE",
    },
  });

  // Pre-fill form when target assignment changes
  useEffect(() => {
    if (assignment) {
      form.reset({
        pc_sn: assignment.pc_sn,
        remote_sn: assignment.remote_sn,
        thing_name: assignment.thing_name,
        customer_name: assignment.customer_name,
        customer_phone: assignment.customer_phone,
        location: assignment.location,
        frp_address: assignment.frp_address,
        status: assignment.status,
      });
    }
  }, [assignment, form]);

  function handleOpenChange(next: boolean) {
    if (!next) form.reset();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            기기 할당 정보를 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="edit-assignment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* PC S/N — disabled on Edit (Primary Key) */}
            <FormField
              control={form.control}
              name="pc_sn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PC S/N</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-pc_sn"
                      disabled
                      className="font-mono bg-muted text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remote S/N */}
            <FormField
              control={form.control}
              name="remote_sn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remote S/N <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input id="edit-remote_sn" placeholder="예: RMT-0002" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thing Name */}
            <FormField
              control={form.control}
              name="thing_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thing Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input id="edit-thing_name" placeholder="예: PC-0002-thing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* 고객명 */}
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>고객명 <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input id="edit-customer_name" placeholder="예: 홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 연락처 */}
              <FormField
                control={form.control}
                name="customer_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연락처 <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input id="edit-customer_phone" placeholder="010-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 위치 */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>위치 <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input id="edit-location" placeholder="예: 경기도 성남시 분당구 삼평동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FRP 주소 */}
            <FormField
              control={form.control}
              name="frp_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FRP 주소 <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input id="edit-frp_address" placeholder="http://example.io:7001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 상태 */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상태 <span className="text-destructive">*</span></FormLabel>
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
