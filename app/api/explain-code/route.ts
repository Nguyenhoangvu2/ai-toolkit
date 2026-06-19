import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || code.length < 5) {
      return NextResponse.json(
        { error: 'Code must be at least 5 characters' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a senior software engineer. Explain the given ${language || 'code'} in simple terms.
                   Return a JSON object with: explanation (string), complexity (string: 'beginner'|'intermediate'|'advanced'), 
                   examples (array of strings showing usage), and language (string).
                   Make the explanation beginner-friendly and include practical examples.`,
        },
        {
          role: 'user',
          content: code,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 600,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json({
      success: true,
      data: {
        explanation: result.explanation || 'No explanation generated',
        complexity: result.complexity || 'intermediate',
        examples: result.examples || [],
        language: result.language || language || 'unknown',
      },
    });
  } catch (error) {
    console.error('Code explain error:', error);
    return NextResponse.json(
      { error: 'Failed to explain code' },
      { status: 500 }
    );
  }
}