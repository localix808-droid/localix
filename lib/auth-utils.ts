import { supabase } from './supabase'
import { createUser } from './database'

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

/**
 * Sign up a new user with email verification
 */
export async function signUpUser(data: SignUpData): Promise<AuthResult> {
  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/signin`,
      },
    })

    if (authError) {
      return {
        success: false,
        error: authError.message,
      }
    }

    if (authData.user) {
      // Create user profile in our users table
      const { error: profileError } = await createUser({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
        // The trigger should handle this automatically
      }

      return {
        success: true,
        user: authData.user,
      }
    }

    return {
      success: false,
      error: 'Failed to create user account',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Sign in a user
 */
export async function signInUser(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      user: data.user,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

/**
 * Check if user email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.email_confirmed_at ? true : false
  } catch (error) {
    return false
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to resend verification email',
    }
  }
} 