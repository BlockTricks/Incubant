"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useStacks } from "@/components/StacksProvider";
import { governanceCalls } from "@/lib/contract-calls";
import { request } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { isMainnet } from "@/lib/stacks-config";

export default function GovernancePage() {
  const { isSignedIn } = useStacks();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    // In a real app, you'd track proposal IDs
    // For now, we'll show a placeholder
    setLoading(false);
  };

  const handleVote = async (proposalId: number, voteChoice: number, votingPower: number) => {
    if (!isSignedIn) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const response = await request('stx_callContract', {
        contract: CONTRACT_ADDRESSES.GOVERNANCE,
        functionName: "vote",
        functionArgs: [
          uintCV(proposalId),
          uintCV(voteChoice), // 0 = no, 1 = yes
          uintCV(votingPower),
        ],
        network: 'mainnet', // Contracts are deployed on mainnet
      });

      if (response) {
        console.log("Vote submitted:", response);
        alert("Vote submitted! Check the explorer for transaction status.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to submit vote. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Governance</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Active Proposals</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading proposals...</p>
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>No active proposals at the moment.</p>
              <p className="mt-2 text-sm">Proposals will appear here when created.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{proposal.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 0
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {proposal.status === 0 ? "Active" : "Closed"}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{proposal.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span>Yes: {proposal.yesVotes || 0}</span>
                      <span className="mx-2">•</span>
                      <span>No: {proposal.noVotes || 0}</span>
                    </div>
                    {proposal.status === 0 && isSignedIn && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(proposal.id, 1, 100)}
                          className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                        >
                          Vote Yes
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, 0, 100)}
                          className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                        >
                          Vote No
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">How Governance Works</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Community members can create proposals for startup approvals, milestone verifications, and platform changes</li>
            <li>Voting power is based on staked tokens or governance tokens</li>
            <li>Proposals require a majority vote to pass</li>
            <li>All votes are recorded on-chain for transparency</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

