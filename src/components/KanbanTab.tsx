import React from 'react';
import { SubTask } from '../types';
import { Kanban, ArrowRight, ArrowLeft, CheckCircle2, CircleDot } from 'lucide-react';

interface KanbanTabProps {
  tasks: SubTask[];
  onUpdateStatus: (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => void;
}

export default function KanbanTab({ tasks, onUpdateStatus }: KanbanTabProps) {
  const columns = [
    { id: 'todo' as const, title: 'To Do', bgColor: 'bg-gray-100/50', borderCol: 'border-gray-200' },
    { id: 'in_progress' as const, title: 'In Progress', bgColor: 'bg-amber-50/40', borderCol: 'border-amber-200' },
    { id: 'completed' as const, title: 'Completed', bgColor: 'bg-green-50/30', borderCol: 'border-green-200' }
  ];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-12rem)]">
      {/* Header Info */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Kanban className="w-5 h-5 text-[#0035c5]" />
        <h3 className="font-bold text-gray-800 font-headline">Task Board</h3>
        <span className="text-xs text-gray-500 ml-1">Update status to align team sprints</span>
      </div>

      {/* Grid of Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start flex-1">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div 
              key={col.id} 
              className={`rounded-xl border ${col.borderCol} ${col.bgColor} p-4 flex flex-col min-h-[280px] lg:min-h-[440px] shadow-sm`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-gray-200">
                <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">{col.title}</span>
                <span className="bg-gray-200/80 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-28 rounded-lg border-2 border-dashed border-gray-200/80 flex flex-col items-center justify-center text-center p-3 opacity-60">
                    <CircleDot className="w-5 h-5 text-gray-300 mb-1" />
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">No tasks here</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 relative group"
                    >
                      {/* Tag info */}
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                        task.category === 'backend' ? 'bg-indigo-50 text-indigo-700' :
                        task.category === 'frontend' ? 'bg-cyan-50 text-cyan-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {task.category}
                      </span>

                      {/* Task Title */}
                      <h4 className="text-xs font-bold text-gray-800 mt-2.5 mb-1.5 leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-2 mb-4 leading-normal">
                        {task.description}
                      </p>

                      {/* Action buttons to transition card columns */}
                      <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-gray-100">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => onUpdateStatus(task.id, col.id === 'completed' ? 'in_progress' : 'todo')}
                            className="p-1 text-gray-400 hover:text-[#0035c5] bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-all cursor-pointer"
                            title="Move Back"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        
                        {col.id !== 'completed' ? (
                          <button
                            onClick={() => onUpdateStatus(task.id, col.id === 'todo' ? 'in_progress' : 'completed')}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-[#0035c5] hover:bg-opacity-90 rounded shadow-sm transition-all cursor-pointer"
                          >
                            <span>Move {col.id === 'todo' ? 'Progress' : 'Complete'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3 text-green-600 fill-green-100" />
                            <span>Done</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
