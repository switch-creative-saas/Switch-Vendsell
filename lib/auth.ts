export interface AuthUser {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export class AuthService {
  // Get current user session
  static async getCurrentUser(): Promise<AuthUser | null> {
    throw new Error('Not implemented');
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, userData: {
    first_name: string
    last_name: string
    phone?: string
  }) {
    throw new Error('Not implemented');
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    throw new Error('Not implemented');
  }

  // Sign out
  static async signOut() {
    throw new Error('Not implemented');
  }

  // Reset password
  static async resetPassword(email: string) {
    throw new Error('Not implemented');
  }

  // Update password
  static async updatePassword(newPassword: string) {
    throw new Error('Not implemented');
  }

  // Update user profile
  static async updateProfile(updates: {
    first_name?: string
    last_name?: string
    phone?: string
    avatar_url?: string
  }) {
    throw new Error('Not implemented');
  }

  // Get user profile from users table
  static async getUserProfile(userId: string): Promise<AuthUser | null> {
    throw new Error('Not implemented');
  }

  // Create or update user profile in users table
  static async upsertUserProfile(userData: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
    avatar_url?: string
  }) {
    throw new Error('Not implemented');
  }

  // Check if user has access to store
  static async hasStoreAccess(userId: string, storeId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  // Get user's stores
  static async getUserStores(userId: string) {
    throw new Error('Not implemented');
  }
}

// Middleware helper for protecting routes
export function requireAuth(handler: Function) {
  return async (req: any, res: any) => {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return handler(req, res, user);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
} 