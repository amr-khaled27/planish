import { useState, useCallback, useRef, useEffect } from 'react';
import Task from '@/types/task';

interface HoverState {
  visible: boolean;
  event: any | null;
  task: Task | null;
  position: { x: number; y: number };
}

export function useEventTooltip(tasks: Task[]) {
  const [hoverState, setHoverState] = useState<HoverState>({
    visible: false,
    event: null,
    task: null,
    position: { x: 0, y: 0 }
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const findTaskById = useCallback((taskId: string) => {
    return tasks.find(task => task.id === taskId) || null;
  }, [tasks]);

  const showTooltip = useCallback((event: any, mouseEvent: MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    const task = findTaskById(event.id);
    if (!task) return;

    hoverTimeoutRef.current = setTimeout(() => {
      setHoverState({
        visible: true,
        event,
        task,
        position: { x: mouseEvent.clientX, y: mouseEvent.clientY }
      });
    }, 50);
  }, [findTaskById]);

  const hideTooltip = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setHoverState(prev => ({ ...prev, visible: false }));
    }, 25);
  }, []);

  const updateTooltipPosition = useCallback((mouseEvent: MouseEvent) => {
    if (hoverState.visible) {
      setHoverState(prev => ({
        ...prev,
        position: { x: mouseEvent.clientX, y: mouseEvent.clientY }
      }));
    }
  }, [hoverState.visible]);

  const initializeTooltips = useCallback(() => {
    const attachEventListeners = () => {
      setTimeout(() => {
        const eventElements = document.querySelectorAll('[data-event-id]');
        
        eventElements.forEach((element) => {
          const eventId = element.getAttribute('data-event-id');
          if (!eventId) return;

          const task = findTaskById(eventId);
          if (!task) return;

          const calendarEvent = {
            id: eventId,
            title: task.title,
            start: task.dueDate && task.dueTime 
              ? `${task.dueDate} ${task.dueTime}` 
              : task.dueDate || '',
            end: task.dueDate && task.dueTime 
              ? `${task.dueDate} ${task.dueTime}` 
              : task.dueDate || ''
          };

          const handleMouseEnter = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            showTooltip(calendarEvent, mouseEvent);
          };

          const handleMouseLeave = () => {
            hideTooltip();
          };

          const handleMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            updateTooltipPosition(mouseEvent);
          };

          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
          element.removeEventListener('mousemove', handleMouseMove);

          // Add new listeners
          element.addEventListener('mouseenter', handleMouseEnter);
          element.addEventListener('mouseleave', handleMouseLeave);
          element.addEventListener('mousemove', handleMouseMove);
        });
      }, 100);
    };

    // Initial attachment
    attachEventListeners();

    const observer = new MutationObserver((mutations) => {
      let shouldReattach = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.querySelector('[data-event-id]') || 
                element.hasAttribute('data-event-id')) {
              shouldReattach = true;
            }
          }
        });
      });

      if (shouldReattach) {
        attachEventListeners();
      }
    });

    const calendarWrapper = document.querySelector('.sx-react-calendar-wrapper');
    if (calendarWrapper) {
      observer.observe(calendarWrapper, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      observer.disconnect();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showTooltip, hideTooltip, updateTooltipPosition, findTaskById]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoverState,
    initializeTooltips
  };
}
