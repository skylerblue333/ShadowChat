import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

const { dbMock, notifyOwner } = vi.hoisted(() => ({
  dbMock: {
    recordGameSession: vi.fn(),
    getLeaderboard: vi.fn(),
    getUserGameStats: vi.fn(),
    addDonation: vi.fn(),
    getCampaign: vi.fn(),
    markMilestoneNotified: vi.fn(),
    logEvent: vi.fn(),
  },
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./db", () => dbMock);
vi.mock("./_core/notification", () => ({ notifyOwner }));

import { gamingRouter } from "./routers/gaming";

function authCtx(): TrpcContext {
  return {
    user: {
      id: 5, openId: "u5", email: null, name: "Pilot", loginMethod: "manus",
      role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

beforeEach(() => vi.clearAllMocks());

describe("gaming.recordSession", () => {
  it("records a session and logs an event", async () => {
    const caller = gamingRouter.createCaller(authCtx());
    const res = await caller.recordSession({ game: "snake", score: 120, result: "Game over" });
    expect(res.success).toBe(true);
    expect(dbMock.recordGameSession).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 5, game: "snake", score: 120 }),
    );
    expect(dbMock.logEvent).toHaveBeenCalledWith("game_played", "gaming", 120, 5);
  });

  it("routes an in-game donation to a campaign and alerts on milestone", async () => {
    dbMock.addDonation.mockResolvedValue({
      id: 2, title: "Ocean Cleanup", goalAmount: 100, raisedAmount: 100, milestoneNotified: false,
    });
    const caller = gamingRouter.createCaller(authCtx());
    await caller.recordSession({ game: "blackjack", score: 200, charityDonation: 10, campaignId: 2 });
    expect(dbMock.addDonation).toHaveBeenCalledWith(2, 10, 5, "game:blackjack");
    expect(notifyOwner).toHaveBeenCalledTimes(1);
    expect(dbMock.markMilestoneNotified).toHaveBeenCalledWith(2);
  });

  it("skips donation routing when no campaign is provided", async () => {
    const caller = gamingRouter.createCaller(authCtx());
    await caller.recordSession({ game: "dice", score: 50, charityDonation: 5 });
    expect(dbMock.addDonation).not.toHaveBeenCalled();
  });

  it("blocks unauthenticated recording", async () => {
    const caller = gamingRouter.createCaller({ user: null, req: {} as any, res: {} as any });
    await expect(caller.recordSession({ game: "dice", score: 10 })).rejects.toThrow();
  });
});
