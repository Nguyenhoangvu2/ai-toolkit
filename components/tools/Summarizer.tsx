'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { TextInput } from '@/components/UI/TextInput';
import { OutputDisplay } from '@/components/UI/OutputDisplay';
import { Button } from '@/components/UI/Button';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { SummarizeLength } from '@/types';
import toast from 'react-hot-toast';

export function Summarizer() {
  const [text, setText] = useState('');
  const [length, setLength] = useState<SummarizeLength>('medium');
  const { process, isLoading, result, error } = useAI('summarize');

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to summarize');
      return;
    }

    if (text.split(/\s+/).length < 10) {
      toast.error('Please enter at least 10 words');
      return;
    }

    await process({ text, length });
  };

  const data = result?.data;
  const hasResult = data && data.summary;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your long text here to summarize..."
          className="min-h-[200px]"
          label="📄 Input Text"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {(['short', 'medium', 'detailed'] as SummarizeLength[]).map((option) => (
              <button
                key={option}
                onClick={() => setLength(option)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  length === option
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!text.trim()}
            className="ml-auto"
          >
            {isLoading ? 'Summarizing...' : 'Summarize ✨'}
          </Button>
        </div>

        {text && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Word count: {text.split(/\s+/).length} words
          </p>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">AI is analyzing your text...</p>
        </div>
      )}

      {error && (
        <OutputDisplay className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </OutputDisplay>
      )}

      {hasResult && (
        <div className="space-y-4">
          <OutputDisplay title="Summary" icon="📝">
            <div className="space-y-4">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {data.summary}
              </p>
              
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🎯 Key Points
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {data.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Original: {data.wordCount.original} words</span>
                <span>Summary: {data.wordCount.summary} words</span>
                <span>
                  Reduction: {Math.round((1 - data.wordCount.summary / data.wordCount.original) * 100)}%
                </span>
              </div>
            </div>
          </OutputDisplay>
        </div>
      )}
    </div>
  );
}