// @ts-nocheck
// AUTO-GENERATED DRAFT PROCEDURE: getStakingRewards
import { publicProcedure, router } from "./trpc";
import { getStakingRewardsInputSchema } from "./stakingRewards.schema";
import StakingRewardsService from "./stakingRewards.service";

const stakingRewardsService = new StakingRewardsService();

export const stakingRewardsRouter = router({
  getStakingRewards: publicProcedure
    .input(getStakingRewardsInputSchema)
    .query(async ({ input }) => {
      return stakingRewardsService.getStakingRewards(input);
    }),
});
