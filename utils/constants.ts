import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APP_NAME = 'AI Toolkit';
export const APP_DESCRIPTION = 'Smart content processing powered by AI';

export const API_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000,
};

export const TOOL_TYPES = {
  SUMMARIZE: 'summarize',
  CODE: 'code',
  SENTIMENT: 'sentiment',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'API error. Please try again later.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  RATE_LIMIT: 'Rate limit exceeded. Please wait a moment.',
} as const;

export const SUCCESS_MESSAGES = {
  SUMMARIZE: 'Text summarized successfully!',
  CODE: 'Code explained successfully!',
  SENTIMENT: 'Sentiment analyzed successfully!',
} as const;