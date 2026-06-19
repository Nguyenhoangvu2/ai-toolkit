'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { TextInput } from '@/components/UI/TextInput';
import { OutputDisplay } from '@/components/UI/OutputDisplay';
import { Button } from '@/components/UI/Button';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

export function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const { process, isLoading, result, error } = useAI('analyze-sentiment');

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    if (text.length < 3) {
      toast.error('Please enter at least 3 characters');
      return;
    }

    await process({ text });
  };

  const data = result?.data;
  const hasResult = data && data.sentiment;

  const sentimentColors = {
    positive: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    negative: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    neutral: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  };

  const sentimentTextColors = {
    positive: 'text-green-700 dark:text-green-400',
    negative: 'text-red-700 dark:text-red-400',
    neutral: 'text-gray-700 dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a review, comment, or any text to analyze sentiment..."
          className="min-h-[150px]"
          label="😊 Input Text"
        />

        <div className="flex items-center justify-end">
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!text.trim()}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Sentiment 🔍'}
          </Button>
        </div>

        {text && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Characters: {text.length}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Analyzing sentiment...</p>
        </div>
      )}

      {error && (
        <OutputDisplay className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </OutputDisplay>
      )}

      {hasResult && (
        <OutputDisplay
          className={`border-2 ${sentimentColors[data.sentiment as keyof typeof sentimentColors]}`}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">{data.emoji}</div>
            
            <div>
              <h3 className={`text-2xl font-bold ${sentimentTextColors[data.sentiment as keyof typeof sentimentTextColors]}`}>
                {data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Confidence: {(data.confidence * 100).toFixed(1)}%
              </p>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  data.sentiment === 'positive'
                    ? 'bg-green-500'
                    : data.sentiment === 'negative'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
                style={{ width: `${data.score * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Score: {(data.score * 100).toFixed(1)}% positive
              </p>
            </div>
          </div>
        </OutputDisplay>
      )}
    </div>
  );
}