import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  listCourses, insertCourse, insertLesson, listLessons,
  listProposals, insertProposal,
  listCampaigns, insertCampaign,
  listProducts, insertProduct,
} from "../db";

// Idempotent seeding of real catalog content. Safe to call repeatedly:
// it only inserts when a table is empty.
async function doSeed() {
  // Courses + lessons
  if ((await listCourses()).length === 0) {
    const courseData = [
      { title: "Blockchain Fundamentals", description: "Master the core concepts of blockchain, consensus, and decentralization.", category: "Crypto", level: "beginner" as const },
      { title: "Smart Contract Engineering", description: "Write, test, and deploy secure smart contracts.", category: "Crypto", level: "advanced" as const },
      { title: "AI for Builders", description: "Apply large language models to real product workflows.", category: "AI", level: "intermediate" as const },
      { title: "Full-Stack TypeScript", description: "Build production apps with React, Node, and tRPC.", category: "Engineering", level: "intermediate" as const },
      { title: "Cybersecurity Essentials", description: "Defend systems with practical security techniques.", category: "Security", level: "beginner" as const },
      { title: "Trading & Markets 101", description: "Understand market structure, risk, and strategy.", category: "Finance", level: "beginner" as const },
    ];
    for (const c of courseData) {
      await insertCourse({ ...c, lessonCount: 3 });
    }
    const created = await listCourses();
    for (const course of created) {
      const existing = await listLessons(course.id);
      if (existing.length === 0) {
        for (let i = 1; i <= 3; i++) {
          await insertLesson({
            courseId: course.id,
            title: `${course.title} — Module ${i}`,
            content: `# ${course.title} — Module ${i}\n\nThis module covers key concepts and hands-on exercises for ${course.title.toLowerCase()}. Work through the material and mark complete to track your progress.`,
            orderIndex: i,
            durationMin: 15,
          });
        }
      }
    }
  }

  // Governance proposals
  if ((await listProposals()).length === 0) {
    const now = Date.now();
    const future = new Date(now + 7 * 24 * 3600 * 1000);
    await insertProposal({ ecosystem: "DODGE", title: "Fund a community education grant", description: "Allocate treasury to a learning grant for new builders.", endsAt: future, status: "active" });
    await insertProposal({ ecosystem: "DODGE", title: "Increase charity fee share to 2%", description: "Raise the platform fee donated to verified charities from 1% to 2%.", endsAt: future, status: "active" });
    await insertProposal({ ecosystem: "TRUMP", title: "Launch civic education portal", description: "Build civic engagement resources funded by the ecosystem.", endsAt: future, status: "active" });
    await insertProposal({ ecosystem: "TRUMP", title: "Community organizing toolkit", description: "Fund open-source tools for community organizing.", endsAt: future, status: "active" });
  }

  // Charity campaigns
  if ((await listCampaigns()).length === 0) {
    await insertCampaign({ title: "Plant 1 Million Trees", description: "Every new signup plants a tree. Help us reach a million.", goalAmount: 50000 });
    await insertCampaign({ title: "Clean Water Initiative", description: "Provide clean water access to underserved communities.", goalAmount: 30000 });
    await insertCampaign({ title: "Coding Scholarships", description: "Fund scholarships for aspiring developers worldwide.", goalAmount: 40000 });
  }

  // Marketplace products (all FREE - free will upgrade)
  if ((await listProducts()).length === 0) {
    await insertProduct({ title: "SKYCOIN4444 Pro Membership", description: "Premium AI tools and priority support - FREE!", category: "Membership", priceSky: 0 });
    await insertProduct({ title: "HopeAI Credits Pack", description: "10,000 AI engineering credits - FREE!", category: "AI", priceSky: 0 });
    await insertProduct({ title: "Cyberpunk Avatar NFT", description: "Limited edition animated avatar - FREE!", category: "Collectible", priceSky: 0 });
    await insertProduct({ title: "Sky School All-Access", description: "Lifetime access to every course - FREE!", category: "Education", priceSky: 0 });
    await insertProduct({ title: "Governance Booster", description: "2x staking power for one season - FREE!", category: "Governance", priceSky: 0 });
    await insertProduct({ title: "Arcade Token Bundle", description: "5,000 arcade play tokens - FREE!", category: "Gaming", priceSky: 0 });
    await insertProduct({ title: "Trading Pro Suite", description: "Advanced trading signals and AI analysis - FREE!", category: "Trading", priceSky: 0 });
    await insertProduct({ title: "Social Premium", description: "Unlimited posts, followers, and messaging - FREE!", category: "Social", priceSky: 0 });
    await insertProduct({ title: "Video Creator Pack", description: "4K uploads, live streaming, monetization - FREE!", category: "Video", priceSky: 0 });
  }
  return { seeded: true };
}

export const seedRouter = router({
  status: publicProcedure.query(async () => {
    const [c, p, ca, pr] = await Promise.all([listCourses(), listProposals(), listCampaigns(), listProducts()]);
    return { courses: c.length, proposals: p.length, campaigns: ca.length, products: pr.length };
  }),
  seed: adminProcedure.mutation(() => doSeed()),
});

export { doSeed };
