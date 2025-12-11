/**
 * Contract call utilities for Incubant
 */

import {
  fetchCallReadOnlyFunction,
  uintCV,
  principalCV,
  cvToJSON,
  ClarityValue,
} from "@stacks/transactions";
import { network } from "./stacks-config";
import { CONTRACT_ADDRESSES, CONTRACT_NAMES } from "./contracts";

// Helper to parse contract address
function parseContractAddress(address: string) {
  const [contractAddress, contractName] = address.split(".");
  if (!contractAddress || !contractName) {
    throw new Error(`Invalid contract address: ${address}`);
  }
  return { contractAddress, contractName };
}

// Read-only function call helper
export async function callReadOnly(
  contractAddress: string,
  functionName: string,
  args: ClarityValue[] = [],
  senderAddress: string = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
) {
  const { contractAddress: address, contractName: name } = parseContractAddress(contractAddress);
  
  try {
    const result = await fetchCallReadOnlyFunction({
      network,
      contractAddress: address,
      contractName: name,
      functionName,
      functionArgs: args,
      senderAddress,
    });
    return cvToJSON(result);
  } catch (error) {
    console.error(`Error calling ${contractAddress}::${functionName}:`, error);
    throw error;
  }
}

// Incubation contract calls
export const incubationCalls = {
  async getStartup(startupId: number) {
    return callReadOnly(CONTRACT_ADDRESSES.INCUBATION, "get-startup", [uintCV(startupId)]);
  },

  async getMilestone(startupId: number, milestoneIndex: number) {
    return callReadOnly(
      CONTRACT_ADDRESSES.INCUBATION,
      "get-milestone",
      [uintCV(startupId), uintCV(milestoneIndex)]
    );
  },

  async getApplication(applicant: string) {
    return callReadOnly(
      CONTRACT_ADDRESSES.INCUBATION,
      "get-application",
      [principalCV(applicant)]
    );
  },

  async getNextStartupId() {
    return callReadOnly(CONTRACT_ADDRESSES.INCUBATION, "get-next-startup-id", []);
  },
};

// Governance contract calls
export const governanceCalls = {
  async getProposal(proposalId: number) {
    return callReadOnly(CONTRACT_ADDRESSES.GOVERNANCE, "get-proposal", [uintCV(proposalId)]);
  },

  async getVote(proposalId: number, voter: string) {
    return callReadOnly(
      CONTRACT_ADDRESSES.GOVERNANCE,
      "get-vote",
      [uintCV(proposalId), principalCV(voter)]
    );
  },

  async isProposalPassed(proposalId: number) {
    return callReadOnly(CONTRACT_ADDRESSES.GOVERNANCE, "is-proposal-passed", [uintCV(proposalId)]);
  },
};

// Equity token contract calls
export const equityTokenCalls = {
  async getBalance(owner: string) {
    return callReadOnly(CONTRACT_ADDRESSES.EQUITY_TOKEN, "get-balance", [principalCV(owner)]);
  },

  async getVestingSchedule(recipient: string, startupId: number) {
    return callReadOnly(
      CONTRACT_ADDRESSES.EQUITY_TOKEN,
      "get-vesting-schedule",
      [principalCV(recipient), uintCV(startupId)]
    );
  },

  async getStartupEquity(startupId: number) {
    return callReadOnly(
      CONTRACT_ADDRESSES.EQUITY_TOKEN,
      "get-startup-equity",
      [uintCV(startupId)]
    );
  },
};

// Staking contract calls
export const stakingCalls = {
  async getStakingPool(startupId: number) {
    return callReadOnly(CONTRACT_ADDRESSES.STAKING, "get-staking-pool", [uintCV(startupId)]);
  },

  async getStake(staker: string, startupId: number) {
    return callReadOnly(
      CONTRACT_ADDRESSES.STAKING,
      "get-stake",
      [principalCV(staker), uintCV(startupId)]
    );
  },

  async calculatePendingRewards(staker: string, startupId: number) {
    return callReadOnly(
      CONTRACT_ADDRESSES.STAKING,
      "calculate-pending-rewards",
      [principalCV(staker), uintCV(startupId)]
    );
  },
};

// Mentorship contract calls
export const mentorshipCalls = {
  async getMentorship(mentorshipId: number) {
    return callReadOnly(
      CONTRACT_ADDRESSES.MENTORSHIP,
      "get-mentorship",
      [uintCV(mentorshipId)]
    );
  },

  async getMentorProfile(mentor: string) {
    return callReadOnly(
      CONTRACT_ADDRESSES.MENTORSHIP,
      "get-mentor-profile",
      [principalCV(mentor)]
    );
  },

  async getMentorshipRequest(startupId: number, requester: string) {
    return callReadOnly(
      CONTRACT_ADDRESSES.MENTORSHIP,
      "get-mentorship-request",
      [uintCV(startupId), principalCV(requester)]
    );
  },
};

