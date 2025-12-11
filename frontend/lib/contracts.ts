/**
 * Contract addresses and interaction utilities
 */

export const CONTRACT_ADDRESSES = {
  INCUBATION: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.incubation",
  TOKEN_STREAM: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.token-stream",
  EQUITY_TOKEN: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.equity-token",
  GOVERNANCE: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.governance",
  MENTORSHIP: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.mentorship",
  STAKING: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP.staking",
} as const;

export const CONTRACT_NAMES = {
  INCUBATION: "incubation",
  TOKEN_STREAM: "token-stream",
  EQUITY_TOKEN: "equity-token",
  GOVERNANCE: "governance",
  MENTORSHIP: "mentorship",
  STAKING: "staking",
} as const;

// Helper to get contract address from name
export function getContractAddress(contractName: keyof typeof CONTRACT_NAMES): string {
  return CONTRACT_ADDRESSES[contractName];
}

// Helper to get contract name from address
export function getContractName(address: string): string {
  return address.split(".")[1] || "";
}

