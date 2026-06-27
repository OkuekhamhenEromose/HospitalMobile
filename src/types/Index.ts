// src/types/index.ts
// Types aligned with the Django backend models/serializers

// ── Auth / User ───────────────────────────────────────────────────────────────

export type Role = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'LAB' | 'ADMIN';
export type Gender = 'M' | 'F' | 'O';

export interface Profile {
  id?: number;
  fullname: string;
  phone?: string | null;
  gender?: Gender | null;
  profile_pix?: string | null;
  role: Role;
}

/** Matches the Django User model + OneToOne Profile */
export interface User {
  id: number;        // backend returns int, not string
  username: string;
  email: string;
  profile?: Profile;
}

export interface LoginData {
  username: string;
  password: string;
}

/** Matches the backend /users/register/ payload */
export interface RegisterData {
  username: string;
  email: string;
  password1: string;  // backend uses password1/password2, not password
  password2: string;
  fullname: string;
  phone?: string;
  gender?: Gender | '';
  role: Role;
}

/** Matches the backend login + token-refresh response */
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface TokenResponse {
  access: string;
  refresh?: string;
}

export interface DashboardResponse {
  user: User;
  [key: string]: unknown;
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export interface SubHeading {
  id: number;
  title: string;
  level: number;
  description: string;
  full_content?: string;
  anchor?: string;
}

export interface TableOfContentsItem {
  id: number;
  title: string;
  anchor: string;
  level: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content?: string;
  featured_image?: string | null;
  image_1?: string | null;
  image_2?: string | null;
  author_name?: string;
  author_role?: string;
  created_at: string;
  published_date?: string;
  published: boolean;
  subheadings?: SubHeading[];
  table_of_contents?: TableOfContentsItem[];
  enable_toc?: boolean;
}

// ── Hospital ──────────────────────────────────────────────────────────────────

export type AppointmentStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
export type RequestStatus     = 'PENDING' | 'IN_PROGRESS' | 'DONE';
export type AssignmentRole    = 'DOCTOR' | 'NURSE' | 'LAB';

export interface Appointment {
  id: number;
  patient?: Profile;
  name: string;
  age: number;
  sex: string;
  message?: string;
  address?: string;
  booked_at: string;
  status: AppointmentStatus;
  assignments?: Assignment[];
  test_requests?: TestRequest[];
  vital_requests?: VitalRequest[];
}

export interface Assignment {
  id: number;
  appointment: number;
  staff?: Profile;
  role: AssignmentRole;
  notes?: string;
  assigned_at: string;
}

export interface TestRequest {
  id: number;
  appointment: number;
  tests: string;
  note?: string;
  status: RequestStatus;
  created_at: string;
  assigned_to?: Profile | null;
}

export interface VitalRequest {
  id: number;
  appointment: number;
  note?: string;
  status: RequestStatus;
  created_at: string;
  assigned_to?: Profile | null;
}

// ── Generic API error shape ───────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}
