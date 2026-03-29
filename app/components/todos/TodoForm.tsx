import { useState, useEffect, useMemo } from "react";
import { useFetcher } from "react-router";
import { format } from "date-fns";

import { Calendar as CalendarIcon, Flag, Loader2 } from "lucide-react";

import { cn } from "~/lib/utils";

import type {
  TodoNode,
  TodoFormPayload,
  TaskFormData,
  TaskFormIntent,
  Priority,
} from "~/types/todo";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
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

type Props = {
  onClose?: () => void;
  todo?: TodoNode | null;
  parentTodoId?: string | null;
};

const defaultTask = {
  intent: "create" as TaskFormIntent,
  title: "",
  description: "",
  completed: false,
  priority: "low" as Priority,
  dueDate: null,
  parentId: null,
  subtasks: [],
};

function TodoForm({ onClose, todo, parentTodoId }: Props) {
  const [formData, setFormData] = useState<TaskFormData>(defaultTask);
  const fetcher = useFetcher({ key: "todo-form" });
  const isEditing = useMemo(() => !!todo?.$id, [todo]);
  const isSaving = useMemo(() => fetcher.state !== "idle", [fetcher.state]);

  useEffect(() => {
    if (todo) {
      setFormData({
        intent: "update",
        ...todo,
      });
    } else {
      setFormData({
        ...defaultTask,
        parentId: parentTodoId || null,
      });
    }
  }, [todo]);

  useEffect(() => {
    if (fetcher.state === "loading" && fetcher.data) {
      if (fetcher.data.success) {
        if (onClose !== undefined) onClose();
        setFormData(defaultTask);
      } else {
        console.error("Error:", fetcher.data.error);
        // TODO: Show error message to user
      }
    }
  }, [fetcher.state, fetcher.data, onClose]);

  const hasChanges = useMemo(() => {
    if (!todo) {
      return formData.title.trim() !== "";
    }

    return (
      formData.title.trim() !== todo.title.trim() ||
      formData.description?.trim() !== todo.description?.trim() ||
      formData.dueDate !== todo.dueDate ||
      formData.priority !== todo.priority
    );
  }, [formData, todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.title.trim()) return;

    const submitData: TodoFormPayload = isEditing
      ? {
          ...formData,
          intent: "update",
          todoId: todo.$id,
        }
      : {
          ...formData,
          intent: "create",
        };

    await fetcher.submit(submitData, {
      method: "post",
      encType: "application/json",
    });
  };

  return (
    <fetcher.Form
      method="post"
      onSubmit={handleSubmit}
      className="space-y-5 mt-2"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <Input
            className="ring-0 focus:outline-none active:outline-none text-lg font-medium shadow-none border-none outline-none"
            id="title"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            autoFocus
          />
          <Textarea
            id="description"
            placeholder="Add more details..."
            value={(formData.description as string) || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="focus:border-none focus:ring-slate-none focus:outline-none text-sm font-medium shadow-none border-none outline-none min-h-15 resize-none "
          />
        </div>

        <div className="flex item-center justify-between">
          <div className="flex gap-4">
            <div className="space-y-2">
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
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Select
                value={formData.priority}
                onValueChange={(value) => {
                  if (value) {
                    setFormData({ ...formData, priority: value as Priority });
                  }
                }}
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

          <div className="group flex items-center gap-4">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving || !hasChanges}
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
        </div>
      </div>
    </fetcher.Form>
  );
}

export default TodoForm;
