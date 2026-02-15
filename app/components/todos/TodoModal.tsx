import React, { useState, useEffect, useMemo } from "react";
import { useFetcher } from "react-router";
import { format } from "date-fns";

import { cn } from "~/lib/utils";

import { useNavItems } from "~/hooks/useNavItems";

import type { Todo } from "~/types/todo";

import { Calendar as CalendarIcon, Flag, Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { de } from "zod/v4/locales";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
}

const defaultTask = {
  intent: "create",
  title: "",
  description: "",
  status: "",
  priority: "medium",
  dueDate: "",
};

export default function TaskModal({ isOpen, onClose, todo }: Props) {
  const [formData, setFormData] = useState(defaultTask);
  const fetcher = useFetcher({ key: "todo-form" });
  const isEditing = !!todo?.$id;

  const { activeNavItem } = useNavItems();

  useEffect(() => {
    if (todo) {
      setFormData({
        intent: "update",
        ...todo,
        dueDate: todo.dueDate || "",
      });
    } else {
      setFormData({
        ...defaultTask,
        status: activeNavItem?.id || "backlog",
      });
    }
  }, [todo, isOpen]);

  useEffect(() => {
    if (fetcher.state === "loading" && fetcher.data) {
      if (fetcher.data.success) {
        onClose();
        setFormData(defaultTask);
        console.log("Success:", fetcher.data.message);
      } else {
        console.error("Error:", fetcher.data.error);
        // TODO: Show error message to user
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  const isSaving = useMemo(() => {
    return fetcher.state !== "idle";
  }, [fetcher.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const submitData = {
      ...formData,
      intent: isEditing ? "update" : "create",
      ...(isEditing && { todoId: todo.$id }),
    };

    await fetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
    });
  };

  const handleDelete = async () => {
    if (todo?.$id) {
      await fetcher.submit(
        { todoId: todo.$id, intent: "delete" },
        {
          method: "post",
          encType: "application/json",
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit todo" : "Create todo"}
          </DialogTitle>
        </DialogHeader>

        <fetcher.Form
          method="post"
          onSubmit={handleSubmit}
          className="space-y-5 mt-2"
        >
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-slate-700"
            >
              Title
            </Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border-slate-200 focus:border-slate-300 focus:ring-slate-300"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border-slate-200 focus:border-slate-300 focus:ring-slate-300 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <Flag className="w-3.5 h-3.5 text-slate-400" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <Flag className="w-3.5 h-3.5 text-amber-500" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <Flag className="w-3.5 h-3.5 text-red-500" />
                      High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-slate-200",
                    !formData.dueDate && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate
                    ? format(new Date(formData.dueDate), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  className="w-3xs"
                  selected={
                    formData.dueDate ? new Date(formData.dueDate) : undefined
                  }
                  onSelect={(date) =>
                    setFormData({
                      ...formData,
                      dueDate: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !formData.title.trim()}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create todo"
              )}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
