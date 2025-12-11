"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { useStacks } from "@/components/StacksProvider";
import { request } from "@stacks/connect";
import { uintCV } from "@stacks/transactions";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { isMainnet } from "@/lib/stacks-config";

export default function StakingPage() {
  const { isSignedIn } = useStacks();
  const [startupId, setStartupId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    if (!isSignedIn) {
      alert("Please connect your wallet first");
      return;
    }

    if (!startupId || !amount) {
      alert("Please enter startup ID and amount");
      return;
    }

    setLoading(true);
    try {
      const response = await request('stx_callContract', {
        contract: CONTRACT_ADDRESSES.STAKING,
        functionName: "stake-tokens",
        functionArgs: [
          uintCV(parseInt(startupId)),
          uintCV(parseInt(amount) * 1e6), // Convert to micro-STX
        ],
        network: isMainnet ? 'mainnet' : 'testnet',
      });

      if (response) {
        console.log("Stake submitted:", response);
        alert("Stake submitted! Check the explorer for transaction status.");
        setStartupId("");
        setAmount("");
      }
    } catch (error) {
      console.error("Error staking:", error);
      alert("Failed to stake tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Staking</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Stake Tokens</h2>
          
          {!isSignedIn ? (
            <div className="text-center py-8 text-gray-600">
              <p>Please connect your wallet to stake tokens.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStake();
              }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="startupId" className="block text-sm font-medium text-gray-700 mb-2">
                  Startup ID *
                </label>
                <input
                  type="number"
                  id="startupId"
                  required
                  value={startupId}
                  onChange={(e) => setStartupId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (STX) *
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                  min="1"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Minimum stake: 1000 STX
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Staking..." : "Stake Tokens"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Benefits of Staking</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Earn rewards based on startup milestones</li>
            <li>Support startups you believe in</li>
            <li>Get preferential equity access</li>
            <li>Participate in risk-sharing with the community</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">How Staking Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Choose a startup you want to support</li>
            <li>Stake your tokens in their staking pool</li>
            <li>Earn rewards as the startup completes milestones</li>
            <li>Unstake your tokens at any time (subject to lock periods)</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

