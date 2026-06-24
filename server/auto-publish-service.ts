import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export class AutoPublishService {
  private publishInterval: NodeJS.Timer | null = null;
  private lastPublishTime: number = 0;
  private publishQueue: string[] = [];

  start() {
    console.log("[AutoPublish] Service started");
    
    // Publish every 5 minutes
    this.publishInterval = setInterval(() => {
      this.attemptPublish();
    }, 5 * 60 * 1000);

    // Initial publish
    this.attemptPublish();
  }

  private attemptPublish() {
    try {
      const now = Date.now();
      const timeSinceLastPublish = now - this.lastPublishTime;

      if (timeSinceLastPublish < 2 * 60 * 1000) {
        console.log("[AutoPublish] Skipping - published recently");
        return;
      }

      console.log("[AutoPublish] Starting deployment...");

      // 1. Build
      console.log("[AutoPublish] Building...");
      execSync("pnpm run build", { stdio: "inherit" });

      // 2. Test
      console.log("[AutoPublish] Testing...");
      execSync("pnpm run test", { stdio: "inherit" });

      // 3. Lint
      console.log("[AutoPublish] Linting...");
      execSync("pnpm run lint", { stdio: "inherit" });

      // 4. Deploy
      console.log("[AutoPublish] Deploying...");
      const deployScript = path.join(process.cwd(), "deploy.sh");
      if (fs.existsSync(deployScript)) {
        execSync(`bash ${deployScript}`, { stdio: "inherit" });
      }

      this.lastPublishTime = now;
      console.log("[AutoPublish] ✅ Deployment successful");

      // Notify
      this.sendNotification("SKYCOIN4444 deployed successfully", "success");
    } catch (error) {
      console.error("[AutoPublish] ❌ Deployment failed:", error);
      this.sendNotification("SKYCOIN4444 deployment failed", "error");
    }
  }

  private sendNotification(message: string, level: "success" | "error") {
    console.log(`[AutoPublish] ${level.toUpperCase()}: ${message}`);
  }

  stop() {
    if (this.publishInterval) {
      clearInterval(this.publishInterval);
      console.log("[AutoPublish] Service stopped");
    }
  }
}

export const autoPublishService = new AutoPublishService();
