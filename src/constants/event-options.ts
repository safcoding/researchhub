import type { Event } from "@/hooks/logic/event-logic";

export const EVENT_CATEGORIES: Event['category'][] =[
    'Conference',
    'Workshop',
    'Seminar',
    'Grant',
    'Competition',
    'Networking',
    'Others'
] as const;

export const EVENT_PRIORITIES: Event['priority'][] =[
    'High',
    'Medium',
    'Low',
] as const;

export const EVENT_STATUSES: Event['status'][] =[
    'Upcoming',
    'Registration Open',
    'Registration Closed',
    'Completed',
] as const;

export const REQUIRED_EVENT_FIELDS = [
    'id',
    'title',
    'description', 
    'date',
    'category',
] as const;