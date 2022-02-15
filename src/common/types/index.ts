export enum AppThemeColor {
  BLUE = 0,
  ORANGE = 1,
}

export enum AppStatus {
  REMOVED = 0, // 已删除
  OFFLINE = 1, // 未发布
  ONLINE = 2, // 已发布
}

export interface App {
  id?: number;
  title: string;
  description: string;
  icon: string;
  themeColor: AppThemeColor;
  status?: AppStatus;
}

export enum UserStatus {
  REMOVED = 0, // 已删除
  NOT_ACTIVE = 1, // 未激活
  ACTIVE = 2, // 已激活
}

export enum UserGender {
  UNKNOWN = 0, // 保密
  MALE = 1, // 男
  FEMALE = 2, // 女
}

export interface User {
  id?: number;
  username: string;
  password?: string;
  gender: UserGender;
  avatar: string;
  email: string;
  status?: UserStatus;
  token?: string;
}
