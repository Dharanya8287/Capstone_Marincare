/**
 * Backend validation utilities for authentication
 * Server-side validation to prevent malicious inputs
 */

/**
 * Validate email address - server side
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { valid: false, error: 'Email is required' };
  }

  // Check length limits
  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  // RFC 5322 compliant email regex with strict TLD validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email format' };
  }

  const [localPart, domain] = parts;

  // Check local part length
  if (localPart.length === 0 || localPart.length > 64) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check for consecutive dots
  if (localPart.includes('..') || domain.includes('..')) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check domain
  if (domain.length === 0 || domain.length > 253) {
    return { valid: false, error: 'Invalid domain name' };
  }

  // Verify TLD is letters only
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, error: 'Invalid domain' };
  }

  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-zA-Z]{2,6}$/.test(tld)) {
    return { valid: false, error: 'Invalid domain extension' };
  }

  // Common typo check - reject common misspellings
  const commonTypos = ['con', 'cmo', 'cim', 'ocm', 'nmo'];
  if (commonTypos.includes(tld.toLowerCase())) {
    return { valid: false, error: 'Invalid domain extension (possible typo)' };
  }

  return { valid: true, error: null, sanitized: trimmedEmail.toLowerCase() };
};

/**
 * Validate password - server side
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return {
      valid: false,
      error: 'Password must include uppercase, lowercase, number, and special character'
    };
  }

  return { valid: true, error: null };
};

/**
 * Validate name - server side
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return { valid: false, error: 'Name is required' };
  }

  if (trimmedName.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 50) {
    return { valid: false, error: 'Name is too long' };
  }

  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\u00C0-\u017F\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }

  // Check for excessive spaces or special characters
  if (/\s{2,}/.test(trimmedName) || /[-']{2,}/.test(trimmedName)) {
    return { valid: false, error: 'Invalid name format' };
  }

  return { valid: true, error: null, sanitized: trimmedName };
};

/**
 * Sanitize input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove any HTML tags
  return input.replace(/<[^>]*>/g, '').trim();
};
