export interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
}

export interface ColumnData {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
}
