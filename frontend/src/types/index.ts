export type UserRole = 'L&D Manager' | 'Program Manager' | 'Batch Owner';

export interface User {
  id: number;
  email: string;
  full_name: string;
  ust_employee_id: string;
  role: UserRole;
  is_password_changed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Candidate {
  id: number;
  full_name: string;
  personal_email: string;
  college_email: string;
  college_name: string;
  degree: string;
  department: string;
  university_name: string;
  contact_number: string;
  tenth_percentage: number;
  twelfth_percentage: number;
  degree_percentage: number;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CandidateResponse {
  items: Candidate[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  year?: number;
}

export interface Batch {
  id: number;
  name: string;
  program: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_candidates: number;
  active_candidates: number;
  total_batches: number;
  completion_rate: number;
}
