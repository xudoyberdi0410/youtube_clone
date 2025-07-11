import * as React from "react";
import { useSearchParams } from "next/navigation";

const mockResults = [
  { id: 1, title: "Mock Video 1", description: "This is a mock video result." },
  { id: 2, title: "Mock Video 2", description: "Another mock video result." },
  { id: 3, title: "Mock Video 3", description: "Yet another mock video result." },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for: <span className="text-blue-600">{query}</span></h1>
      <div className="space-y-4">
        {mockResults.map(result => (
          <div key={result.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{result.title}</h2>
            <p className="text-gray-600">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}