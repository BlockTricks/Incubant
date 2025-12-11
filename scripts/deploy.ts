/**
 * Deployment script for Incubant contracts
 * 
 * Usage:
 *   npm run deploy:devnet
 *   npm run deploy:testnet
 * 
 * Make sure to set DEPLOYER_SECRET_KEY in your .env file
 */

import { StacksTestnet, StacksMainnet, StacksDevnet } from "@stacks/network";
import {
  AnchorMode,
  broadcastTransaction,
  makeContractDeploy,
  PostConditionMode,
  TxBroadcastResultOk,
  TxBroadcastResultRejected,
  getAddressFromPrivateKey,
} from "@stacks/transactions";
import * as bip39 from "bip39";
import * as hdkey from "hdkey";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const CONTRACTS = [
  "incubation",
  "token-stream",
  "equity-token",
  "governance",
  "mentorship",
  "staking",
];

async function deployContract(
  contractName: string,
  network: StacksTestnet | StacksMainnet | StacksDevnet,
  deployerKey: string,
  nonce: number
) {
  const contractPath = path.join(__dirname, `../contracts/${contractName}.clar`);
  const contractCode = fs.readFileSync(contractPath, "utf8");

  const deployerAddress = getAddressFromPrivateKey(deployerKey, network.version);
  
  // Estimate fee - mainnet typically needs higher fees
  const fee = network instanceof StacksMainnet ? 50000 : 10000;

  const transaction = await makeContractDeploy({
    contractName,
    codeBody: contractCode,
    senderKey: deployerKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee,
    nonce: Number(nonce),
  });

  console.log(`📤 Broadcasting ${contractName} (nonce: ${nonce})...`);
  const result = await broadcastTransaction(transaction, network);

  if ((result as TxBroadcastResultRejected).error) {
    const error = result as TxBroadcastResultRejected;
    // Check if it's a BadNonce error and extract the expected nonce
    if (error.error === 'transaction rejected' && error.reason === 'BadNonce' && error.reason_data?.expected !== undefined) {
      const expectedNonce = error.reason_data.expected;
      throw new Error(`BAD_NONCE:${expectedNonce}`);
    }
    console.error(`❌ Failed to deploy ${contractName}:`, result);
    throw new Error(`Deployment failed for ${contractName}: ${JSON.stringify(result)}`);
  }

  const txId = (result as TxBroadcastResultOk).txid;
  const contractAddress = `${deployerAddress}.${contractName}`;
  
  const explorerUrl = network instanceof StacksMainnet
    ? `https://explorer.stacks.co/txid/${txId}`
    : network instanceof StacksTestnet
    ? `https://explorer.stacks.co/?chain=testnet&txid=${txId}`
    : `${networkUrl.replace('/v2', '')}/extended/v1/tx/${txId}`;
  
  console.log(`✅ Deployed ${contractName}`);
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Transaction ID: ${txId}`);
  console.log(`   Explorer: ${explorerUrl}\n`);

  return { txId, contractAddress };
}

function derivePrivateKeyFromMnemonic(mnemonic: string): string {
  // Validate mnemonic
  const trimmedMnemonic = mnemonic.trim();
  if (!bip39.validateMnemonic(trimmedMnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  try {
    // Convert mnemonic to seed
    const seed = bip39.mnemonicToSeedSync(trimmedMnemonic);
    
    // Derive master key
    const root = hdkey.fromMasterSeed(seed);
    
    // Stacks uses BIP44 path: m/44'/5757'/0'/0/0
    // 44' = BIP44 purpose
    // 5757' = Stacks coin type
    // 0' = account index
    // 0 = change (external)
    // 0 = address index
    const derived = root.derive("m/44'/5757'/0'/0/0");
    
    // Get private key (32 bytes = 64 hex chars)
    const privateKeyBytes = derived.privateKey;
    const privateKeyHex = Buffer.from(privateKeyBytes).toString('hex');
    
    // Stacks private keys need '01' suffix
    return privateKeyHex + '01';
  } catch (error: any) {
    throw new Error(`Failed to derive private key: ${error.message}`);
  }
}

async function main() {
  const networkType = process.env.STACKS_NETWORK || "devnet";
  let deployerKeyOrMnemonic = process.env.DEPLOYER_SECRET_KEY || process.env.DEPLOYER_MNEMONIC;

  if (!deployerKeyOrMnemonic) {
    console.error("❌ DEPLOYER_SECRET_KEY or DEPLOYER_MNEMONIC not found in .env file");
    process.exit(1);
  }

  // Trim whitespace and remove any quotes, newlines, etc.
  deployerKeyOrMnemonic = deployerKeyOrMnemonic.trim().replace(/^["']|["']$/g, '');
  
  let deployerKey: string;
  
  // Check if it's a mnemonic (multiple words or long string)
  const wordCount = deployerKeyOrMnemonic.split(/\s+/).filter(w => w.length > 0).length;
  const isMnemonic = wordCount >= 12 || deployerKeyOrMnemonic.length > 100;
  
  if (isMnemonic) {
    console.log("🔑 Detected mnemonic phrase, deriving private key...");
    try {
      deployerKey = derivePrivateKeyFromMnemonic(deployerKeyOrMnemonic);
      console.log("✅ Successfully derived private key from mnemonic\n");
    } catch (error: any) {
      console.error("❌ Failed to derive private key from mnemonic:", error.message);
      console.error("   Please check that your mnemonic phrase is correct (12 or 24 words)");
      process.exit(1);
    }
  } else {
    // It's a private key
    deployerKey = deployerKeyOrMnemonic.replace(/\s+/g, '');
    
    // Remove '0x' prefix if present
    if (deployerKey.startsWith('0x')) {
      deployerKey = deployerKey.slice(2);
    }
    
    // Validate secret key format (should be 64 or 66 hex characters)
    const isValidFormat = /^[0-9a-fA-F]{64}(01)?$/.test(deployerKey);
    
    if (!isValidFormat) {
      console.error("❌ Invalid DEPLOYER_SECRET_KEY format");
      console.error(`   Received length: ${deployerKey.length} characters`);
      console.error("   Secret key should be 64 hex characters, optionally followed by '01'");
      console.error("   Total length should be 64 or 66 characters");
      console.error("   Example: 753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601");
      process.exit(1);
    }

    // Ensure it ends with '01' if not already
    if (deployerKey.length === 64) {
      deployerKey = deployerKey + "01";
    }
  }

  let network: StacksTestnet | StacksMainnet | StacksDevnet;
  
  switch (networkType) {
    case "mainnet":
      network = new StacksMainnet();
      break;
    case "testnet":
      network = new StacksTestnet();
      break;
    case "devnet":
    default:
      network = new StacksDevnet({ url: process.env.STACKS_RPC_URL || "http://localhost:20443" });
      break;
  }

  const deployerAddress = getAddressFromPrivateKey(deployerKey, network.version);
  
  // Get network URL
  const networkUrl = network instanceof StacksMainnet 
    ? "https://stacks-node-api.mainnet.stacks.co"
    : network instanceof StacksTestnet
    ? "https://stacks-node-api.testnet.stacks.co"
    : network.getCoreApiUrl?.() || "http://localhost:20443";
  
  console.log(`🚀 Deploying contracts to ${networkType.toUpperCase()}...`);
  console.log(`   Network URL: ${networkUrl}`);
  console.log(`   Deployer Address: ${deployerAddress}`);
  console.log(`   Contracts to deploy: ${CONTRACTS.length}\n`);

  // Get initial nonce by fetching account info
  let currentNonce = BigInt(0);
  try {
    const accountUrl = `${networkUrl}/v2/accounts/${deployerAddress}`;
    console.log(`📡 Fetching account nonce from ${accountUrl}...`);
    const response = await fetch(accountUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const account = await response.json();
      currentNonce = BigInt(account.nonce || 0);
      console.log(`📊 Starting nonce: ${currentNonce}\n`);
    } else {
      const errorText = await response.text();
      console.error(`⚠️  Failed to fetch account: ${response.status}`);
      console.log(`   Will attempt deployment and retry with correct nonce if needed\n`);
    }
  } catch (error: any) {
    console.error(`⚠️  Error fetching account nonce: ${error.message}`);
    console.log(`   Will attempt deployment and retry with correct nonce if needed\n`);
  }

  const deployedContracts: Record<string, { txId: string; address: string }> = {};

  for (let i = 0; i < CONTRACTS.length; i++) {
    const contract = CONTRACTS[i];
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        const result = await deployContract(contract, network, deployerKey, Number(currentNonce));
        deployedContracts[contract] = {
          txId: result.txId,
          address: result.contractAddress,
        };
        currentNonce++;
        break; // Success, exit retry loop
      } catch (error: any) {
        // Check if it's a BadNonce error
        if (error.message && error.message.startsWith('BAD_NONCE:')) {
          const expectedNonce = BigInt(error.message.split(':')[1]);
          console.log(`⚠️  Nonce mismatch. Expected: ${expectedNonce}, Used: ${currentNonce}`);
          currentNonce = expectedNonce;
          retryCount++;
          if (retryCount <= maxRetries) {
            console.log(`🔄 Retrying with correct nonce ${currentNonce}...\n`);
            continue;
          }
        }
        
        // If we've exhausted retries or it's a different error, fail
        console.error(`❌ Error deploying ${contract}:`, error.message || error);
        console.error(`\n⚠️  Deployed ${Object.keys(deployedContracts).length} of ${CONTRACTS.length} contracts`);
        process.exit(1);
      }
    }
    
    // Wait between deployments to avoid rate limiting
    if (i < CONTRACTS.length - 1) {
      console.log(`⏳ Waiting 3 seconds before next deployment...\n`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ All contracts deployed successfully!");
  console.log("=".repeat(60));
  console.log("\n📝 Contract Addresses:\n");
  
  for (const [contract, info] of Object.entries(deployedContracts)) {
    console.log(`${contract.toUpperCase().padEnd(20)} ${info.address}`);
  }
  
  console.log("\n📝 Update your .env file with these addresses:\n");
  for (const [contract, info] of Object.entries(deployedContracts)) {
    const envVar = contract.toUpperCase().replace(/-/g, "_") + "_CONTRACT_ADDRESS";
    console.log(`${envVar}=${info.address}`);
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: networkType,
    deployerAddress,
    deployedAt: new Date().toISOString(),
    contracts: deployedContracts,
  };

  fs.writeFileSync(
    path.join(__dirname, "../deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n💾 Deployment info saved to deployment.json");
  console.log("\n🔍 View transactions on explorer:");
  for (const [contract, info] of Object.entries(deployedContracts)) {
    const explorerUrl = networkType === "mainnet"
      ? `https://explorer.stacks.co/txid/${info.txId}`
      : networkType === "testnet"
      ? `https://explorer.stacks.co/?chain=testnet&txid=${info.txId}`
      : `${networkUrl.replace('/v2', '')}/extended/v1/tx/${info.txId}`;
    console.log(`   ${contract}: ${explorerUrl}`);
  }
}

main().catch(console.error);

