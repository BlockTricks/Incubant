"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { incubationCalls } from "@/lib/contract-calls";
import Link from "next/link";

export default function StartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    try {
      // Get the next startup ID to know how many exist
      const nextIdResult = await incubationCalls.getNextStartupId();
      const nextId = parseInt(nextIdResult.value.value) || 1;
      
      // Load all startups
      const startupPromises = [];
      for (let i = 1; i < nextId; i++) {
        startupPromises.push(
          incubationCalls.getStartup(i).catch(() => null)
        );
      }
      
      const results = await Promise.all(startupPromises);
      const validStartups = results
        .map((result, index) => {
          if (!result || result.value === null) return null;
          return {
            id: index + 1,
            ...result.value.value,
          };
        })
        .filter(Boolean);
      
      setStartups(validStartups);
    } catch (error) {
      console.error("Error loading startups:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: number) => {
    const statusMap: Record<number, string> = {
      0: "Pending",
      1: "Approved",
      2: "Active",
      3: "Completed",
      4: "Rejected",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: "bg-yellow-100 text-yellow-800",
      1: "bg-green-100 text-green-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-purple-100 text-purple-800",
      4: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Startups</h1>
          <Link
            href="/startups/apply"
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Apply for Incubation
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading startups...</p>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No startups found.</p>
            <Link
              href="/startups/apply"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Be the first to apply!
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{startup.name.value}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      startup.status.value
                    )}`}
                  >
                    {getStatusLabel(startup.status.value)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {startup.description.value}
                </p>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>ID: #{startup.id}</span>
                  <span>
                    {startup.total_funding.value
                      ? `${(parseInt(startup.total_funding.value) / 1e6).toFixed(2)} STX`
                      : "No funding yet"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

