import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainDrawerParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  BlogDetail: { slug: string };
};

export type MainDrawerParamList = {
  Home: undefined;
  About: undefined;
  Services: undefined;
  Packages: undefined;
  Blog: undefined;
  Contact: undefined;
  Dashboard: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}