import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

const { dbMock, notifyOwner } = vi.hoisted(() => ({
  dbMock: {
    listCampaigns: vi.fn(),
    addDonation: vi.fn(),
    markMilestoneNotified: vi.fn(),
    totalDonated: vi.fn(),
    logEvent: vi.fn(),
  },
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./db", () => dbMock);
vi.mock("./_core/notification", () => ({ notifyOwner }));

import { charityRouter } from "./routers/charity";

function authCtx(): TrpcContext {
  return {
    user: {
      id: 3, openId: "u3", email: null, name: "Donor", loginMethod: "manus",
      role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

beforeEach(() => vi.clearAllMocks());

describe("charity.donate", () => {
  it("fires the owner milestone alert when a goal is reached for the first time", async () => {
    dbMock.addDonation.mockResolvedValue({
      id: 9, title: "Plant Trees", goalAmount: 1000, raisedAmount: 1000, milestoneNotified: false,
    });
    const caller = charityRouter.createCaller(authCtx());
    const res = await caller.donate({ campaignId: 9, amount: 200 });
    expect(res.success).toBe(true);
    expect(notifyOwner).toHaveBeenCalledTimes(1);
    expect(dbMock.markMilestoneNotified).toHaveBeenCalledWith(9);
  });

  it("does not re-alert when the milestone was already notified", async () => {
    dbMock.addDonation.mockResolvedValue({
      id: 9, title: "Plant Trees", goalAmount: 1000, raisedAmount: 1200, milestoneNotified: true,
    });
    const caller = charityRouter.createCaller(authCtx());
    await caller.donate({ campaignId: 9, amount: 200 });
    expect(notifyOwner).not.toHaveBeenCalled();
  });

  it("does not alert when the goal is not yet reached", async () => {
    dbMock.addDonation.mockResolvedValue({
      id: 9, title: "Plant Trees", goalAmount: 1000, raisedAmount: 400, milestoneNotified: false,
    });
    const caller = charityRouter.createCaller(authCtx());
    await caller.donate({ campaignId: 9, amount: 50 });
    expect(notifyOwner).not.toHaveBeenCalled();
  });
});
