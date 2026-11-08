import type { CalendarEvent, TodoTask } from '../types/dashboard';

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  // Can subscribe to HA calendar.* or return curated schedule
  const now = new Date();
  const formatTime = (hours: number, minutes: number = 0) => {
    const d = new Date(now);
    d.setHours(hours, minutes, 0, 0);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return [
    {
      id: 'cal-1',
      title: 'Sprint Planning & Architecture Sync',
      startTime: formatTime(10, 0),
      endTime: formatTime(11, 0),
      isAllDay: false,
      location: 'Google Meet',
      category: 'work',
    },
    {
      id: 'cal-2',
      title: 'Gym & Cardio Session',
      startTime: formatTime(13, 0),
      endTime: formatTime(14, 0),
      isAllDay: false,
      location: 'Fitness Club',
      category: 'fitness',
    },
    {
      id: 'cal-3',
      title: 'Design Review: Smart Display UI',
      startTime: formatTime(15, 30),
      endTime: formatTime(16, 30),
      isAllDay: false,
      location: 'Conference Room 3B',
      category: 'work',
    },
    {
      id: 'cal-4',
      title: 'Grocery & Home Essentials',
      startTime: formatTime(19, 0),
      endTime: formatTime(19, 45),
      isAllDay: false,
      category: 'personal',
    },
    {
      id: 'cal-5',
      title: 'F1 Las Vegas GP Practice 1',
      startTime: 'Fri 08:00',
      endTime: '09:00',
      isAllDay: false,
      category: 'reminder',
    },
  ];
};

export const getTodoTasks = async (): Promise<TodoTask[]> => {
  return [
    {
      id: 'task-1',
      title: 'Review pull request for telemetry collector',
      completed: false,
      dueTime: '12:00',
      priority: 'high',
    },
    {
      id: 'task-2',
      title: 'Calibrate portable monitor color profile',
      completed: true,
      dueTime: '09:30',
      priority: 'medium',
    },
    {
      id: 'task-3',
      title: 'Update Home Assistant Zigbee bridge firmware',
      completed: false,
      dueTime: '18:00',
      priority: 'medium',
    },
    {
      id: 'task-4',
      title: 'Water balcony herbs & plants',
      completed: false,
      priority: 'low',
    },
  ];
};
