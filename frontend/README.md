# Incubant Frontend

Next.js frontend for the Incubant decentralized startup incubation platform.

## Features

- 🚀 **Startup Application** - Apply for incubation with detailed proposals
- 📊 **Startup Dashboard** - Browse and track startup progress
- 🗳️ **Governance** - Vote on proposals and startup approvals
- 💰 **Staking** - Stake tokens to support startups and earn rewards
- 🔐 **Wallet Integration** - Connect with Stacks Wallet via Stacks Connect

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_STACKS_NETWORK=mainnet
# or
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── startups/          # Startup pages
│   ├── governance/        # Governance page
│   └── staking/           # Staking page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   └── StacksProvider.tsx # Stacks Connect provider
└── lib/                   # Utilities
    ├── contracts.ts       # Contract addresses
    ├── stacks-config.ts   # Network configuration
    └── contract-calls.ts  # Contract interaction utilities
```

## Contract Addresses

Contract addresses are configured in `lib/contracts.ts`. These are automatically set from the mainnet deployment.

## Features in Detail

### Startup Application
- Submit applications with name, description, and detailed proposal
- All applications are recorded on-chain
- Community can vote on applications

### Governance
- View active proposals
- Vote on proposals (Yes/No)
- Track voting results
- Proposals include startup approvals and milestone verifications

### Staking
- Stake tokens to support startups
- Earn rewards based on milestone completion
- View staking pools and rewards

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Stacks Connect** - Wallet integration
- **@stacks/transactions** - Contract interactions

## License

MIT
