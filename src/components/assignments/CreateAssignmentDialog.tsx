"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAssignmentSchema, ASSIGNMENT_STATUSES, STATUS_LABELS } from "@/lib/types";
import type { CreateAssignmentInput } from "@/lib/types";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateAssignmentInput) => void;
  isPending: boolean;
}

const DEFAULT_VALUES: CreateAssignmentInput = {
  pc_sn: "",
  remote_sn: "",
  thing_name: "",
  customer_name: "",
  customer_phone: "",
  location: "",
  frp_address: "",
  status: "ACTIVE",
};

export function CreateAssignmentDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: Props) {
  const form = useForm<CreateAssignmentInput>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: DEFAULT_VALUES,
  });

  function handleOpenChange(next: boolean) {
    if (!next) form.reset(DEFAULT_VALUES);
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Assignment</DialogTitle>
          <DialogDescription>새로운 기기 할당 정보를 등록합니다.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="create-assignment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            {/* PC S/N */}
            <FormField
              control={form.control}
              name="pc_sn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PC S/N <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input id="create-pc_sn" placeholder="예: PC-0002" {...field} />
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
                    <Input id="create-remote_sn" placeholder="예: RMT-0002" {...field} />
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
                    <Input id="create-thing_name" placeholder="예: PC-0002-thing" {...field} />
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
                      <Input id="create-customer_name" placeholder="예: 홍길동" {...field} />
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
                      <Input id="create-customer_phone" placeholder="010-1234-5678" {...field} />
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
                    <Input id="create-location" placeholder="예: 경기도 성남시 분당구 삼평동" {...field} />
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
                    <Input id="create-frp_address" placeholder="http://example.io:7001" {...field} />
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
                      <SelectTrigger id="create-status">
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
            id="create-cancel-btn"
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            id="create-submit-btn"
            type="submit"
            form="create-assignment-form"
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
