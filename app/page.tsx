'use client';

import { useState } from 'react';
import { Summarizer } from '@/components/tools/Summarizer';
import { CodeExplainer } from '@/components/tools/CodeExplainer';
import { SentimentAnalyzer } from '@/components/tools/SentimentAnalyzer';
import { ToolLayout } from '@/components/tools/ToolLayout';

export default function Home() {
  const [activeTool, setActiveTool] = useState<'summarize' | 'code' | 'sentiment'>('summarize');

  const tools = [
    { id: 'summarize', label: '📝 Summarizer' },
    { id: 'code', label: '💻 Code Explainer' },
    { id: 'sentiment', label: '😊 Sentiment Analyzer' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Toolkit
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Smart content processing powered by AI
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTool === tool.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } backdrop-blur-sm`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        <ToolLayout>
          {activeTool === 'summarize' && <Summarizer />}
          {activeTool === 'code' && <CodeExplainer />}
          {activeTool === 'sentiment' && <SentimentAnalyzer />}
        </ToolLayout>
      </div>
    </main>
  );
}