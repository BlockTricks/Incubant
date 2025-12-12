# Incubant Architecture

## Overview

Incubant is a decentralized startup incubation platform built on the Stacks blockchain. This document outlines the system architecture, components, and their interactions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Startups │  │Governance│  │ Staking  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Stacks Connect (Wallet Integration)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ RPC Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stacks Blockchain                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Incubation  │  │Token Stream  │  │Equity Token  │     │
│  │   Contract   │  │   Contract   │  │   Contract   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Governance   │  │ Mentorship   │  │   Staking    │     │
│  │   Contract   │  │   Contract   │  │   Contract   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contracts

### 1. Incubation Contract
**Purpose**: Manages startup applications and lifecycle

**Key Functions**:
- `apply-for-incubation`: Submit startup application
- `approve-startup`: Approve startup for incubation
- `create-milestone`: Create funding milestones
- `verify-milestone`: Verify milestone completion

**State**:
- Startup applications map
- Approved startups list
- Milestones per startup

### 2. Token Stream Contract
**Purpose**: Handles milestone-based token streaming

**Key Functions**:
- `start-stream`: Begin token stream for milestone
- `withdraw`: Withdraw tokens from stream
- `cancel-stream`: Cancel active stream

**State**:
- Active streams map
- Stream configurations

### 3. Equity Token Contract
**Purpose**: Tokenizes startup equity

**Key Functions**:
- `mint-equity`: Mint equity tokens
- `transfer`: Transfer equity tokens
- `vest`: Handle vesting schedules

**State**:
- Equity token balances
- Vesting schedules

### 4. Governance Contract
**Purpose**: Decentralized decision-making

**Key Functions**:
- `create-proposal`: Create governance proposal
- `vote`: Vote on proposals
- `execute-proposal`: Execute passed proposals

**State**:
- Proposals map
- Votes per proposal

### 5. Mentorship Contract
**Purpose**: Mentor-startup matching

**Key Functions**:
- `register-mentor`: Register as mentor
- `match-mentor`: Match mentor with startup
- `update-reputation`: Update mentor reputation

**State**:
- Mentor registry
- Active mentorship agreements

### 6. Staking Contract
**Purpose**: Community staking pools

**Key Functions**:
- `stake`: Stake tokens for startup
- `unstake`: Unstake tokens
- `claim-rewards`: Claim staking rewards

**State**:
- Staking pools per startup
- User stakes and rewards

## Frontend Architecture

### Components

- **Header**: Navigation and wallet connection
- **StacksProvider**: Wallet connection context
- **ThemeProvider**: Theme management (light/dark)
- **Pages**: Route-based components

### Libraries

- **Next.js 16**: React framework
- **Stacks Connect v8**: Wallet integration
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## Data Flow

1. **User Action** → Frontend component
2. **Contract Call** → Stacks Connect API
3. **Transaction** → Stacks blockchain
4. **State Update** → Contract state change
5. **Event Emission** → Frontend listens for updates
6. **UI Update** → Component re-renders

## Security Considerations

- All sensitive operations require wallet signatures
- Smart contracts enforce business logic
- No private keys stored in frontend
- Environment variables for configuration
- Input validation on both frontend and contracts

## Deployment

- **Smart Contracts**: Deployed to Stacks mainnet
- **Frontend**: Can be deployed to Vercel/Netlify
- **Configuration**: Environment variables for network and addresses

## Future Enhancements

- Oracle integration for milestone verification
- Cross-chain support
- Mobile app (React Native)
- Advanced analytics dashboard
- Real-time notifications

