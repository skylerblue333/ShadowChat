import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";

export const beginnerRouter = router({
  // Get beginner-friendly learning path
  getLearningPath: publicProcedure.query(async () => {
    return {
      title: "SKYCOIN4444 Beginner's Journey",
      steps: [
        {
          id: 1,
          title: "Welcome to SKYCOIN4444",
          description: "Learn what SKYCOIN4444 is and explore the main features",
          duration: "5 min",
          type: "intro",
          completed: false,
        },
        {
          id: 2,
          title: "Dashboard Tour",
          description: "Navigate your personal dashboard and understand key metrics",
          duration: "10 min",
          type: "tutorial",
          completed: false,
        },
        {
          id: 3,
          title: "Sky School Basics",
          description: "Start your first course on blockchain fundamentals",
          duration: "20 min",
          type: "course",
          completed: false,
        },
        {
          id: 4,
          title: "Try Arcade Games",
          description: "Play your first game and understand the gaming system",
          duration: "15 min",
          type: "interactive",
          completed: false,
        },
        {
          id: 5,
          title: "Make Your First Trade",
          description: "Generate your first AI trading signal in Day Trade Room",
          duration: "10 min",
          type: "interactive",
          completed: false,
        },
        {
          id: 6,
          title: "Join the Community",
          description: "Create your first social post and follow other users",
          duration: "10 min",
          type: "social",
          completed: false,
        },
        {
          id: 7,
          title: "Support a Charity",
          description: "Make your first donation to a charity campaign",
          duration: "5 min",
          type: "action",
          completed: false,
        },
        {
          id: 8,
          title: "Explore Marketplace",
          description: "Browse and understand the escrow shop system",
          duration: "10 min",
          type: "tutorial",
          completed: false,
        },
      ],
    };
  }),

  // Get simplified feature guide
  getFeatureGuide: publicProcedure
    .input(z.object({ feature: z.string() }))
    .query(async ({ input }) => {
      const guides: Record<string, { title: string; steps: string[] }> = {
        dashboard: {
          title: "Dashboard Guide",
          steps: [
            "Click 'Dashboard' in the navigation",
            "View your token portfolio at the top",
            "Check live activity feed below",
            "See AI agents status on the right",
            "Click any module tile to explore",
          ],
        },
        trading: {
          title: "Day Trade Room Guide",
          steps: [
            "Click 'Trading' in the navigation",
            "Select a trading pair (BTC, ETH, DODGE, SKY444, TRUMP)",
            "Click 'Generate Signal' to get AI recommendation",
            "View BUY/SELL/HOLD with confidence score",
            "Check trade history and P&L below",
          ],
        },
        social: {
          title: "Social Media Guide",
          steps: [
            "Click 'Social' in the navigation",
            "View your feed with latest posts",
            "Click 'Create Post' to share content",
            "Like, comment, and follow other users",
            "Check trending posts section",
          ],
        },
        escrow: {
          title: "Escrow Shop Guide",
          steps: [
            "Click 'Shop' in the navigation",
            "Browse listings by category",
            "Click a listing to see details",
            "Choose payment currency (SKY444, DODGE, TRUMP)",
            "Complete escrow transaction with buyer/seller confirmation",
          ],
        },
        video: {
          title: "Video Area Guide",
          steps: [
            "Click 'Videos' in the navigation",
            "Watch trending videos",
            "Upload your own video content",
            "Like, comment, and share videos",
            "Check live streams section",
          ],
        },
      };

      return guides[input.feature] || { title: "Feature Guide", steps: ["Feature guide not found"] };
    }),

  // Get AI-powered beginner tips
  getBeginnerTips: protectedProcedure.query(async ({ ctx }) => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful SKYCOIN4444 onboarding assistant. Provide 5 beginner-friendly tips for new users. Format as JSON: {tips: [{title: string, description: string}]}",
        } as any,
        {
          role: "user",
          content: "Give me 5 beginner tips for using SKYCOIN4444 effectively.",
        } as any,
      ],
    });

    const contentMsg = response.choices[0]?.message.content;
    const text = typeof contentMsg === "string" ? contentMsg : "{}";
    try {
      const result = JSON.parse(text);
      return result.tips || [];
    } catch {
      return [
        { title: "Start with Dashboard", description: "Get familiar with your dashboard first" },
        { title: "Try Free Courses", description: "All courses are free - start learning today" },
        { title: "Play Games", description: "Earn tokens by playing arcade games" },
        { title: "Join Community", description: "Connect with other users on social media" },
        { title: "Support Charity", description: "Make a difference with donations" },
      ];
    }
  }),

  // Get simplified navigation menu
  getBeginnerMenu: publicProcedure.query(() => {
    return {
      primary: [
        { label: "Dashboard", icon: "📊", path: "/dashboard", description: "Your personal hub" },
        { label: "Learn", icon: "📚", path: "/school", description: "Free courses" },
        { label: "Play", icon: "🎮", path: "/arcade", description: "Arcade games" },
        { label: "Trade", icon: "📈", path: "/trading", description: "AI trading signals" },
      ],
      secondary: [
        { label: "Social", icon: "👥", path: "/social", description: "Connect with community" },
        { label: "Shop", icon: "🛍️", path: "/escrow", description: "Buy & sell items" },
        { label: "Videos", icon: "🎥", path: "/videos", description: "Watch & upload videos" },
        { label: "Charity", icon: "❤️", path: "/charity", description: "Support causes" },
      ],
      advanced: [
        { label: "Governance", icon: "🗳️", path: "/governance", description: "Vote on proposals" },
        { label: "Analytics", icon: "📉", path: "/analytics", description: "Market insights" },
        { label: "Code", icon: "💻", path: "/engineer", description: "AI code assistant" },
      ],
    };
  }),
});
