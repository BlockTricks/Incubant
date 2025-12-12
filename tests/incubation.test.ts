import { Clarinet, Tx, Chain, Account, types } from "@hirosystems/clarinet-sdk";
import { assertEquals } from "./deps.ts";

Clarinet.test({
  name: "Should allow applying for incubation",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const applicant = accounts.get("wallet_1")!;

    const block = chain.mineBlock([
      Tx.contractCall(
        "incubation",
        "apply-for-incubation",
        [
          types.ascii("My Startup"),
          types.utf8("A revolutionary DeFi protocol"),
          types.utf8("We plan to build a decentralized exchange with unique features..."),
        ],
        applicant.address
      ),
    ]);

    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk();
  },
});

Clarinet.test({
  name: "Should allow approving startup application",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const applicant = accounts.get("wallet_1")!;

    // First, apply for incubation
    chain.mineBlock([
      Tx.contractCall(
        "incubation",
        "apply-for-incubation",
        [
          types.ascii("My Startup"),
          types.utf8("A revolutionary DeFi protocol"),
          types.utf8("We plan to build a decentralized exchange..."),
        ],
        applicant.address
      ),
    ]);

    // Then approve it
    const block = chain.mineBlock([
      Tx.contractCall(
        "incubation",
        "approve-startup",
        [types.principal(applicant.address)],
        deployer.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "Should allow creating milestones",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const applicant = accounts.get("wallet_1")!;

    // Apply and approve
    chain.mineBlock([
      Tx.contractCall(
        "incubation",
        "apply-for-incubation",
        [
          types.ascii("My Startup"),
          types.utf8("A revolutionary DeFi protocol"),
          types.utf8("We plan to build..."),
        ],
        applicant.address
      ),
    ]);

    chain.mineBlock([
      Tx.contractCall(
        "incubation",
        "approve-startup",
        [types.principal(applicant.address)],
        deployer.address
      ),
    ]);

    // Create milestone
    const block = chain.mineBlock([
      Tx.contractCall(
        "incubation",
        "create-milestone",
        [
          types.uint(1),
          types.ascii("Deploy Smart Contracts"),
          types.utf8("Deploy core smart contracts to testnet"),
          types.uint(10000),
          types.uint(1735689600), // Future timestamp
        ],
        applicant.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectUint(0);
  },
});


