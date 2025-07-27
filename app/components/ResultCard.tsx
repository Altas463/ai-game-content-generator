import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function ResultCard({ content }: { content: string }) {
  return (
    <div className="relative p-6 border rounded-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl border-transparent bg-clip-padding before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-400 before:to-purple-400 before:opacity-30 before:-z-10">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="h-6 w-6 text-purple-500 dark:text-blue-300" />
        <span className="text-lg font-bold text-gray-700 dark:text-gray-100">AI Output</span>
      </div>
      <div className="prose prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-100">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
