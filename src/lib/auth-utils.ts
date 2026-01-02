/**
 * Maps Supabase authentication errors to user-friendly messages.
 * This prevents exposure of internal error details while providing helpful feedback.
 */
export function getAuthErrorMessage(error: any): string {
  const message = error?.message?.toLowerCase() || "";

  // Invalid credentials
  if (message.includes("invalid login") || message.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again.";
  }

  // User already exists
  if (message.includes("already registered") || message.includes("user already exists")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  // Email not confirmed
  if (message.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }

  // Too many requests / rate limiting
  if (message.includes("too many requests") || message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Weak password
  if (message.includes("password") && (message.includes("weak") || message.includes("short"))) {
    return "Password is too weak. Please use at least 6 characters.";
  }

  // Invalid email format
  if (message.includes("invalid email") || message.includes("email format")) {
    return "Please enter a valid email address.";
  }

  // Network errors
  if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
    return "Unable to connect. Please check your internet connection and try again.";
  }

  // Default fallback - generic message that doesn't expose internals
  return "Authentication failed. Please try again.";
}
