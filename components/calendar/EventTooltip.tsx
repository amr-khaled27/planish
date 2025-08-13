import React, { useEffect, useRef } from 'react';
import Task from '@/types/task';

interface TooltipProps {
  event: any;
  task: Task;
  position: { x: number; y: number };
  visible: boolean;
}

export function EventTooltip({ event, task, position, visible }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (position.x + rect.width > viewportWidth) {
        adjustedX = position.x - rect.width - 10;
      }

      if (position.y + rect.height > viewportHeight) {
        adjustedY = position.y - rect.height - 10;
      }

      tooltip.style.left = `${adjustedX}px`;
      tooltip.style.top = `${adjustedY}px`;
    }
  }, [position, visible]);

  if (!visible) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 border-red-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'not-started': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      if (dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ');
        return new Date(`${datePart}T${timePart}`).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      return 'All day';
    } catch {
      return 'All day';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.split(' ')[0]);
      return date.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none animate-in fade-in duration-150"
      style={{
        left: position.x + 10,
        top: position.y + 10,
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 max-w-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className={`min-w-[0.75rem] min-h-[0.75rem] rounded-sm mt-1 border ${getPriorityColor(task.priority)}`} 
                 style={{ backgroundColor: `var(--sx-color-${task.priority}-container)` }} />
            <div>
              <h3 className="font-semibold text-white text-sm leading-tight">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400">Type:</span>
              <div className="text-white font-medium capitalize">
                {task.type}
              </div>
            </div>

            <div>
              <span className="text-gray-400">Priority:</span>
              <div className={`font-medium capitalize ${getPriorityColor(task.priority).split(' ')[0]}`}>
                {task.priority}
              </div>
            </div>

            <div>
              <span className="text-gray-400">Status:</span>
              <div className={`font-medium capitalize ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </div>
            </div>

            <div>
              <span className="text-gray-400">Time:</span>
              <div className="text-white font-medium">
                {task.dueTime ? formatTime(`${task.dueDate} ${task.dueTime}`) : 'All day'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-gray-400">Date: </span>
                <span className="text-white">
                  {task.dueDate ? formatDate(task.dueDate) : 'No date'}
                </span>
              </div>
              
              {event.start !== event.end && (
                <div>
                  <span className="text-gray-400">Duration: </span>
                  <span className="text-white">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {task.type === 'habit' && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-400 text-xs font-medium">Daily Habit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
