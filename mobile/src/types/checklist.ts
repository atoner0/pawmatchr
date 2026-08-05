export interface ChecklistItem {
    id: string;
    label: string;
}

export interface ChecklistSection {
    title: string;
    info?: string;
    items: ChecklistItem[];
}