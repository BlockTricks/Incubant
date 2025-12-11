/**
 * Stacks network configuration
 */

import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";

export const APP_NAME = "Incubant";
export const APP_ICON = "/icon.png";

// Determine network from environment
export const isMainnet = process.env.NEXT_PUBLIC_STACKS_NETWORK === "mainnet";

export const network = isMainnet
  ? STACKS_MAINNET
  : STACKS_TESTNET;

export const EXPLORER_URL = isMainnet
  ? "https://explorer.stacks.co"
  : "https://explorer.stacks.co/?chain=testnet";

export const API_URL = isMainnet
  ? "https://stacks-node-api.mainnet.stacks.co"
  : "https://stacks-node-api.testnet.stacks.co";

