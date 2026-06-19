import { z } from 'zod';

export const textSchema = z.object({
  text: z.string()
    .min(3, 'Text must be at least 3 characters')
    .max(10000, 'Text must not exceed 10000 characters')
    .trim(),
});

export const summarizeSchema = z.object({
  text: z.string()
    .min(10, 'Text must be at least 10 characters for summarization')
    .max(5000, 'Text must not exceed 5000 characters for summarization')
    .trim(),
  length: z.enum(['short', 'medium', 'detailed']).default('medium'),
});

export const codeSchema = z.object({
  code: z.string()
    .min(5, 'Code must be at least 5 characters')
    .max(10000, 'Code must not exceed 10000 characters')
    .trim(),
  language: z.enum(['javascript', 'python', 'java', 'cpp', 'other']).default('javascript'),
});

export const sentimentSchema = z.object({
  text: z.string()
    .min(3, 'Text must be at least 3 characters for sentiment analysis')
    .max(1000, 'Text must not exceed 1000 characters for sentiment analysis')
    .trim(),
});

export function validateText(text: string): { valid: boolean; error?: string } {
  try {
    textSchema.parse({ text });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid text' };
  }
}

export function validateSummarize(text: string, length: string): { valid: boolean; error?: string } {
  try {
    summarizeSchema.parse({ text, length });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid input' };
  }
}

export function validateCode(code: string, language: string): { valid: boolean; error?: string } {
  try {
    codeSchema.parse({ code, language });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid code' };
  }
}

export function validateSentiment(text: string): { valid: boolean; error?: string } {
  try {
    sentimentSchema.parse({ text });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid text' };
  }
}