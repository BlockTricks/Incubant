"use client";

import Link from "next/link";
import { useStacks } from "./StacksProvider";

export function Header() {
  const { isSignedIn, userData, signIn, signOut } = useStacks();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🚀 Incubant
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/startups" className="text-gray-700 hover:text-blue-600">
            Startups
          </Link>
          <Link href="/governance" className="text-gray-700 hover:text-blue-600">
            Governance
          </Link>
          <Link href="/staking" className="text-gray-700 hover:text-blue-600">
            Staking
          </Link>
          <Link href="/mentorship" className="text-gray-700 hover:text-blue-600">
            Mentorship
          </Link>
          
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {userData?.profile?.stxAddress?.mainnet?.slice(0, 6)}...
                {userData?.profile?.stxAddress?.mainnet?.slice(-4)}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

