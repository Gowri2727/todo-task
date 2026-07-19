import { useMemo } from 'react';
import { Task, PriorityType } from '../types';
import useAppSelector from './useAppSelector';

const PRIORITY_ORDER: Record<PriorityType, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const useTasks = () => {
  const { tasks, filter, searchQuery } = useAppSelector((state) => state.tasks);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filter
    switch (filter) {
      case 'Completed':
        result = result.filter((t) => t.completed);
        break;
      case 'Pending':
        result = result.filter((t) => !t.completed);
        break;
      case 'High Priority':
        result = result.filter((t) => t.priority === 'High');
        break;
      case 'Medium Priority':
        result = result.filter((t) => t.priority === 'Medium');
        break;
      case 'Low Priority':
        result = result.filter((t) => t.priority === 'Low');
        break;
      case 'Work':
      case 'Personal':
      case 'Study':
      case 'Shopping':
      case 'Health':
      case 'Others':
        result = result.filter((t) => t.category === filter);
        break;
      case "Today's Tasks":
        result = result.filter((t) => {
          const deadline = new Date(t.deadline);
          return deadline >= todayStart && deadline <= todayEnd;
        });
        break;
      case 'Upcoming':
        result = result.filter((t) => new Date(t.deadline) > todayEnd);
        break;
      case 'Overdue':
        result = result.filter((t) => new Date(t.deadline) < todayStart && !t.completed);
        break;
      default:
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query)) ||
          t.category.toLowerCase().includes(query)
      );
    }

    // Apply intelligent sorting: Priority (High > Med > Low), then earlier deadline, then newest created
    result.sort((a, b) => {
      const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      const deadlineDiff = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (deadlineDiff !== 0) return deadlineDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [tasks, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.filter((t) => !t.completed).length;
    const overdue = tasks.filter((t) => new Date(t.deadline) < todayStart && !t.completed).length;
    const todayTasks = tasks.filter((t) => {
      const d = new Date(t.deadline);
      return d >= todayStart && d <= todayEnd;
    }).length;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, overdue, todayTasks, completionPercentage };
  }, [tasks]);

  return { filteredTasks, stats };
};

export default useTasks;
