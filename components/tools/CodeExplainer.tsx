'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { TextInput } from '@/components/UI/TextInput';
import { OutputDisplay } from '@/components/UI/OutputDisplay';
import { Button } from '@/components/UI/Button';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { CodeLanguage } from '@/types';
import toast from 'react-hot-toast';

export function CodeExplainer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const { process, isLoading, result, error } = useAI('explain-code');

  const languages: { value: CodeLanguage; label: string }[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please paste some code to explain');
      return;
    }

    if (code.length < 5) {
      toast.error('Please enter at least 5 characters of code');
      return;
    }

    await process({ code, language });
  };

  const data = result?.data;
  const hasResult = data && data.explanation;

  const complexityColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <TextInput
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Paste your ${language} code here...`}
          className="min-h-[200px] font-mono text-sm"
          label="💻 Code Input"
        />

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!code.trim()}
            className="ml-auto"
          >
            {isLoading ? 'Explaining...' : 'Explain Code 🤖'}
          </Button>
        </div>

        {code && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Code length: {code.length} characters
          </p>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">AI is analyzing your code...</p>
        </div>
      )}

      {error && (
        <OutputDisplay className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </OutputDisplay>
      )}

      {hasResult && (
        <div className="space-y-4">
          <OutputDisplay title="Explanation" icon="💡">
            <div className="space-y-4">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {data.explanation}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${complexityColors[data.complexity as keyof typeof complexityColors]}`}>
                  {data.complexity.charAt(0).toUpperCase() + data.complexity.slice(1)} Level
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {data.language}
                </span>
              </div>

              {data.examples && data.examples.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📚 Usage Examples
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {data.examples.map((example: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </OutputDisplay>
        </div>
      )}
    </div>
  );
}