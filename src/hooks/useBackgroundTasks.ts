import { useState, useEffect, useCallback } from 'react';

interface BackgroundTask {
  id: string;
  task: () => Promise<void>;
  priority: number;
}

// ⚡ BACKGROUND TASKS API - Custom hook for idle-time processing
export const useBackgroundTasks = () => {
  const [isIdle, setIsIdle] = useState(true);
  const [taskQueue, setTaskQueue] = useState<BackgroundTask[]>([]);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  const addTask = useCallback((id: string, task: () => Promise<void>, priority: number = 1) => {
    const newTask: BackgroundTask = { id, task, priority };
    setTaskQueue(prev => [...prev, newTask].sort((a, b) => b.priority - a.priority));
    console.log(`⚡ Background Tasks API: Added task "${id}" with priority ${priority}`);
  }, []);

  const processNextTask = useCallback(async () => {
    if (taskQueue.length === 0) {
      setIsIdle(true);
      return;
    }

    const task = taskQueue[0];
    setCurrentTask(task.id);
    setIsIdle(false);
    
    console.log(`⚡ Background Tasks API: Processing task "${task.id}"`);

    try {
      await task.task();
      console.log(`⚡ Background Tasks API: Completed task "${task.id}"`);
    } catch (error) {
      console.error(`⚡ Background Tasks API: Task "${task.id}" failed:`, error);
    } finally {
      setTaskQueue(prev => prev.slice(1));
      setCurrentTask(null);
    }
  }, [taskQueue]);

  useEffect(() => {
    // ⚡ BACKGROUND TASKS API - Use requestIdleCallback for background processing
    let handle: number;

    const scheduleTask = () => {
      if (taskQueue.length > 0 && !currentTask) {
        if ('requestIdleCallback' in window) {
          // ⚡ BACKGROUND TASKS API - Schedule task during idle periods
          handle = requestIdleCallback(
            (deadline) => {
              console.log(`⚡ Background Tasks API: Idle time available (${deadline.timeRemaining()}ms)`);
              processNextTask();
            },
            { timeout: 5000 }
          );
        } else {
          // Fallback for browsers without requestIdleCallback
          console.log('⚡ Background Tasks API: Using setTimeout fallback');
          setTimeout(processNextTask, 100);
        }
      }
    };

    scheduleTask();

    return () => {
      // ⚡ BACKGROUND TASKS API - Cancel scheduled idle callback
      if (handle && 'cancelIdleCallback' in window) {
        cancelIdleCallback(handle);
      }
    };
  }, [taskQueue, currentTask, processNextTask]);

  return {
    isIdle,
    taskQueue: taskQueue.length,
    currentTask,
    addTask
  };
};