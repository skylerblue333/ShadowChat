import { router, publicProcedure } from "../_core/trpc";

export const phase29UiRouter = router({
  getUIComponents: publicProcedure.query(async () => ({
    components: [
      { name: "DataTable", version: "2.0" },
      { name: "Charts", version: "3.1" },
      { name: "Forms", version: "2.5" },
      { name: "Modals", version: "1.8" },
    ],
  })),
  getThemes: publicProcedure.query(async () => ({
    themes: ["dark", "light", "auto"],
    current: "dark",
  })),
});
