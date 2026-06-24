import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Gauge, Trophy, Briefcase, Sparkles, Rocket, Store } from "lucide-react";
import { GOLD } from "./mission-control/shared";
import { TodaySection } from "./mission-control/TodaySection";
import { ReputationSection } from "./mission-control/ReputationSection";
import { OpportunitiesSection } from "./mission-control/OpportunitiesSection";
import { MissionsSection } from "./mission-control/MissionsSection";
import { StartupSection } from "./mission-control/StartupSection";
import { MarketplaceSection } from "./mission-control/MarketplaceSection";

const TABS = [
  { value: "today", label: "Today", icon: Gauge, el: <TodaySection /> },
  { value: "missions", label: "Missions", icon: Sparkles, el: <MissionsSection /> },
  { value: "opportunities", label: "Opportunities", icon: Briefcase, el: <OpportunitiesSection /> },
  { value: "reputation", label: "Reputation", icon: Trophy, el: <ReputationSection /> },
  { value: "startup", label: "Startup Builder", icon: Rocket, el: <StartupSection /> },
  { value: "marketplace", label: "AI Marketplace", icon: Store, el: <MarketplaceSection /> },
] as const;

export default function MissionControl() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white/40">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="text-white/50 max-w-md">Your HOPE AI command center — digital twin memory, reputation, opportunities, missions, a startup builder, and the AI marketplace. Sign in to continue.</p>
        <div className="flex gap-3">
          <a href={getLoginUrl()}><Button style={{ backgroundColor: GOLD, color: "#000" }}>Sign in</Button></a>
          <Link href="/"><Button variant="outline" className="border-white/20 text-white/80">Back home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <div className="border-b border-white/10 sticky top-0 z-30" style={{ background: "rgba(5,5,16,0.92)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white/70 text-sm">← Home</Link>
          <div className="w-px h-4 bg-white/15" />
          <div>
            <h1 className="text-lg font-black tracking-tight">Mission <span style={{ color: GOLD }}>Control</span></h1>
            <p className="text-[11px] text-white/40 -mt-0.5">HOPE AI orchestration layer</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="today">
          <TabsList className="bg-white/[0.03] border border-white/10 flex flex-wrap h-auto p-1 mb-6">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 gap-1.5">
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-0">{t.el}</TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
