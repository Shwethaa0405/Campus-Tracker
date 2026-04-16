import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { User, AuthToken, CandidateResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8090';

interface CandidateQueryOptions {
  year?: number;
  page?: number;
  perPage?: number;
}

export function getCurrentHiringYear() {
  return new Date().getFullYear();
}

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthToken> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.client.post<AuthToken>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string; user?: User; access_token?: string }> {
    const response = await this.client.post('/auth/change-password', {
      email,
      old_password: currentPassword,
      new_password: newPassword,
      confirm_password: newPassword,
    });
    return response.data;
  }

  // Candidate endpoints
  async getCandidates(
    options: CandidateQueryOptions = {}
  ): Promise<CandidateResponse> {
    const year = options.year ?? getCurrentHiringYear();
    const page = options.page ?? 1;
    const perPage = options.perPage ?? 50;

    const response = await this.client.get('/candidates', {
      params: { year, page, per_page: perPage },
    });
    const data = response.data;

    return {
      items: data.items ?? data.candidates ?? [],
      total: data.total ?? 0,
      page: data.page ?? page,
      per_page: data.per_page ?? perPage,
      pages:
        data.pages ??
        Math.max(1, Math.ceil((data.total ?? 0) / (data.per_page ?? perPage))),
      year: data.year ?? year,
    };
  }

  async downloadCandidateTemplate(): Promise<Blob> {
    const response = await this.client.get('/candidates/template/download', {
      responseType: 'blob',
    });
    return response.data;
  }

  async uploadCandidates(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/candidates/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getCandidateById(id: number): Promise<any> {
    const response = await this.client.get(`/candidates/${id}`);
    return response.data;
  }

  async updateCandidate(id: number, data: any): Promise<any> {
    const response = await this.client.put(`/candidates/${id}`, data);
    return response.data;
  }

  async deleteCandidate(id: number): Promise<any> {
    const response = await this.client.delete(`/candidates/${id}`);
    return response.data;
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    const response = await this.client.get('/auth/users');
    return response.data;
  }

  async createUser(
    full_name: string,
    email: string,
    ust_employee_id: string,
    role: string,
    default_password?: string
  ): Promise<any> {
    const response = await this.client.post('/auth/users', {
      full_name,
      email,
      ust_employee_id,
      role,
      default_password: default_password || null,
    });
    return response.data;
  }

  async deleteUser(userId: string): Promise<any> {
    const response = await this.client.delete(`/auth/users/${userId}`);
    return response.data;
  }

  async sendUserCredentials(userId: string, temporaryPassword: string): Promise<any> {
    const response = await this.client.post(`/auth/users/${userId}/send-credentials`, {
      temporary_password: temporaryPassword,
    });
    return response.data;
  }
}

export const apiClient = new APIClient();
