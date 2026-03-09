export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'LAB' | 'PATIENT';
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content?: string;
  featured_image?: string;
  image_1?: string;
  image_2?: string;
  author?: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  subheadings?: SubHeading[];
  first_two_subheadings?: SubHeading[];
  table_of_contents?: TableOfContentsItem[];
}

export interface SubHeading {
  id: number;
  title: string;
  level: number;
  description: string;
  full_content?: string;
  anchor?: string;
}

export interface TableOfContentsItem {
  title: string;
  anchor: string;
  level: number;
}

export interface Appointment {
  id: number;
  patient_name: string;
  patient_email?: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_popular?: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  icon?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  detail?: string;
}