export const COLORS = {
  primary: '#6200ee',
  primaryDark: '#3700b3',
  accent: '#03dac4',
  backgroundLight: '#f6f6f6',
  backgroundDark: '#121212',
  surfaceLight: '#ffffff',
  surfaceDark: '#1e1e1e',
  textLight: '#000000',
  textDark: '#ffffff',
  textSecondaryLight: '#757575',
  textSecondaryDark: '#b0b0b0',
  error: '#b00020',
  success: '#4caf50',
  warning: '#ff9800',
  priorityHigh: '#f44336',
  priorityMedium: '#ff9800',
  priorityLow: '#4caf50',
};

export const CATEGORIES: { label: string; value: string; icon: string }[] = [
  { label: 'Work', value: 'Work', icon: 'briefcase' },
  { label: 'Personal', value: 'Personal', icon: 'account' },
  { label: 'Study', value: 'Study', icon: 'book-open-page-variant' },
  { label: 'Shopping', value: 'Shopping', icon: 'cart' },
  { label: 'Health', value: 'Health', icon: 'heart-pulse' },
  { label: 'Others', value: 'Others', icon: 'dots-horizontal' },
];

export const PRIORITIES: { label: string; value: string; color: string }[] = [
  { label: 'High', value: 'High', color: COLORS.priorityHigh },
  { label: 'Medium', value: 'Medium', color: COLORS.priorityMedium },
  { label: 'Low', value: 'Low', color: COLORS.priorityLow },
];
