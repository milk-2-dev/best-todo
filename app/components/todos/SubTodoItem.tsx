import React, { useState } from 'react';
import { CheckCircle2, Circle, X, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export default function SubTodoItem({ subtask, onToggle, onRemove, onAddChild, onUpdate, depth = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newChildTitle, setNewChildTitle] = useState('');
  const [showAddChild, setShowAddChild] = useState(false);

  const hasChildren = subtask.subtasks?.length > 0;
  const completedChildren = subtask.subtasks?.filter(s => s.completed).length || 0;
  const totalChildren = subtask.subtasks?.length || 0;

  const handleAddChild = () => {
    if (!newChildTitle.trim()) return;
    onAddChild(subtask.id, newChildTitle.trim());
    setNewChildTitle('');
    setShowAddChild(false);
    setIsExpanded(true);
  };

  return (
    <div className={cn("", depth > 0 && "ml-6 border-l border-slate-200 pl-3")}>
      <div className="flex items-center gap-2 group py-1">
        {/* Expand/Collapse */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-4 h-4 flex items-center justify-center flex-shrink-0",
            !hasChildren && "invisible"
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(subtask.id)}
          className="flex-shrink-0"
        >
          {subtask.completed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
          )}
        </button>

        {/* Title */}
        <span className={cn(
          "flex-1 text-sm",
          subtask.completed && "line-through text-slate-400"
        )}>
          {subtask.title}
        </span>

        {/* Child count */}
        {hasChildren && (
          <span className="text-xs text-slate-400">
            {completedChildren}/{totalChildren}
          </span>
        )}

        {/* Actions */}
        <button
          type="button"
          onClick={() => setShowAddChild(!showAddChild)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
          title="Add nested subtask"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(subtask.id)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
        >
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Add child input */}
      {showAddChild && (
        <div className="flex items-center gap-2 ml-8 mt-1 mb-2">
          <Input
            placeholder="Add nested subtask..."
            value={newChildTitle}
            onChange={(e) => setNewChildTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChild())}
            className="border-slate-200 text-sm h-8"
            autoFocus
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddChild}
            disabled={!newChildTitle.trim()}
            className="h-8 px-2"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAddChild(false)}
            className="h-8 px-2"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Nested subtasks */}
      {isExpanded && hasChildren && (
        <div className="mt-1">
          {subtask.subtasks.map((child) => (
            <SubtaskItem
              key={child.id}
              subtask={child}
              onToggle={onToggle}
              onRemove={onRemove}
              onAddChild={onAddChild}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}