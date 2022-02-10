export enum AppThemeColor {
  BLUE = 0,
  ORANGE = 1,
}

export enum AppStatus {
  REMOVED = 0,
  OFFLINE = 1,
  ONLINE = 2,
}

export interface App {
  id?: number;
  title: string;
  description: string;
  icon: string;
  themeColor: AppThemeColor;
  status?: AppStatus;
}
