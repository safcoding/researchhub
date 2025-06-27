import type { Grant } from "@/hooks/logic/grant-logic";

export const GRANT_TYPES: Grant['GRANT_TYPE'][] =[
    'University Grant',
    'Government Grant',
    'Industrial Grant',
    'Research Contract',
    'Others'
] as const;

export const GRANT_STATUSES: Grant['PROJECT_STATUS'][] =[
    'Active',
    'Completed',
    'Pending',
    'Suspended',
] as const;

export const SPONSOR_CATEGORIES: Grant['SPONSOR_CATEGORY'][] =[
    'Government',
    'Univeristy',
    'Industry',
    'International',
] as const;

export const REQUIRED_GRANT_FIELDS = [
    'PROJECTID',
    'PROJECT_TITLE',
    'PL_NAME',
    'PRO_DATESTART',
    'PRO_DATEEND',
    'GRANT_TYPE',
    'PROJECT_STATUS',
    'PRO_APPROVED'
] as const;