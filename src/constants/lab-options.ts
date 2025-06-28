import type { Lab } from "@/hooks/logic/lab-logic";

export const LAB_TYPES: Lab['LAB_TYPE'][] =[
    'i-Kohza',
    'Research Lab',
    'Satellite Lab',
    'Teaching Lab',
    'Service Lab',
] as const;

export const LAB_STATUS: Lab['LAB_STATUS'][] =[
    'Active',
    'Under Maintanence',
    'Unavailable',
] as const;

export const REQUIRED_LAB_FIELDS = [
    'LAB_NAME',
    'LAB_HEAD',
    'LAB_TYPE',
    'LAB_STATUS',
    'LOCATION'
] as const;
