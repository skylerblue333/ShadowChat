import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

// --- Mocks (hoisted so vi.mock factories can reference them) ---
const { dbMock, notifyOwner } = vi.hoisted(() => ({
  dbMock: {
    listProposals: vi.fn(),
    getProposal: vi.fn(),
    hasVoted: vi.fn(),
    castVote: vi.fn(),
    getStakingPower: vi.fn(),
    listUserStaking: vi.fn(),
    setStaking: vi.fn(),
    setProposalStatus: vi.fn(),
    logEvent: vi.fn(),
  },
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./db", () => dbMock);
vi.mock("./_core/notification", () => ({ notifyOwner }));

import { governanceRouter } from "./routers/governance";

function authCtx(): TrpcContext {
  return {
    user: {
      id: 7, openId: "u7", email: null, name: "Voter", loginMethod: "manus",
      role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  notifyOwner.mockResolvedValue(true);
});

describe("governance.vote", () => {
  it("rejects a duplicate vote", async () => {
    dbMock.hasVoted.mockResolvedValue(true);
    const caller = governanceRouter.createCaller(authCtx());
    const res = await caller.vote({ proposalId: 1, choice: "for" });
    expect(res.success).toBe(false);
    expect(dbMock.castVote).not.toHaveBeenCalled();
  });

  it("casts a vote with staking-derived power (min 1)", async () => {
    dbMock.hasVoted.mockResolvedValue(false);
    dbMock.getProposal.mockResolvedValue({
      id: 1, title: "P1", ecosystem: "DODGE", status: "active",
      endsAt: new Date(Date.now() + 86400000), votesFor: 0, votesAgainst: 0,
    });
    dbMock.getStakingPower.mockResolvedValue(0); // below 1 -> floor to min 1
    const caller = governanceRouter.createCaller(authCtx());
    const res = await caller.vote({ proposalId: 1, choice: "for" });
    expect(res.success).toBe(true);
    expect(res.power).toBe(1);
    expect(dbMock.castVote).toHaveBeenCalledWith(7, 1, "for", 1);
    expect(notifyOwner).not.toHaveBeenCalled(); // proposal not ended
  });

  it("uses real staking power and resolves+alerts an ended proposal", async () => {
    dbMock.hasVoted.mockResolvedValue(false);
    dbMock.getProposal
      .mockResolvedValueOnce({
        id: 2, title: "Ended", ecosystem: "TRUMP", status: "active",
        endsAt: new Date(Date.now() - 1000), votesFor: 0, votesAgainst: 0,
      })
      .mockResolvedValueOnce({
        id: 2, title: "Ended", ecosystem: "TRUMP", status: "active",
        endsAt: new Date(Date.now() - 1000), votesFor: 120, votesAgainst: 5,
      });
    dbMock.getStakingPower.mockResolvedValue(120.9);
    const caller = governanceRouter.createCaller(authCtx());
    const res = await caller.vote({ proposalId: 2, choice: "for" });
    expect(res.power).toBe(120);
    expect(dbMock.setProposalStatus).toHaveBeenCalledWith(2, "passed");
    expect(notifyOwner).toHaveBeenCalledTimes(1);
  });
});

describe("governance.stake", () => {
  it("persists staking and logs the event", async () => {
    const caller = governanceRouter.createCaller(authCtx());
    const res = await caller.stake({ ecosystem: "SKY444", amount: 500 });
    expect(res.success).toBe(true);
    expect(dbMock.setStaking).toHaveBeenCalledWith(7, "SKY444", 500);
    expect(dbMock.logEvent).toHaveBeenCalled();
  });
});
