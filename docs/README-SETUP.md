# Incubant Setup Guide

## Prerequisites

- **Node.js** 18+ and npm
- [**Clarinet**](https://docs.hiro.so/clarinet) installed
- **Stacks CLI** (optional, for advanced operations)
- **Git** for version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Incubant.git
cd Incubant
```

### 2. Install Root Dependencies

   ```bash
   npm install
   ```

This installs:
- Clarinet SDK for testing
- TypeScript and build tools
- Deployment scripts dependencies

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Set Up Environment Variables

   ```bash
   cp env.template .env
   ```
   
Edit `.env` and fill in:
- `DEPLOYER_SECRET_KEY`: Your deployer account secret key
- `STACKS_NETWORK`: Network (mainnet, testnet, or devnet)

For frontend, create `frontend/.env.local`:
```env
NEXT_PUBLIC_STACKS_NETWORK=mainnet
```

## Development

### Smart Contracts

#### Check Contract Syntax

   ```bash
   npm run check
   # or
   clarinet check
   ```

#### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

#### Interactive Console

```bash
npm run console
# or
clarinet console
```

#### Deploy to Devnet

```bash
# Start local devnet
clarinet devnet start

# Deploy contracts
npm run deploy:devnet
# or
clarinet deploy --devnet
```

### Frontend

#### Start Development Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Build for Production

```bash
cd frontend
npm run build
npm start
```

#### Lint Code

```bash
cd frontend
npm run lint
```

## Deployment

### Deploy to Testnet

1. Update `.env` with testnet configuration
2. Get testnet STX from faucet
3. Run deployment:
   ```bash
   npm run deploy:testnet
   ```

### Deploy to Mainnet

⚠️ **Warning**: Mainnet deployment requires real STX and is irreversible.

1. Ensure `.env` has mainnet configuration
2. Verify you have sufficient STX for deployment
3. Run deployment:
   ```bash
   npm run deploy:mainnet
   ```

After deployment, update `frontend/lib/contracts.ts` with the new contract addresses.

## Getting Deployer Secret Key

### Using Clarinet

```bash
clarinet accounts
```

This shows all accounts with their secret keys. Use the deployer account's secret key.

### Using Stacks Wallet

1. Export your wallet's private key
2. Use the private key (64 hex characters) or mnemonic phrase

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
├── frontend/           # Next.js frontend application
├── scripts/            # Deployment and utility scripts
├── tests/              # TypeScript test files
├── settings/           # Clarinet network configurations
├── docs/               # Documentation
├── .env               # Environment variables (gitignored)
├── env.template       # Environment template
└── Clarinet.toml      # Clarinet project configuration
```

## Troubleshooting

### Contract Check Fails

- Ensure Clarinet is installed: `clarinet --version`
- Check contract syntax: `clarinet check`
- Review error messages for specific issues

### Frontend Won't Start

- Ensure Node.js 18+ is installed: `node --version`
- Clear node_modules and reinstall:
```bash
  rm -rf node_modules frontend/node_modules
  npm install
  cd frontend && npm install
  ```

### Deployment Fails

- Verify `.env` file exists and has correct values
- Check you have sufficient STX for deployment
- Ensure network is correct (mainnet/testnet)
- Check nonce issues (script handles this automatically)

### Wallet Connection Issues

- Ensure Stacks Wallet extension is installed
- Check network matches (mainnet/testnet)
- Clear browser cache and reload

## Next Steps

1. **Write Tests**: Add tests for all contract functions
2. **Deploy to Testnet**: Test on testnet before mainnet
3. **Build Frontend**: Create additional UI components
4. **Integration**: Connect frontend to deployed contracts

## Resources

- [Clarity Language Docs](https://docs.stacks.co/docs/clarity)
- [Clarinet Docs](https://docs.hiro.so/clarinet)
- [Stacks.js Docs](https://stacks.js.org/)
- [Stacks Connect](https://github.com/stacks/connect)
- [Next.js Docs](https://nextjs.org/docs)

## Support

- Open an issue on GitHub
- Check existing documentation in `docs/`
- Review [Contributing Guide](../CONTRIBUTING.md)
