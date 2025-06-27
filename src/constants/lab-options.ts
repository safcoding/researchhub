import type { Lab } from "@/hooks/logic/lab-logic";

export const LAB_TYPES: Lab['LAB_TYPE'][] =[
    'Conference',
    'Workshop',
    'Seminar',
    'Grant',
    'Competition',
    'Networking',
    'Others'
] as const;

export const LAB_STATUS: Lab['LAB_STATUS'][] =[
    'High',
    'Medium',
    'Low',
] as const;

export const REQUIRED_LAB_FIELDS = [
    'LAB_NAME',
    'LAB_HEAD',
    'LAB_TYPE',
    'LAB_STATUS',
    'LOCATION'
] as const;
