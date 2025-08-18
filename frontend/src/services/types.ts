// User types
export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Authentication types
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Error response
export interface ApiError {
  detail: string;
  status_code?: number;
}

// Block types (for future use)
export interface Block {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  endpoint_url: string;
  pricing_model: 'per_call' | 'subscription' | 'tiered';
  price_per_call: number;
  subscription_price: number;
  is_public: boolean;
  is_active: boolean;
  block_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BlockCreate {
  name: string;
  description?: string;
  endpoint_url: string;
  pricing_model: 'per_call' | 'subscription' | 'tiered';
  price_per_call?: number;
  subscription_price?: number;
  is_public?: boolean;
  block_metadata?: Record<string, any>;
}

// Invocation types
export interface InvokeRequest {
  headers?: Record<string, string>;
  query_params?: Record<string, string>;
  body?: any;
}

export interface InvokeResponse {
  status_code: number;
  headers: Record<string, string>;
  body: any;
  execution_time_ms: number;
  invocation_id: string;
}

export interface Invocation {
  id: string;
  block_id: string;
  status_code?: number;
  execution_time_ms?: number;
  cost: number;
  created_at: string;
}
