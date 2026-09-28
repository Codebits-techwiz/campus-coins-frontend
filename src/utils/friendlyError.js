/**
 * Turn technical / API errors into short, plain English for non-technical users.
 */

const EXACT_MAP = {
  // Auth
  'Invalid email or password': 'That email or password doesn’t look right. Please try again.',
  'User already exists': 'An account with this email already exists. Try logging in instead.',
  'Invalid or expired OTP code': 'That code is wrong or has expired. Please request a new one.',
  'OTP has expired or registration request was not found. Please register again.':
    'Your sign-up code expired. Please register again.',
  'Invalid OTP code. Please check your email and try again.':
    'That code doesn’t match. Please check your email and try again.',
  'No pending registration found for this email. Please register again.':
    'We couldn’t find a pending sign-up for this email. Please register again.',
  'Verification session expired. Please log in again.':
    'Your verification timed out. Please log in again.',
  'Invalid verification session': 'Your verification session expired. Please log in again.',
  'Unable to resend OTP. Please log in again.':
    'We couldn’t resend the code. Please log in again.',
  'Current password is incorrect': 'Your current password is incorrect. Please try again.',

  // Generic / HTTP-ish
  'Server Error': 'Something went wrong on our side. Please try again in a moment.',
  'Not authorized, no token': 'Please log in to continue.',
  'Not authorized, token failed': 'Your session expired. Please log in again.',
  'Not authorized': 'Please log in to continue.',
  'Access denied': 'You don’t have permission to do that.',
  'Forbidden': 'You don’t have permission to do that.',
  'Unauthorized': 'Please log in to continue.',
  'Invalid ID format': 'Something went wrong with that request. Please refresh and try again.',
  'Cast to ObjectId failed': 'Something went wrong with that request. Please refresh and try again.',

  // Domain
  'Category not found': 'We couldn’t find that category. Please refresh and try again.',
  'Permission denied. System default categories cannot be modified.':
    'Built-in categories can’t be edited. You can create your own instead.',
  'Permission denied. System default categories cannot be deleted.':
    'Built-in categories can’t be deleted.',
  'Reassignment target category not found':
    'Please choose a valid category to move those transactions to.',
  'Invalid category ID': 'Please choose a category from the list.',
  'Invalid category ID specified': 'Please choose a category from the list.',
  'Transaction not found': 'We couldn’t find that transaction. It may have been deleted.',
  'Transaction not found or has been deleted':
    'That transaction is no longer available. It may have been deleted.',
  'Transaction not found or already deleted':
    'That transaction was already deleted.',
  'Budget entry not found': 'We couldn’t find that budget. Please refresh and try again.',
  'Recurring rule not found': 'We couldn’t find that repeating payment. Please refresh and try again.',
  'User not found': 'We couldn’t find that account.',
  'User profile not found': 'We couldn’t load your profile. Please refresh and try again.',
  'Notification not found': 'That notification is no longer available.',
  'Bookmark not found': 'That saved item is no longer available.',
  'Transaction template not found': 'That quick template is no longer available.',
  'Saving tip not found': 'That tip is no longer available.',
  'Invalid refType': 'Something went wrong while saving. Please try again.',
  'CSV file is empty.': 'This CSV file looks empty. Please check the file and try again.',
  'CSV exceeds maximum allowed limit of 1000 rows.':
    'This file is too large. Please use a CSV with 1,000 rows or fewer.',
  'No confirmed transaction rows provided to import.':
    'Please assign a category to each row before importing.',
  'Failed to load categories': 'We couldn’t load categories. Please refresh the page.',
  'Failed to save category': 'We couldn’t save that category. Please try again.',
  'Failed to delete category': 'We couldn’t delete that category. Please try again.',
  'Failed to add transaction': 'We couldn’t add that transaction. Please check the details and try again.',
  'Failed to update template': 'We couldn’t update that template. Please try again.',
  'Failed to delete template': 'We couldn’t delete that template. Please try again.',
  'Failed to save template': 'We couldn’t save that template. Please try again.',
  'Failed to load transaction details': 'We couldn’t open that transaction. Please try again.',
  'Failed to parse CSV': 'We couldn’t read that CSV file. Please check the format and try again.',
  'Failed to import CSV': 'We couldn’t import those transactions. Please try again.',
  'Could not read receipt data.': 'We couldn’t read that receipt. Try a clearer photo.',
  'Failed to scan receipt': 'We couldn’t scan that receipt. Please try again.',
  'Failed to update transaction': 'We couldn’t update that transaction. Please try again.',
  'Failed to delete transaction': 'We couldn’t delete that transaction. Please try again.',
  'Failed to create category': 'We couldn’t create that category. Please try again.',
  'Cannot update default category': 'Built-in categories can’t be edited.',
  'Cannot delete this category': 'We couldn’t delete that category. Please try again.',
  'Failed to save budget': 'We couldn’t save that budget. Please try again.',
  'Failed to delete budget': 'We couldn’t delete that budget. Please try again.',
  'Failed to load stats.': 'We couldn’t load the stats right now. Please refresh.',
  'Registration failed': 'We couldn’t create your account. Please try again.',
  'Admin login failed': 'We couldn’t log you in. Please check your details and try again.',
};

const PATTERN_MAP = [
  {
    test: /already exists/i,
    message: 'That name is already in use. Please choose a different one.',
  },
  {
    test: /Category ".+" already exists/i,
    message: 'A category with that name already exists. Please choose another name.',
  },
  {
    test: /Cannot delete category ".+" because it has \d+ active transaction/i,
    message:
      'This category still has transactions. Move them to another category first, then try deleting again.',
  },
  {
    test: /Cannot delete: \d+ transaction\(s\) reference this category/i,
    message:
      'This category is still used by some transactions. Move those transactions first, then delete it.',
  },
  {
    test: /not found or does not belong to you/i,
    message: 'We couldn’t find that item, or it doesn’t belong to your account.',
  },
  {
    test: /CSV parsing failed/i,
    message: 'We couldn’t read that CSV file. Please check the format and try again.',
  },
  {
    test: /Validation failed on row/i,
    message: 'One of the rows has invalid information. Please review the highlighted rows and try again.',
  },
  {
    test: /Category .+ on row .+ is invalid/i,
    message: 'One of the rows has an invalid category. Please pick a valid category for every row.',
  },
  {
    test: /ECONNREFUSED|Network Error|ERR_NETWORK|Failed to fetch/i,
    message: 'We can’t reach the server right now. Check your internet connection and try again.',
  },
  {
    test: /timeout|ETIMEDOUT/i,
    message: 'That took too long. Please try again.',
  },
  {
    test: /too many requests|rate limit|429/i,
    message: 'You’re doing that a bit too quickly. Please wait a moment and try again.',
  },
  {
    test: /jwt|token expired|jsonwebtoken/i,
    message: 'Your session expired. Please log in again.',
  },
  {
    test: /mongo|cast to|objectid|validation failed/i,
    message: 'Something went wrong with that request. Please check your details and try again.',
  },
  {
    test: /permission denied|not allowed|forbidden/i,
    message: 'You don’t have permission to do that.',
  },
];

const GENERIC_FALLBACK = 'Something went wrong. Please try again.';

function firstValidationMessage(error) {
  if (!Array.isArray(error) || error.length === 0) return null;
  const first = error[0];
  return first?.message || first?.msg || first?.path || null;
}

/**
 * Extract a raw message string from an axios error, API body, or plain string.
 */
export function extractRawError(errOrMessage, fallback = GENERIC_FALLBACK) {
  if (!errOrMessage) return fallback;

  if (typeof errOrMessage === 'string') {
    return errOrMessage.trim() || fallback;
  }

  // Axios / fetch-style error
  const data = errOrMessage.response?.data;
  if (data) {
    if (typeof data.error === 'string' && data.error.trim()) return data.error.trim();
    const fromArray = firstValidationMessage(data.error);
    if (fromArray) return String(fromArray).trim();
    if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
    if (Array.isArray(data.errors) && data.errors[0]) {
      const e0 = data.errors[0];
      return String(e0.message || e0.msg || e0).trim();
    }
  }

  if (typeof errOrMessage.message === 'string' && errOrMessage.message.trim()) {
    // Skip generic axios "Request failed with status code 400"
    if (!/^Request failed with status code \d+$/i.test(errOrMessage.message)) {
      return errOrMessage.message.trim();
    }
  }

  return fallback;
}

/**
 * Map a raw message to plain English for non-technical users.
 */
export function toFriendlyMessage(raw, fallback = GENERIC_FALLBACK) {
  if (!raw || typeof raw !== 'string') return fallback;

  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  if (EXACT_MAP[trimmed]) return EXACT_MAP[trimmed];

  // Case-insensitive exact match
  const lower = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(EXACT_MAP)) {
    if (key.toLowerCase() === lower) return value;
  }

  for (const { test, message } of PATTERN_MAP) {
    if (test.test(trimmed)) return message;
  }

  // Already sounds friendly (short, no stack traces / codes)
  if (
    trimmed.length <= 140 &&
    !/[A-Z]:\\|at\s+\w+\s+\(|Error:|TypeError|Mongo|ECONN|ObjectId|stack/i.test(trimmed)
  ) {
    return trimmed;
  }

  return fallback;
}

/**
 * One-shot: axios/error/string → friendly English.
 */
export function getFriendlyError(errOrMessage, fallback = GENERIC_FALLBACK) {
  return toFriendlyMessage(extractRawError(errOrMessage, fallback), fallback);
}
