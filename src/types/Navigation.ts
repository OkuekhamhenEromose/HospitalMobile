import type { NavigatorScreenParams } from '@react-navigation/native';

// ── Root stack: Welcome → Auth (modal) → Main (tabs) ─────────────────────────
export type RootStackParamList = {
  Welcome:    undefined;
  Main:       NavigatorScreenParams<MainTabParamList>;
  Auth:       NavigatorScreenParams<AuthStackParamList>;
  BlogDetail: { slug: string };
};

// ── Bottom tab screens ────────────────────────────────────────────────────────
export type MainTabParamList = {
  Home:      undefined;
  About:     undefined;
  Services:  undefined;
  Packages:  undefined;
  Blog:      undefined;
  Contact:   undefined;
  Dashboard: undefined;
};

// ── Auth stack ────────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login:    undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}