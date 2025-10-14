export interface Activity {
    id: string;
    description: string;
    deliveryDate?: string;
    completed?: boolean;
}

export interface Group {
    id: string;
    title: string;
    activities: Activity[];
}