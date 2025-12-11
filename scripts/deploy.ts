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
  getNonce,
} from "@stacks/transactions";
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
    nonce,
  });

  console.log(`📤 Broadcasting ${contractName} (nonce: ${nonce})...`);
  const result = await broadcastTransaction(transaction, network);

  if ((result as TxBroadcastResultRejected).error) {
    console.error(`❌ Failed to deploy ${contractName}:`, result);
    throw new Error(`Deployment failed for ${contractName}: ${JSON.stringify(result)}`);
  }

  const txId = (result as TxBroadcastResultOk).txid;
  const contractAddress = `${deployerAddress}.${contractName}`;
  
  console.log(`✅ Deployed ${contractName}`);
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Transaction ID: ${txId}`);
  console.log(`   Explorer: ${network.getCoreApiUrl().replace('/v2', '')}/extended/v1/tx/${txId}\n`);

  return { txId, contractAddress };
}

async function main() {
  const networkType = process.env.STACKS_NETWORK || "devnet";
  const deployerKey = process.env.DEPLOYER_SECRET_KEY;

  if (!deployerKey) {
    console.error("❌ DEPLOYER_SECRET_KEY not found in .env file");
    process.exit(1);
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
  
  console.log(`🚀 Deploying contracts to ${networkType.toUpperCase()}...`);
  console.log(`   Network URL: ${network.getCoreApiUrl()}`);
  console.log(`   Deployer Address: ${deployerAddress}`);
  console.log(`   Contracts to deploy: ${CONTRACTS.length}\n`);

  // Get initial nonce
  let currentNonce = await getNonce(deployerAddress, network);
  console.log(`📊 Starting nonce: ${currentNonce}\n`);

  const deployedContracts: Record<string, { txId: string; address: string }> = {};

  for (let i = 0; i < CONTRACTS.length; i++) {
    const contract = CONTRACTS[i];
    try {
      const result = await deployContract(contract, network, deployerKey, currentNonce);
      deployedContracts[contract] = {
        txId: result.txId,
        address: result.contractAddress,
      };
      currentNonce++;
      
      // Wait between deployments to avoid rate limiting
      if (i < CONTRACTS.length - 1) {
        console.log(`⏳ Waiting 3 seconds before next deployment...\n`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`❌ Error deploying ${contract}:`, error);
      console.error(`\n⚠️  Deployed ${Object.keys(deployedContracts).length} of ${CONTRACTS.length} contracts`);
      process.exit(1);
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
    const explorerUrl = network.getCoreApiUrl().replace('/v2', '') + `/extended/v1/tx/${info.txId}`;
    console.log(`   ${contract}: ${explorerUrl}`);
  }
}

main().catch(console.error);

