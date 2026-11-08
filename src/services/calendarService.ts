import type { CalendarEvent, TodoTask } from '../types/dashboard';
import { haService } from './homeAssistant';

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  // If connected to Home Assistant, search for calendar.* entities first
  if (haService.getStatus() === 'connected') {
    const entities = haService.getEntities();
    const calendarKeys = Object.keys(entities).filter(k => k.startsWith('calendar.'));

    const haEvents: CalendarEvent[] = [];
    calendarKeys.forEach((key, idx) => {
      const entity = entities[key];
      if (entity?.attributes?.message) {
        const attr = entity.attributes;
        const start = attr.start_time ? new Date(attr.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Today';
        const end = attr.end_time ? new Date(attr.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
        haEvents.push({
          id: `ha-cal-${idx}`,
          title: attr.message,
          startTime: start,
          endTime: end,
          isAllDay: !!attr.all_day,
          location: attr.location || attr.friendly_name,
          category: 'work',
        });
      }
    });

    if (haEvents.length > 0) {
      return haEvents;
    }
  }

  // Baseline schedule for offline/demo mode
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
  // If connected to Home Assistant, search for todo.* entities
  if (haService.getStatus() === 'connected') {
    const entities = haService.getEntities();
    const todoKeys = Object.keys(entities).filter(k => k.startsWith('todo.'));
    if (todoKeys.length > 0) {
      const haTasks: TodoTask[] = todoKeys.map((key, idx) => {
        const entity = entities[key];
        return {
          id: `ha-todo-${idx}`,
          title: entity.attributes.friendly_name || key.replace('todo.', ''),
          completed: entity.state === '0', // count of remaining tasks
          priority: 'medium',
        };
      });
      return haTasks;
    }
  }

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
