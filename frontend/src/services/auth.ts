import { apiService } from './api';
import { User, AuthResponse, LoginRequest, RegisterRequest } from './types';

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    // Create form data for OAuth2 login
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
      const authResponse = await apiService.request<AuthResponse>(
        'POST',
        '/auth/login',
        formData
      );

      // Store token
      apiService.setAuthToken(authResponse.access_token);

      // Get user info
      const user = await this.getCurrentUser();

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token: authResponse.access_token };
    } catch (error) {
      // Clean up on login failure
      apiService.clearAuthToken();
      throw error;
    }
  }

  // Register user
  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      // Register user
      const user = await apiService.post<User>('/users/', userData);

      // Auto-login after registration
      const loginResult = await this.login({
        username: userData.username,
        password: userData.password,
      });

      return loginResult;
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  // Logout user
  logout(): void {
    apiService.clearAuthToken();
    // Redirect to login page
    window.location.href = '/login';
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = apiService.getAuthToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Get stored user from localStorage
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const updatedUser = await apiService.put<User>(`/users/${userId}`, updates);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  // Validate token on app start
  async validateToken(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const user = await this.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      // Token is invalid
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
