export type MobileNavIcon = 'home' | 'tickets' | 'notification' | 'profile';

export interface MobileBottomNavItem {
  label: string;
  icon: MobileNavIcon;
  active: boolean;
}

export interface DesktopPriorityLabel {
  high: 'High';
  medium: 'Medium';
  low: 'Low';
}

export interface MobileStatusLabel {
  new: 'New';
  'in-progress': 'In Progress';
  closed: 'Closed';
}
