"use client";

import Link from "next/link";
import { useStacks } from "./StacksProvider";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { isSignedIn, userData, signIn, signOut } = useStacks();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          🚀 Incubant
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/startups" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Startups
          </Link>
          <Link href="/governance" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Governance
          </Link>
          <Link href="/staking" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Staking
          </Link>
          <Link href="/mentorship" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Mentorship
          </Link>
          
          <ThemeToggle />
          
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {userData?.addresses?.stx?.[0]?.address 
                  ? `${userData.addresses.stx[0].address.slice(0, 6)}...${userData.addresses.stx[0].address.slice(-4)}`
                  : "Connected"}
              </span>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

