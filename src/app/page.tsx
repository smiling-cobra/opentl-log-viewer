"use client";

import { Suspense } from "react";
import { useLogs } from "@/lib/hooks";
import { LogViewerContent } from "@/components/LogViewerContent";

const Home = () => {
  const { logs, loading, error } = useLogs();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white-900 mb-6">
        OTLP Log Viewer
      </h1>
      <Suspense>
        <LogViewerContent logs={logs} />
      </Suspense>
    </main>
  );
};

export default Home;
