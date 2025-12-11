import { Header } from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Incubant
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Where Ideas Meet Capital, Transparently
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Decentralized Startup Incubation Platform on Stacks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Milestone-Based Funding</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Startups receive continuous token streams tied to verified milestones. 
              Funds are automatically released as milestones are completed.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
            <div className="text-4xl mb-4">🗳️</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Decentralized Governance</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Community members vote on which startups to incubate. 
              Transparent decision-making process recorded on-chain.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
            <div className="text-4xl mb-4">🎫</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Equity Tokenization</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Startup equity represented as tokens with automatic vesting schedules. 
              Transparent cap table management.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">For Startups</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>✓ Apply for incubation with detailed proposals</li>
              <li>✓ Receive continuous funding as milestones are met</li>
              <li>✓ Access mentorship network</li>
              <li>✓ Build community support early</li>
              <li>✓ Transparent equity management</li>
            </ul>
            <Link
              href="/startups/apply"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Apply Now
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">For Investors</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>✓ Discover promising startups early</li>
              <li>✓ Vote on which startups to incubate</li>
              <li>✓ Stake tokens to support startups</li>
              <li>✓ Earn rewards based on success</li>
              <li>✓ Trade equity tokens</li>
            </ul>
            <Link
              href="/startups"
              className="mt-6 inline-block px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              Browse Startups
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Platform Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Mentorship</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">On-chain reputation system for mentors</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Transparency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">All progress recorded on-chain</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Staking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Community staking pools with rewards</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Global Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">No geographic limitations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
