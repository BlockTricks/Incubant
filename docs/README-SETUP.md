# Incubant Setup Guide

## Prerequisites

- Node.js 18+ and npm
- [Clarinet](https://docs.hiro.so/clarinet) installed
- Stacks CLI (optional, for advanced operations)

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp env.template .env
   ```
   
   Then edit `.env` and fill in:
   - `DEPLOYER_SECRET_KEY`: Your deployer account secret key (get from `clarinet accounts`)
   - Other optional variables as needed

3. **Verify Contracts**
   ```bash
   npm run check
   # or
   clarinet check
   ```

## Development

### Testing Contracts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Interactive Console

```bash
npm run console
# or
clarinet console
```

### Deploy to Devnet

```bash
# Start local devnet
clarinet devnet start

# Deploy contracts
npm run deploy:devnet
# or
clarinet deploy --devnet
```

## Contract Addresses

After deployment, update your `.env` file with the deployed contract addresses:

```env
INCUBATION_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.incubation
EQUITY_TOKEN_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.equity-token
# ... etc
```

## Project Structure

```
.
├── contracts/          # Clarity smart contracts
│   ├── incubation.clar
│   ├── token-stream.clar
│   ├── equity-token.clar
│   ├── governance.clar
│   ├── mentorship.clar
│   └── staking.clar
├── tests/             # TypeScript test files
├── scripts/           # Deployment and utility scripts
├── settings/          # Clarinet network configurations
├── .env              # Environment variables (gitignored)
├── env.template      # Environment template
└── Clarinet.toml     # Clarinet project configuration
```

## Getting Deployer Secret Key

To get your deployer account secret key:

```bash
clarinet accounts
```

This will show all accounts with their secret keys. Use the deployer account's secret key in your `.env` file.

## Next Steps

1. Write tests for all contracts
2. Deploy to testnet for testing
3. Build frontend integration
4. Deploy to mainnet (when ready)

## Resources

- [Clarity Language Docs](https://docs.stacks.co/docs/clarity)
- [Clarinet Docs](https://docs.hiro.so/clarinet)
- [Stacks.js Docs](https://stacks.js.org/)
- [Stacks Connect](https://github.com/stacks/connect)


