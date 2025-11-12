/**
 * Comprehensive validation utilities for authentication forms
 * Industry-standard validation rules
 */

/**
 * Validate email address with comprehensive checks
 * - Proper format with @ symbol
 * - Valid TLD (2-6 characters, no numbers)
 * - No consecutive dots
 * - Valid characters only
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return { valid: false, error: 'Email is required' };
  }

  // Check basic format
  if (!trimmedEmail.includes('@')) {
    return { valid: false, error: 'Email must contain @ symbol' };
  }

  // RFC 5322 compliant email regex with TLD validation
  // This regex ensures:
  // 1. Valid characters before @
  // 2. Valid domain structure
  // 3. TLD is 2-6 letters only (no numbers like .con, .123)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Enter a valid email address' };
  }

  // Additional checks
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid email format' };
  }

  const [localPart, domain] = parts;

  // Check local part (before @)
  if (localPart.length === 0 || localPart.length > 64) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check for consecutive dots
  if (localPart.includes('..') || domain.includes('..')) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check domain part
  if (domain.length === 0 || domain.length > 253) {
    return { valid: false, error: 'Invalid domain name' };
  }

  // Verify TLD (Top Level Domain) - must be letters only, 2-6 chars
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, error: 'Email must have a valid domain' };
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

  return { valid: true, error: null };
};

/**
 * Validate password with strong requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required', strength: 'none' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long', strength: 'weak' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const missingRequirements = [];
  if (!hasUpperCase) missingRequirements.push('uppercase letter');
  if (!hasLowerCase) missingRequirements.push('lowercase letter');
  if (!hasNumber) missingRequirements.push('number');
  if (!hasSpecialChar) missingRequirements.push('special character');

  if (missingRequirements.length > 0) {
    return {
      valid: false,
      error: `Password must include at least one ${missingRequirements.join(', ')}`,
      strength: missingRequirements.length >= 3 ? 'weak' : 'medium'
    };
  }

  // Calculate strength
  let strength = 'medium';
  if (password.length >= 12 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
    strength = 'strong';
  } else if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
    strength = 'medium';
  }

  return { valid: true, error: null, strength };
};

/**
 * Validate name field
 * - Required
 * - 2-50 characters
 * - Letters, spaces, hyphens, apostrophes only
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
    return { valid: false, error: 'Name must not exceed 50 characters' };
  }

  // Allow letters (including international), spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\u00C0-\u017F\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  // Check for excessive spaces or special characters
  if (/\s{2,}/.test(trimmedName) || /[-']{2,}/.test(trimmedName)) {
    return { valid: false, error: 'Invalid name format' };
  }

  return { valid: true, error: null };
};

/**
 * Get password strength indicator for UI
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'none', color: '#gray', text: '' };

  const result = validatePassword(password);
  
  const strengthConfig = {
    none: { color: '#9ca3af', text: '' },
    weak: { color: '#ef4444', text: 'Weak' },
    medium: { color: '#f59e0b', text: 'Medium' },
    strong: { color: '#10b981', text: 'Strong' }
  };

  return strengthConfig[result.strength] || strengthConfig.none;
};
