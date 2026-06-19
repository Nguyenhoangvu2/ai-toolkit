import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, length } = await req.json();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters' },
        { status: 400 }
      );
    }

    const lengthMap = {
      short: '1-2 sentences',
      medium: '3-5 sentences',
      detailed: '1 detailed paragraph',
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert content summarizer. Summarize the given text in ${lengthMap[length]}. 
                   Return a JSON object with: summary (string) and keyPoints (array of strings).
                   Keep the summary concise and capture the most important information.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json({
      success: true,
      data: {
        summary: result.summary || 'No summary generated',
        keyPoints: result.keyPoints || [],
        wordCount: {
          original: text.split(/\s+/).length,
          summary: (result.summary || '').split(/\s+/).length,
        },
      },
    });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize text' },
      { status: 500 }
    );
  }
}