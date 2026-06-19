import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 3) {
      return NextResponse.json(
        { error: 'Text must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Sử dụng Hugging Face API (miễn phí)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      throw new Error('Hugging Face API error');
    }

    const result = await response.json();
    
    // Parse sentiment result
    let sentiment = 'neutral';
    let score = 0.5;
    let confidence = 0.5;

    if (Array.isArray(result) && result.length > 0) {
      const predictions = result[0] || [];
      if (predictions.length >= 2) {
        const positive = predictions.find((p: any) => p.label === 'POSITIVE');
        const negative = predictions.find((p: any) => p.label === 'NEGATIVE');
        
        if (positive && negative) {
          const posScore = positive.score || 0;
          const negScore = negative.score || 0;
          score = posScore;
          sentiment = posScore > negScore ? 'positive' : 'negative';
          confidence = Math.max(posScore, negScore);
        }
      }
    }

    const emojiMap = {
      positive: '😊',
      negative: '😞',
      neutral: '😐',
    };

    return NextResponse.json({
      success: true,
      data: {
        sentiment,
        score: Math.round(score * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
        emoji: emojiMap[sentiment as keyof typeof emojiMap] || '😐',
      },
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}