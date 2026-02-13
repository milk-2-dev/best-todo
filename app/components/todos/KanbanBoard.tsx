import React from 'react';
import TodoCard from './TodoCard';
import { Inbox, Sun, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Skeleton } from '~/components/ui/skeleton';

const columns = [
  { id: 'backlog', label: 'Backlog', icon: Inbox, color: 'bg-slate-500' },
  { id: 'today', label: 'Today', icon: Sun, color: 'bg-amber-500' },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: 'bg-blue-500' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'bg-emerald-500' },
];

export default function KanbanBoard({ tasks, isLoading, onToggleComplete, onEdit, onDelete, onStatusChange }) {
  const getTasksByStatus = (status) => {
    return tasks?.filter(task => task.status === status) || [];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4 h-full">
        {columns.map((col) => (
          <div key={col.id} className="bg-slate-50/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full overflow-x-auto">
      {columns.map((column) => {
        const Icon = column.icon;
        const columnTasks = getTasksByStatus(column.id);

        return (
          <div key={column.id} className="bg-slate-50/50 rounded-xl p-4 min-h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn("w-2 h-2 rounded-full", column.color)} />
              <span className="text-sm font-medium text-slate-700">{column.label}</span>
              <span className="text-xs text-slate-400 ml-auto">{columnTasks.length}</span>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <TodoCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  variant="kanban"
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="py-8 text-center">
                  <Icon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}