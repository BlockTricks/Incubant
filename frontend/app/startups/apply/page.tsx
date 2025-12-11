"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { useStacks } from "@/components/StacksProvider";
import { request } from "@stacks/connect";
import { stringAsciiCV, stringUtf8CV } from "@stacks/transactions";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { isMainnet } from "@/lib/stacks-config";

export default function ApplyPage() {
  const { isSignedIn } = useStacks();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    proposal: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const functionArgs = [
        stringAsciiCV(formData.name),
        stringUtf8CV(formData.description),
        stringUtf8CV(formData.proposal),
      ];

      const response = await request('stx_callContract', {
        contract: CONTRACT_ADDRESSES.INCUBATION,
        functionName: "apply-for-incubation",
        functionArgs,
        network: isMainnet ? 'mainnet' : 'testnet',
      });

      if (response) {
        console.log("Transaction submitted:", response);
        alert("Application submitted! Check the explorer for transaction status.");
        setFormData({ name: "", description: "", proposal: "" });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Apply for Incubation</h1>
          <p className="text-gray-600 mb-8">
            Please connect your wallet to apply for incubation.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Apply for Incubation</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Startup Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Awesome Startup"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="A brief description of your startup..."
              maxLength={500}
            />
          </div>

          <div>
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Proposal *
            </label>
            <textarea
              id="proposal"
              required
              value={formData.proposal}
              onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              placeholder="Describe your startup idea, milestones, funding needs, and how you plan to use the funds..."
              maxLength={1000}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">What happens next?</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Your application will be submitted on-chain</li>
            <li>The community will review and vote on your proposal</li>
            <li>If approved, you can create milestones and start receiving funding</li>
            <li>Funds are released automatically as milestones are verified</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

