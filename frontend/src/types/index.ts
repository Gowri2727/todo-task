export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export type PriorityType = 'High' | 'Medium' | 'Low';

export type CategoryType = 'Work' | 'Personal' | 'Study' | 'Shopping' | 'Health' | 'Others';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: PriorityType;
  category: CategoryType;
  deadline: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: string;
  searchQuery: string;
  sortBy: 'dynamic';
}
