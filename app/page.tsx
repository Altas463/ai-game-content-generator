import ContentForm from '@/app/components/ContentForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500">
      <div className="w-full max-w-3xl px-4 py-8">
        <ContentForm />
      </div>
      <footer className="mt-8 text-gray-500 text-xs text-center">
        &copy; {new Date().getFullYear()} AI Game Content Generator. Powered by n8n & OpenRouter.
      </footer>
    </main>
  );
}
